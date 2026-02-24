# 商城小程序项目

## 项目概述

这是一个基于 uni-app + Vue3 + TypeScript 开发的微信小程序商城项目，包含完整的前端、数据库和后端 API 服务。

## 项目结构

```
miniprogram_store/
├── Store_demo/           # 前端小程序项目
│   ├── api/             # API 接口封装
│   ├── pages/           # 页面文件
│   ├── components/      # 组件文件
│   ├── types/           # TypeScript 类型定义
│   ├── utils/           # 工具函数
│   ├── static/          # 静态资源
│   ├── App.vue          # 应用入口
│   ├── main.ts          # 主入口文件
│   ├── pages.json       # 页面配置
│   ├── manifest.json    # 应用配置
│   └── tsconfig.json    # TypeScript 配置
├── mysql/               # 数据库相关
│   ├── schema.sql       # 数据库表结构
│   ├── data.sql         # 示例数据
│   ├── config.json      # 数据库配置
│   └── README.md       # 数据库使用说明
└── server/              # 后端服务
    ├── index.js         # 服务入口
    ├── db.js            # 数据库连接
    ├── package.json     # 依赖配置
    ├── services/        # 服务层
    └── README.md        # 后端服务说明
```

## 技术栈

### 前端
- **框架**: uni-app
- **语言**: TypeScript
- **UI**: Vue3
- **构建工具**: Vite

### 后端
- **运行环境**: Node.js
- **框架**: Express
- **数据库**: MySQL
- **ORM**: mysql2

## 快速开始

### 1. 环境准备

#### 安装 Node.js
下载并安装 Node.js（建议 v18 或更高版本）

#### 安装 MySQL
使用 XAMPP 或单独安装 MySQL

### 2. 数据库配置

#### 使用 XAMPP
1. 启动 XAMPP 的 Apache 和 MySQL 服务
2. 访问 http://localhost/phpmyadmin
3. 导入 `mysql/schema.sql` 创建表结构
4. 导入 `mysql/data.sql` 导入示例数据

#### 使用命令行
```bash
mysql -u root -p < mysql/schema.sql
mysql -u root -p miniprogram_store < mysql/data.sql
```

### 3. 后端服务启动

```bash
cd server
npm install
npm start
```

服务启动后，访问 http://localhost:3000

### 4. 前端项目启动

```bash
cd Store_demo
npm install
npm run dev:mp-weixin
```

使用微信开发者工具打开 `Store_demo/dist/dev/mp-weixin` 目录

## 功能模块

### 用户模块
- 用户登录/注册
- 个人信息管理
- 收货地址管理
- 积分/余额管理

### 商品模块
- 商品列表
- 商品详情
- 商品搜索
- 热门/新品推荐

### 购物车模块
- 添加到购物车
- 购物车列表
- 数量修改
- 选中/取消选中

### 订单模块
- 创建订单
- 订单列表
- 订单详情
- 订单支付
- 订单取消
- 确认收货

### 优惠券模块
- 优惠券领取
- 我的优惠券
- 优惠券使用

### 收藏模块
- 添加收藏
- 取消收藏
- 收藏列表

### 评论模块
- 商品评论
- 评论列表
- 评论统计

### 售后模块
- 售后申请
- 售后列表
- 售后详情

### 搜索模块
- 商品搜索
- 搜索建议
- 热门搜索
- 搜索历史

### 其他模块
- 轮播图
- 公告通知
- 签到功能

## 数据库表

### 核心表
- `users` - 用户表
- `addresses` - 收货地址表
- `categories` - 商品分类表
- `products` - 商品表
- `cart_items` - 购物车表
- `orders` - 订单表
- `order_items` - 订单商品表

### 辅助表
- `coupons` - 优惠券表
- `user_coupons` - 用户优惠券表
- `favorites` - 收藏表
- `comments` - 商品评论表
- `points_records` - 积分记录表
- `balance_records` - 余额记录表
- `after_sales` - 售后申请表
- `banners` - 轮播图表
- `notices` - 公告表
- `search_history` - 搜索历史表
- `notice_reads` - 用户公告阅读记录表
- `check_in_records` - 签到记录表

## API 接口

### 基础 URL
```
http://localhost:3000/api
```

### 商品接口
- `GET /products` - 获取商品列表
- `GET /products/:id` - 获取商品详情
- `GET /products/hot` - 获取热门商品
- `GET /products/new` - 获取新品
- `GET /search` - 搜索商品

### 用户接口
- `GET /user/:id` - 获取用户信息
- `GET /user/:id/addresses` - 获取地址列表
- `POST /user/:id/addresses` - 添加地址
- `PUT /user/:userId/addresses/:id` - 更新地址
- `DELETE /user/:userId/addresses/:id` - 删除地址
- `PUT /user/:userId/addresses/:id/default` - 设置默认地址
- `GET /user/:id/assets` - 获取用户资产

详细的 API 文档请查看 [server/README.md](server/README.md)

## 开发指南

### 前端开发

#### 目录结构说明
```
Store_demo/
├── api/           # API 接口封装
├── pages/         # 页面文件
│   ├── store/     # 商城相关页面
│   └── user/      # 用户相关页面
├── components/    # 公共组件
├── types/         # TypeScript 类型定义
└── utils/         # 工具函数
```

#### API 使用
```typescript
import { productApi, userApi } from '@/api'

// 获取商品列表
const res = await productApi.getProducts({
  categoryId: '1',
  page: 1,
  pageSize: 10
})

// 获取用户信息
const user = await userApi.getUserInfo()
```

#### 页面开发
1. 在 `pages/` 目录下创建页面文件
2. 在 `pages.json` 中配置页面路由
3. 使用 Vue3 Composition API 开发页面

### 后端开发

#### 目录结构说明
```
server/
├── index.js         # 服务入口
├── db.js            # 数据库连接
├── services/        # 服务层
│   ├── product.service.js
│   └── user.service.js
```

#### 添加新接口
1. 在 `services/` 目录下创建或修改服务文件
2. 在 `index.js` 中添加路由
3. 测试接口功能

#### 数据库操作
```javascript
const { query } = require('./db');

// 查询
const result = await query('SELECT * FROM users WHERE id = ?', [userId]);

// 插入
await query('INSERT INTO users (name, email) VALUES (?, ?)', ['张三', 'test@example.com']);

// 更新
await query('UPDATE users SET name = ? WHERE id = ?', ['李四', userId]);

// 删除
await query('DELETE FROM users WHERE id = ?', [userId]);
```

## 部署指南

### 前端部署
1. 使用 HBuilderX 或命令行构建小程序
2. 在微信开发者工具中上传代码
3. 在微信公众平台提交审核

### 后端部署
1. 使用 PM2 管理进程
2. 配置 Nginx 反向代理
3. 配置 SSL 证书（HTTPS）

详细的部署文档请查看 [server/README.md](server/README.md)

## 常见问题

### Q: 如何修改数据库配置？
A: 修改 `mysql/config.json` 和 `server/db.js` 中的数据库配置

### Q: 如何添加新的页面？
A: 在 `Store_demo/pages/` 下创建页面文件，并在 `pages.json` 中配置路由

### Q: 如何添加新的 API？
A: 在 `Store_demo/api/` 下创建 API 文件，在 `server/services/` 下创建服务文件，在 `server/index.js` 中添加路由

### Q: 如何切换到真实 API？
A: 修改 `Store_demo/api/` 下的 API 文件，将模拟数据替换为真实的 API 调用

## 贡献指南

欢迎提交 Issue 和 Pull Request

## 许可证

MIT License

## 联系方式

如有问题，请联系开发团队。