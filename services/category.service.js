const { query } = require('../db');

class CategoryService {
  async getCategoryList() {
    const sql = `
      SELECT 
        c.id,
        c.name,
        c.icon,
        c.parent_id,
        c.level,
        c.sort,
        c.status,
        c.created_at,
        c.updated_at
      FROM categories c
      WHERE c.status = 1
      ORDER BY c.level ASC, c.sort ASC, c.id ASC
    `;
    
    const categories = await query(sql);
    
    const result = [];
    const categoryMap = new Map();
    
    categories.forEach(category => {
      const { id, ...rest } = category;
      categoryMap.set(id, { id: String(id), ...rest, children: [] });
    });
    
    categories.forEach(category => {
      if (category.parent_id === 0) {
        result.push(categoryMap.get(category.id));
      } else {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children.push(categoryMap.get(category.id));
        }
      }
    });
    
    return result;
  }
  
  async getCategoryDetail(id) {
    const sql = `
      SELECT 
        c.id,
        c.name,
        c.icon,
        c.parent_id,
        c.level,
        c.sort,
        c.status,
        c.created_at,
        c.updated_at
      FROM categories c
      WHERE c.id = ? AND c.status = 1
    `;
    
    const [category] = await query(sql, [id]);
    
    if (!category) {
      return null;
    }
    
    const childrenSql = `
      SELECT 
        id,
        name,
        icon,
        parent_id,
        level,
        sort,
        status,
        created_at,
        updated_at
      FROM categories
      WHERE parent_id = ? AND status = 1
      ORDER BY sort ASC, id ASC
    `;
    
    const children = await query(childrenSql, [id]);
    
    return {
      ...category,
      children: children.map(child => ({
        ...child,
        id: String(child.id)
      }))
    };
  }
}

module.exports = new CategoryService();