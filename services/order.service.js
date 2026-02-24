const { query, transaction } = require('../db');

class OrderService {
  async createOrder(userId, data) {
    const { addressId, items, couponId, remark } = data;
    
    return transaction(async (connection) => {
      const addressSql = 'SELECT * FROM addresses WHERE id = ? AND user_id = ?';
      const [address] = await connection.execute(addressSql, [addressId, userId]);
      
      if (!address) {
        throw new Error('地址不存在');
      }
      
      let totalAmount = 0;
      const orderItems = [];
      
      for (const item of items) {
        const productSql = 'SELECT id, name, price, stock, images FROM products WHERE id = ? AND status = 1';
        const [product] = await connection.execute(productSql, [item.productId]);
        
        if (!product) {
          throw new Error(`商品 ${item.productId} 不存在`);
        }
        
        if (product.stock < item.quantity) {
          throw new Error(`商品 ${product.name} 库存不足`);
        }
        
        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;
        
        orderItems.push({
          product_id: item.productId,
          product_name: product.name,
          product_image: product.images,
          spec: item.spec || '',
          price: product.price,
          quantity: item.quantity
        });
        
        await connection.execute(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.productId]
        );
      }
      
      let discountAmount = 0;
      if (couponId) {
        const couponSql = `
          SELECT c.*, uc.id as user_coupon_id 
          FROM coupons c
          JOIN user_coupons uc ON c.id = uc.coupon_id
          WHERE uc.id = ? AND uc.user_id = ? AND uc.status = 'unused'
          AND c.status = 'active' AND c.start_time <= NOW() AND c.end_time >= NOW()
        `;
        const [coupon] = await connection.execute(couponSql, [couponId, userId]);
        
        if (coupon) {
          if (coupon.type === 'reduction') {
            if (totalAmount >= coupon.min_amount) {
              discountAmount = coupon.value;
            }
          }
          
          await connection.execute(
            'UPDATE user_coupons SET status = "used", order_id = ?, used_at = NOW() WHERE id = ?',
            [null, couponId]
          );
        }
      }
      
      const payAmount = totalAmount - discountAmount;
      const orderNo = this.generateOrderNo();
      
      const orderSql = `
        INSERT INTO orders (order_no, user_id, total_amount, freight, discount_amount, pay_amount, status,
          receiver_name, receiver_phone, province, city, district, detail_address, remark)
        VALUES (?, ?, ?, 0, ?, ?, 'pending', ?, ?, ?, ?, ?, ?)
      `;
      const [orderResult] = await connection.execute(orderSql, [
        orderNo,
        userId,
        totalAmount,
        discountAmount,
        payAmount,
        address.receiver_name,
        address.receiver_phone,
        address.province,
        address.city,
        address.district,
        address.detail_address,
        remark || ''
      ]);
      
      for (const item of orderItems) {
        await connection.execute(
          `INSERT INTO order_items (order_id, product_id, product_name, product_image, spec, price, quantity)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [orderResult.insertId, item.product_id, item.product_name, item.product_image, item.spec, item.price, item.quantity]
        );
      }
      
      await connection.execute(
        'DELETE FROM cart_items WHERE user_id = ? AND product_id IN (?)',
        [userId, items.map(i => i.productId)]
      );
      
      return {
        orderId: orderResult.insertId,
        orderNo,
        totalAmount,
        discountAmount,
        payAmount
      };
    });
  }
  
  async getOrderList(userId, params) {
    const { status, page = 1, pageSize = 10 } = params;
    const offset = (page - 1) * pageSize;
    
    let whereSql = 'WHERE o.user_id = ?';
    const queryParams = [userId];
    
    if (status) {
      whereSql += ' AND o.status = ?';
      queryParams.push(status);
    }
    
    const sql = `
      SELECT 
        o.*,
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
      FROM orders o
      ${whereSql}
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    queryParams.push(pageSize, offset);
    const list = await query(sql, queryParams);
    
    const countSql = `SELECT COUNT(*) as total FROM orders o ${whereSql}`;
    const [countResult] = await query(countSql, queryParams.slice(0, -2));
    
    return {
      list,
      total: countResult.total,
      page,
      pageSize
    };
  }
  
  async getOrderDetail(id, userId) {
    const sql = `
      SELECT 
        o.*,
        a.receiver_name,
        a.receiver_phone,
        a.province,
        a.city,
        a.district,
        a.detail_address
      FROM orders o
      LEFT JOIN addresses a ON o.receiver_name = a.receiver_name AND o.receiver_phone = a.receiver_phone
      WHERE o.id = ? AND o.user_id = ?
    `;
    
    const [order] = await query(sql, [id, userId]);
    
    if (!order) {
      return null;
    }
    
    const itemsSql = `
      SELECT 
        oi.*,
        p.images,
        p.stock
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;
    
    const items = await query(itemsSql, [id]);
    
    return {
      ...order,
      items: items.map(item => ({
        ...item,
        images: JSON.parse(item.images || '[]')
      }))
    };
  }
  
  async cancelOrder(id, userId) {
    const sql = `
      UPDATE orders 
      SET status = 'cancelled' 
      WHERE id = ? AND user_id = ? AND status = 'pending'
    `;
    const result = await query(sql, [id, userId]);
    
    if (result.affectedRows === 0) {
      throw new Error('订单不存在或状态不允许取消');
    }
    
    return this.getOrderDetail(id, userId);
  }
  
  async payOrder(id, userId, paymentMethod) {
    const sql = `
      UPDATE orders 
      SET payment_method = ?, payment_time = NOW(), status = 'paid' 
      WHERE id = ? AND user_id = ? AND status = 'pending'
    `;
    const result = await query(sql, [paymentMethod, id, userId]);
    
    if (result.affectedRows === 0) {
      throw new Error('订单不存在或状态不允许支付');
    }
    
    return this.getOrderDetail(id, userId);
  }
  
  async confirmReceipt(id, userId) {
    const sql = `
      UPDATE orders 
      SET status = 'completed' 
      WHERE id = ? AND user_id = ? AND status = 'delivered'
    `;
    const result = await query(sql, [id, userId]);
    
    if (result.affectedRows === 0) {
      throw new Error('订单不存在或状态不允许确认收货');
    }
    
    return this.getOrderDetail(id, userId);
  }
  
  async commentOrder(id, userId, data) {
    const { rating, content, images, anonymous } = data;
    
    const orderSql = `
      SELECT * FROM orders 
      WHERE id = ? AND user_id = ? AND status = 'completed'
    `;
    const [order] = await query(orderSql, [id, userId]);
    
    if (!order) {
      throw new Error('订单不存在或状态不允许评价');
    }
    
    const itemsSql = 'SELECT * FROM order_items WHERE order_id = ?';
    const items = await query(itemsSql, [id]);
    
    for (const item of items) {
      await query(
        `INSERT INTO comments (user_id, product_id, order_id, rating, content, images, anonymous)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, item.product_id, id, rating, content, JSON.stringify(images || []), anonymous ? 1 : 0]
      );
    }
    
    return { success: true };
  }
  
  generateOrderNo() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${year}${month}${day}${random}`;
  }
}

module.exports = new OrderService();