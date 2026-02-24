const { query, transaction } = require('../db');

class ProductService {
  async getProducts(params = {}) {
    const { categoryId, page = 1, pageSize = 10, keyword, sort, status } = params;
    const offset = (page - 1) * pageSize;
    
    let whereSql = 'WHERE 1=1';
    const queryParams = [];
    
    if (status !== undefined) {
      whereSql += ' AND p.status = ?';
      queryParams.push(status);
    }
    
    if (categoryId) {
      whereSql += ' AND p.category_id = ?';
      queryParams.push(categoryId);
    }
    
    if (keyword) {
      whereSql += ' AND p.name LIKE ?';
      queryParams.push(`%${keyword}%`);
    }
    
    let orderSql = 'ORDER BY p.sort ASC, p.id DESC';
    if (sort === 'price_asc') {
      orderSql = 'ORDER BY p.price ASC';
    } else if (sort === 'price_desc') {
      orderSql = 'ORDER BY p.price DESC';
    } else if (sort === 'sales') {
      orderSql = 'ORDER BY p.sales DESC';
    }
    
    const sql = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.original_price,
        p.stock,
        p.sales,
        p.category_id,
        p.images,
        p.is_hot,
        p.is_new,
        p.is_recommend,
        p.status,
        p.created_at,
        p.updated_at
      FROM products p
      ${whereSql}
      ${orderSql}
      LIMIT ? OFFSET ?
    `;
    
    queryParams.push(pageSize, offset);
    
    const list = await query(sql, queryParams);
    
    const countSql = `SELECT COUNT(*) as total FROM products p ${whereSql}`;
    const [countResult] = await query(countSql, queryParams.slice(0, -2));
    
    return {
      list,
      total: countResult.total,
      page,
      pageSize
    };
  }
  
  async getProductDetail(id) {
    const sql = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.original_price,
        p.cost_price,
        p.stock,
        p.sales,
        p.category_id,
        p.images,
        p.details,
        p.specs,
        p.is_hot,
        p.is_new,
        p.is_recommend,
        p.status,
        p.created_at,
        p.updated_at,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `;
    
    const [product] = await query(sql, [id]);
    
    if (!product) {
      return null;
    }
    
    product.images = JSON.parse(product.images || '[]');
    product.specs = JSON.parse(product.specs || '[]');
    
    return product;
  }
  
  async getHotProducts(limit = 10) {
    const sql = `
      SELECT 
        p.id,
        p.name,
        p.price,
        p.original_price,
        p.images,
        p.sales,
        p.is_hot
      FROM products p
      WHERE p.status = 1 AND p.is_hot = 1
      ORDER BY p.sales DESC
      LIMIT ?
    `;
    
    const products = await query(sql, [limit]);
    return products.map(p => ({
      ...p,
      images: JSON.parse(p.images || '[]')
    }));
  }
  
  async getNewProducts(limit = 10) {
    const sql = `
      SELECT 
        p.id,
        p.name,
        p.price,
        p.original_price,
        p.images,
        p.is_new
      FROM products p
      WHERE p.status = 1 AND p.is_new = 1
      ORDER BY p.created_at DESC
      LIMIT ?
    `;
    
    const products = await query(sql, [limit]);
    return products.map(p => ({
      ...p,
      images: JSON.parse(p.images || '[]')
    }));
  }
  
