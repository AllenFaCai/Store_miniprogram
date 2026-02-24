const { query } = require('../db');

class CartService {
  async getCartList(userId) {
    const sql = `
      SELECT 
        ci.id,
        ci.user_id,
        ci.product_id,
        ci.quantity,
        ci.spec,
        ci.selected,
        ci.created_at,
        ci.updated_at,
        p.name as product_name,
        p.price as product_price,
        p.images as product_images,
        p.stock as product_stock,
        p.status as product_status
      FROM cart_items ci
      LEFT JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC
    `;
    
    const cartItems = await query(sql, [userId]);
    
    return cartItems.map(item => ({
      ...item,
      product_images: JSON.parse(item.product_images || '[]')
    }));
  }
  
  async addToCart(userId, data) {
    const { product_id, quantity, spec } = data;
    
    const existingSql = 'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ? AND spec = ?';
    const [existing] = await query(existingSql, [userId, product_id, spec]);
    
    if (existing) {
      const updateSql = 'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?';
      await query(updateSql, [quantity, existing.id]);
      return this.getCartItemById(existing.id);
    } else {
      const insertSql = `
        INSERT INTO cart_items (user_id, product_id, quantity, spec, selected)
        VALUES (?, ?, ?, ?, 1)
      `;
      const result = await query(insertSql, [userId, product_id, quantity, spec]);
      return this.getCartItemById(result.insertId);
    }
  }
  
  async updateCartQuantity(id, quantity) {
    const sql = 'UPDATE cart_items SET quantity = ? WHERE id = ?';
    await query(sql, [quantity, id]);
    return this.getCartItemById(id);
  }
  
  async updateCartChecked(id, checked) {
    const sql = 'UPDATE cart_items SET selected = ? WHERE id = ?';
    await query(sql, [checked ? 1 : 0, id]);
    return this.getCartItemById(id);
  }
  
  async updateCartCheckedAll(userId, checked) {
    const sql = 'UPDATE cart_items SET selected = ? WHERE user_id = ?';
    await query(sql, [checked ? 1 : 0, userId]);
    return this.getCartList(userId);
  }
  
  async deleteCartItem(id) {
    const sql = 'DELETE FROM cart_items WHERE id = ?';
    await query(sql, [id]);
    return { id };
  }
  
  async clearCart(userId) {
    const sql = 'DELETE FROM cart_items WHERE user_id = ?';
    await query(sql, [userId]);
    return { success: true };
  }
  
  async getCartCount(userId) {
    const sql = 'SELECT COUNT(*) as count FROM cart_items WHERE user_id = ?';
    const [result] = await query(sql, [userId]);
    return result.count;
  }
  
  async getCartItemById(id) {
    const sql = `
      SELECT 
        ci.id,
        ci.user_id,
        ci.product_id,
        ci.quantity,
        ci.spec,
        ci.selected,
        ci.created_at,
        ci.updated_at,
        p.name as product_name,
        p.price as product_price,
        p.images as product_images,
        p.stock as product_stock
      FROM cart_items ci
      LEFT JOIN products p ON ci.product_id = p.id
      WHERE ci.id = ?
    `;
    
    const [item] = await query(sql, [id]);
    
    if (!item) {
      return null;
    }
    
    return {
      ...item,
      product_images: JSON.parse(item.product_images || '[]')
    };
  }
}

module.exports = new CartService();