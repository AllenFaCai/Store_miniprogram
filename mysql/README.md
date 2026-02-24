# 数据库使用说明

## 概述

本项目包含完整的商城数据库表结构和示例数据，支持小程序的所有功能。

## 文件说明

```
mysql/
├── schema.sql      # 数据库表结构定义
├── data.sql        # 示例数据
└── config.json     # 数据库配置文件
```

## 数据库表结构

### 核心表

1. **users** - 用户表
   - 存储用户基本信息、积分、余额等
   - 关键字段：openid, nickname, phone, points, balance

2. **addresses** - 收货地址表
   - 存储用户的收货地址信息
   - 关键字段：user_id, receiver_name, receiver_phone, is_default

3. **categories** - 商品分类表
   - 支持多级分类
   - 关键字段：name, parent_id, level

4. **products** - 商品表
   - 存储商品基本信息、库存、销量等
   - 关键字段：name, price, stock, category_id, is_hot, is_new

5. **cart_items** - 购物车表
   - 存储用户的购物车商品
   - 关键字段：user_id, product_id, quantity, selected

6. **orders** - 订单表
   - 存储订单基本信息
   - 关键字段：order_no, user_id, status, total_amount

7. **order_items** - 订单商品表
   - 存储订单中的商品明细
   - 关键字段：order_id, product_id, quantity, price

### 辅助表

8. **coupons** - 优惠券表
   - 存储优惠券信息
   - 关键字段：name, type, value, min_amount

9. **user_coupons** - 用户优惠券表
   - 存储用户领取的优惠券
   - 关键字段：user_id, coupon_id, status

10. **favorites** - 收藏表
    - 存储用户的收藏商品
    - 关键字段：user_id, product_id

11. **comments** - 商品评论表
    - 存储商品评论
    - 关键字段：user_id, product_id, rating, content

12. **points_records** - 积分记录表
    - 存储积分变动记录
    - 关键字段：user_id, type, amount

13. **balance_records** - 余额记录表
    - 存储余额变动记录
    - 关键字段：user_id, type, amount

14. **after_sales** - 售后申请表
    - 存储售后申请信息
    - 关键字段：user_id, order_id, type, status

15. **banners** - 轮播图表
    - 存储轮播图信息
    - 关键字段：title, image, link, position

16. **notices** - 公告表
    - 存储公告信息
    - 关键字段：title, content, type

17. **search_history** - 搜索历史表
    - 存储搜索历史和热门搜索
    - 关键字段：user_id, keyword, count

18. **notice_reads** - 用户公告阅读记录表
    - 记录用户已读的公告
    - 关键字段：user_id, notice_id

19. **check_in_records** - 签到记录表
    - 记录用户签到信息
    - 关键字段：user_id, check_in_date, consecutive_days

## 使用方法

### 1. 使用 XAMPP 导入数据库

1. 启动 XAMPP 的 Apache 和 MySQL 服务
2. 打开浏览器访问 http://localhost/phpmyadmin
3. 登录 phpMyAdmin（默认用户名：root，密码：空）
4. 点击"新建"创建数据库，数据库名为 `miniprogram_store`
5. 选择新建的数据库
6. 点击"导入"标签
7. 选择 `schema.sql` 文件，点击"执行"创建表结构
8. 再次点击"导入"，选择 `data.sql` 文件，点击"执行"导入示例数据

### 2. 使用命令行导入数据库

```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE miniprogram_store DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 使用数据库
USE miniprogram_store;

# 导入表结构
SOURCE d:/Project/Allen_Project/miniprogram/miniprogram_store/mysql/schema.sql;

# 导入示例数据
SOURCE d:/Project/Allen_Project/miniprogram/miniprogram_store/mysql/data.sql;
```

### 3. 使用 Navicat 导入数据库

1. 打开 Navicat，连接到 MySQL 数据库
2. 右键点击连接，选择"新建数据库"
3. 数据库名：`miniprogram_store`，字符集：`utf8mb4`
4. 双击打开新建的数据库
5. 右键点击数据库名，选择"运行 SQL 文件"
6. 选择 `schema.sql` 文件，点击"开始"
7. 再次运行 `data.sql` 文件导入示例数据

## 配置文件

### config.json

```json
{
  "database": {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "",
    "database": "miniprogram_store",
    "charset": "utf8mb4",
    "timezone": "+08:00"
  }
}
```

根据实际情况修改配置：
- `host`: 数据库服务器地址
- `port`: 数据库端口（默认 3306）
- `user`: 数据库用户名
- `password`: 数据库密码
- `database`: 数据库名称

## 数据库设计特点

1. **完整的业务覆盖**：涵盖商城的所有核心功能
2. **合理的表结构**：遵循数据库设计规范，建立适当的索引
3. **支持多级分类**：categories 表支持无限级分类
4. **订单状态管理**：orders 表包含完整的订单状态流转
5. **积分余额系统**：独立的记录表，便于追溯和统计
6. **灵活的规格管理**：products 表使用 JSON 存储商品规格
7. **搜索功能**：search_history 表支持热门搜索和个人搜索历史

## 索引说明

所有表都建立了合理的索引：
- 主键索引：所有表的 id 字段
- 唯一索引：如 users.openid, orders.order_no
- 普通索引：如 user_id, category_id, status 等常用查询字段

## 数据类型说明

- `bigint(20) UNSIGNED`: 主键 ID，支持大数量级
- `varchar`: 字符串类型，长度根据实际需求设定
- `text`: 长文本，如商品详情、评论内容
- `decimal(10,2)`: 金额类型，精确到分
- `int`: 整数类型，如库存、销量、积分
- `tinyint`: 小整数，用于状态、开关等
- `datetime`: 日期时间类型
- `date`: 日期类型
- `json`: JSON 类型，存储结构化数据

## 字符集和排序规则

- 字符集：`utf8mb4` - 支持 emoji 和特殊字符
- 排序规则：`utf8mb4_unicode_ci` - 不区分大小写的 Unicode 排序

## 注意事项

1. **密码安全**：生产环境中请修改数据库密码
2. **备份**：定期备份数据库数据
3. **性能优化**：根据实际查询情况优化索引
4. **数据清理**：定期清理过期数据，如过期的优惠券、搜索历史等
5. **权限管理**：生产环境中使用专用数据库用户，限制权限

## 扩展建议

1. **分表分库**：当数据量很大时，考虑对订单表、商品表等进行分表
2. **缓存**：对热点数据使用 Redis 缓存，如商品信息、分类信息
3. **读写分离**：使用主从复制，读写分离提升性能
4. **日志表**：增加操作日志表，记录关键操作
5. **统计表**：增加统计表，定期汇总数据，提升查询性能

## 常见问题

### Q: 如何修改数据库密码？

A: 在 MySQL 中执行：
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码';
FLUSH PRIVILEGES;
```

### Q: 如何清空所有数据？

A: 删除数据库后重新创建：
```sql
DROP DATABASE miniprogram_store;
CREATE DATABASE miniprogram_store DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Q: 如何只清空数据保留表结构？

A: 使用 TRUNCATE 清空表：
```sql
TRUNCATE TABLE table_name;
```

### Q: 如何导出数据库？

A: 使用 mysqldump：
```bash
mysqldump -u root -p miniprogram_store > backup.sql
```

## 技术支持

如有问题，请联系开发团队。