  async searchProducts(params) {
    const { keyword, page = 1, pageSize = 10, sort, categoryId, minPrice, maxPrice } = params;
    const offset = (page - 1) * pageSize;
    
    let whereSql = 'WHERE p.status = 1 AND p.name LIKE ?';
    const queryParams = [`%${keyword}%`];
    
    if (categoryId) {
      whereSql += ' AND p.category_id = ?';
      queryParams.push(categoryId);
    }
    
    if (minPrice) {
      whereSql += ' AND p.price >= ?';
      queryParams.push(minPrice);
    }
    
    if (maxPrice) {
      whereSql += ' AND p.price <= ?';
      queryParams.push(maxPrice);
    }
    
    let orderSql = 'ORDER BY p.sort ASC, p.id DESC';
    if (sort === 'price_asc') {
      orderSql = 'ORDER BY p.price ASC';
    } else if (sort === 'price_desc') {
      orderSql = 'ORDER BY p.price DESC';
    } else if (sort === 'sales') {
      orderSql = 'ORDER BY p.sales DESC';
    }
    
    const sql = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.original_price,
        p.stock,
        p.sales,
        p.category_id,
        p.images,
        p.is_hot,
        p.is_new,
        p.created_at,
        p.updated_at
      FROM products p
      ${whereSql}
      ${orderSql}
      LIMIT ? OFFSET ?
    `;
    
    queryParams.push(pageSize, offset);
    
    const list = await query(sql, queryParams);
    
    const countSql = `SELECT COUNT(*) as total FROM products p ${whereSql}`;
    const [countResult] = await query(countSql, queryParams.slice(0, -2));
    
    return {
      keyword,
      list,
      total: countResult.total,
      page,
      pageSize
    };
  }

  async createProduct(data) {
    const {
      name,
      categoryId,
      price,
      originalPrice,
      stock,
      description,
      images,
      spec,
      specValue,
      status = 1
    } = data;

    const specs = spec && specValue ? [{ name: spec, values: specValue.split(',').map(v => v.trim()) }] : [];

    const sql = `
      INSERT INTO products (
        name, category_id, price, original_price, stock, 
        description, images, specs, status, sales, 
        is_hot, is_new, is_recommend, sort
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, 0)
    `;

    const imagesJson = JSON.stringify(images);
    const specsJson = JSON.stringify(specs);

    const [result] = await query(sql, [
      name,
      categoryId,
      price,
      originalPrice || null,
      stock,
      description || null,
      imagesJson,
      specsJson,
      status
    ]);

    return {
      id: result.insertId,
      name,
      categoryId,
      price,
      originalPrice,
      stock,
      description,
      images,
      spec,
      specValue,
      status
    };
  }

  async updateProduct(id, data) {
    const {
      name,
      categoryId,
      price,
      originalPrice,
      stock,
      description,
      images,
      spec,
      specValue,
      status
    } = data;

    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (categoryId !== undefined) {
      updates.push('category_id = ?');
      values.push(categoryId);
    }
    if (price !== undefined) {
      updates.push('price = ?');
      values.push(price);
    }
    if (originalPrice !== undefined) {
      updates.push('original_price = ?');
      values.push(originalPrice);
    }
    if (stock !== undefined) {
      updates.push('stock = ?');
      values.push(stock);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (images !== undefined) {
      updates.push('images = ?');
      values.push(JSON.stringify(images));
    }
    if (spec !== undefined && specValue !== undefined) {
      const specs = [{ name: spec, values: specValue.split(',').map(v => v.trim()) }];
      updates.push('specs = ?');
      values.push(JSON.stringify(specs));
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      return null;
    }

    values.push(id);
    const sql = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
    await query(sql, values);

    const sql2 = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.original_price,
        p.stock,
        p.sales,
        p.category_id,
        p.images,
        p.is_hot,
        p.is_new,
        p.is_recommend,
        p.status,
        p.created_at,
        p.updated_at
      FROM products p
      WHERE p.id = ?
    `;
    
    const [product] = await query(sql2, [id]);
    
    if (!product) {
      return null;
    }
    
    product.images = JSON.parse(product.images || '[]');
    return product;
  }

  async updateProductStatus(id, status) {
    const sql = `UPDATE products SET status = ? WHERE id = ?`;
    await query(sql, [status, id]);

    const sql2 = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.original_price,
        p.stock,
        p.sales,
        p.category_id,
        p.images,
        p.is_hot,
        p.is_new,
        p.is_recommend,
        p.status,
        p.created_at,
        p.updated_at
      FROM products p
      WHERE p.id = ?
    `;
    
    const [product] = await query(sql2, [id]);
    
    if (!product) {
      return null;
    }
    
    product.images = JSON.parse(product.images || '[]');
    return product;
  }

  async deleteProduct(id) {
    const sql = `DELETE FROM products WHERE id = ?`;
    await query(sql, [id]);
  }
}

module.exports = new ProductService();