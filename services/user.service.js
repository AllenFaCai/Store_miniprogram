const { query } = require('../db');

class UserService {
  async getUserByOpenid(openid) {
    const sql = 'SELECT * FROM users WHERE openid = ?';
    const [user] = await query(sql, [openid]);
    return user;
  }
  
  async getUserById(id) {
    const sql = 'SELECT id, openid, nickname, avatar, gender, phone, email, points, balance, status FROM users WHERE id = ?';
    const [user] = await query(sql, [id]);
    return user;
  }
  
  async createUser(data) {
    const { openid, nickname, avatar, gender, phone, email } = data;
    const sql = `
      INSERT INTO users (openid, nickname, avatar, gender, phone, email, points, balance, status)
      VALUES (?, ?, ?, ?, ?, ?, 0, 0, 1)
    `;
    const result = await query(sql, [openid, nickname, avatar, gender, phone, email]);
    return this.getUserById(result.insertId);
  }
  
  async updateUser(id, data) {
    const fields = [];
    const values = [];
    
    if (data.nickname !== undefined) {
      fields.push('nickname = ?');
      values.push(data.nickname);
    }
    if (data.avatar !== undefined) {
      fields.push('avatar = ?');
      values.push(data.avatar);
    }
    if (data.phone !== undefined) {
      fields.push('phone = ?');
      values.push(data.phone);
    }
    if (data.email !== undefined) {
      fields.push('email = ?');
      values.push(data.email);
    }
    
    if (fields.length === 0) {
      return this.getUserById(id);
    }
    
    values.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, values);
    return this.getUserById(id);
  }
  
  async updatePoints(userId, amount, type, description) {
    const connection = await require('../db').pool.getConnection();
    try {
      await connection.beginTransaction();
      
      const operator = type === 'earn' ? '+' : '-';
      await connection.execute(
        `UPDATE users SET points = points ${operator} ? WHERE id = ?`,
        [amount, userId]
      );
      
      await connection.execute(
        `INSERT INTO points_records (user_id, type, amount, description) VALUES (?, ?, ?, ?)`,
        [userId, type, amount, description]
      );
      
      await connection.commit();
      return this.getUserById(userId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  async updateBalance(userId, amount, type, description) {
    const connection = await require('../db').pool.getConnection();
    try {
      await connection.beginTransaction();
      
      const operator = type === 'recharge' || type === 'refund' ? '+' : '-';
      await connection.execute(
        `UPDATE users SET balance = balance ${operator} ? WHERE id = ?`,
        [amount, userId]
      );
      
      await connection.execute(
        `INSERT INTO balance_records (user_id, type, amount, description) VALUES (?, ?, ?, ?)`,
        [userId, type, amount, description]
      );
      
      await connection.commit();
      return this.getUserById(userId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  async getAddresses(userId) {
    const sql = 'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC';
    return await query(sql, [userId]);
  }
  
  async getAddressById(id, userId) {
    const sql = 'SELECT * FROM addresses WHERE id = ? AND user_id = ?';
    const [address] = await query(sql, [id, userId]);
    return address;
  }
  
  async addAddress(userId, data) {
    const { receiver_name, receiver_phone, province, city, district, detail_address, is_default } = data;
    
    const connection = await require('../db').pool.getConnection();
    try {
      await connection.beginTransaction();
      
      if (is_default) {
        await connection.execute(
          'UPDATE addresses SET is_default = 0 WHERE user_id = ?',
          [userId]
        );
      }
      
      const result = await connection.execute(
        `INSERT INTO addresses (user_id, receiver_name, receiver_phone, province, city, district, detail_address, is_default)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, receiver_name, receiver_phone, province, city, district, detail_address, is_default ? 1 : 0]
      );
      
      await connection.commit();
      return this.getAddressById(result[0].insertId, userId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  async updateAddress(id, userId, data) {
    const fields = [];
    const values = [];
    
    if (data.receiver_name !== undefined) {
      fields.push('receiver_name = ?');
      values.push(data.receiver_name);
    }
    if (data.receiver_phone !== undefined) {
      fields.push('receiver_phone = ?');
      values.push(data.receiver_phone);
    }
    if (data.province !== undefined) {
      fields.push('province = ?');
      values.push(data.province);
    }
    if (data.city !== undefined) {
      fields.push('city = ?');
      values.push(data.city);
    }
    if (data.district !== undefined) {
      fields.push('district = ?');
      values.push(data.district);
    }
    if (data.detail_address !== undefined) {
      fields.push('detail_address = ?');
      values.push(data.detail_address);
    }
    if (data.is_default !== undefined) {
      fields.push('is_default = ?');
      values.push(data.is_default ? 1 : 0);
    }
    
    if (fields.length === 0) {
      return this.getAddressById(id, userId);
    }
    
    values.push(id, userId);
    const sql = `UPDATE addresses SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
    await query(sql, values);
    return this.getAddressById(id, userId);
  }
  
  async deleteAddress(id, userId) {
    const sql = 'DELETE FROM addresses WHERE id = ? AND user_id = ?';
    await query(sql, [id, userId]);
  }
  
  async setDefaultAddress(id, userId) {
    const connection = await require('../db').pool.getConnection();
    try {
      await connection.beginTransaction();
      
      await connection.execute(
        'UPDATE addresses SET is_default = 0 WHERE user_id = ?',
        [userId]
      );
      
      await connection.execute(
        'UPDATE addresses SET is_default = 1 WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      
      await connection.commit();
      return this.getAddressById(id, userId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  async getUserAssets(userId) {
    const sql = `
      SELECT 
        u.points,
        u.balance,
        (SELECT COUNT(*) FROM user_coupons WHERE user_id = ? AND status = 'unused') as coupon_count,
        (SELECT COUNT(*) FROM favorites WHERE user_id = ?) as favorite_count
      FROM users u
      WHERE u.id = ?
    `;
    const [result] = await query(sql, [userId, userId, userId]);
    return result;
  }
}

module.exports = new UserService();