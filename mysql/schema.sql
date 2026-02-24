-- 商城数据库表结构设计
-- 创建数据库
CREATE DATABASE IF NOT EXISTS miniprogram_store DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE miniprogram_store;

-- 1. 用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `openid` varchar(64) NOT NULL COMMENT '微信openid',
  `unionid` varchar(64) DEFAULT NULL COMMENT '微信unionid',
  `nickname` varchar(50) NOT NULL COMMENT '昵称',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
  `gender` tinyint(1) DEFAULT 0 COMMENT '性别：0-未知，1-男，2-女',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `points` int(11) DEFAULT 0 COMMENT '积分',
  `balance` decimal(10,2) DEFAULT 0.00 COMMENT '余额',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态：0-禁用，1-正常',
  `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` varchar(50) DEFAULT NULL COMMENT '最后登录IP',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_openid` (`openid`),
  KEY `idx_phone` (`phone`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 2. 收货地址表
CREATE TABLE IF NOT EXISTS `addresses` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '地址ID',
  `user_id` bigint(20) UNSIGNED NOT NULL COMMENT '用户ID',
  `receiver_name` varchar(50) NOT NULL COMMENT '收货人姓名',
  `receiver_phone` varchar(20) NOT NULL COMMENT '收货人电话',
  `province` varchar(50) NOT NULL COMMENT '省份',
  `city` varchar(50) NOT NULL COMMENT '城市',
  `district` varchar(50) NOT NULL COMMENT '区县',
  `detail_address` varchar(255) NOT NULL COMMENT '详细地址',
  `is_default` tinyint(1) DEFAULT 0 COMMENT '是否默认：0-否，1-是',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收货地址表';

-- 3. 商品分类表
CREATE TABLE IF NOT EXISTS `categories` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` varchar(50) NOT NULL COMMENT '分类名称',
  `icon` varchar(255) DEFAULT NULL COMMENT '分类图标',
  `parent_id` bigint(20) UNSIGNED DEFAULT 0 COMMENT '父分类ID',
  `level` tinyint(1) DEFAULT 1 COMMENT '分类层级',
  `sort` int(11) DEFAULT 0 COMMENT '排序',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_level` (`level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品分类表';

-- 4. 商品表
CREATE TABLE IF NOT EXISTS `products` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  `name` varchar(200) NOT NULL COMMENT '商品名称',
  `description` text COMMENT '商品描述',
  `price` decimal(10,2) NOT NULL COMMENT '商品价格',
  `original_price` decimal(10,2) DEFAULT NULL COMMENT '原价',
  `cost_price` decimal(10,2) DEFAULT NULL COMMENT '成本价',
  `stock` int(11) DEFAULT 0 COMMENT '库存',
  `sales` int(11) DEFAULT 0 COMMENT '销量',
  `category_id` bigint(20) UNSIGNED NOT NULL COMMENT '分类ID',
  `images` json DEFAULT NULL COMMENT '商品图片',
  `details` longtext COMMENT '商品详情',
  `specs` json DEFAULT NULL COMMENT '商品规格',
  `is_hot` tinyint(1) DEFAULT 0 COMMENT '是否热门：0-否，1-是',
  `is_new` tinyint(1) DEFAULT 0 COMMENT '是否新品：0-否，1-是',
  `is_recommend` tinyint(1) DEFAULT 0 COMMENT '是否推荐：0-否，1-是',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态：0-下架，1-上架',
  `sort` int(11) DEFAULT 0 COMMENT '排序',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_status` (`status`),
  KEY `idx_is_hot` (`is_hot`),
  KEY `idx_is_new` (`is_new`),
  KEY `idx_sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品表';

-- 5. 购物车表
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '购物车ID',
  `user_id` bigint(20) UNSIGNED NOT NULL COMMENT '用户ID',
  `product_id` bigint(20) UNSIGNED NOT NULL COMMENT '商品ID',
  `quantity` int(11) NOT NULL DEFAULT 1 COMMENT '数量',
  `spec` varchar(255) DEFAULT NULL COMMENT '规格',
  `selected` tinyint(1) DEFAULT 1 COMMENT '是否选中：0-否，1-是',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_product` (`user_id`, `product_id`, `spec`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='购物车表';

-- 6. 订单表
CREATE TABLE IF NOT EXISTS `orders` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_no` varchar(32) NOT NULL COMMENT '订单编号',
  `user_id` bigint(20) UNSIGNED NOT NULL COMMENT '用户ID',
  `total_amount` decimal(10,2) NOT NULL COMMENT '订单总金额',
  `freight` decimal(10,2) DEFAULT 0.00 COMMENT '运费',
  `discount_amount` decimal(10,2) DEFAULT 0.00 COMMENT '优惠金额',
  `pay_amount` decimal(10,2) NOT NULL COMMENT '实付金额',
  `payment_method` varchar(20) DEFAULT NULL COMMENT '支付方式',
  `payment_time` datetime DEFAULT NULL COMMENT '支付时间',
  `status` varchar(20) NOT NULL DEFAULT 'pending' COMMENT '订单状态：pending-待支付，paid-待发货，shipped-已发货，delivered-已送达，completed-已完成，cancelled-已取消，refunded-已退款',
  `receiver_name` varchar(50) NOT NULL COMMENT '收货人姓名',
  `receiver_phone` varchar(20) NOT NULL COMMENT '收货人电话',
  `province` varchar(50) NOT NULL COMMENT '省份',
  `city` varchar(50) NOT NULL COMMENT '城市',
  `district` varchar(50) NOT NULL COMMENT '区县',
  `detail_address` varchar(255) NOT NULL COMMENT '详细地址',
  `logistics_company` varchar(50) DEFAULT NULL COMMENT '物流公司',
  `tracking_number` varchar(50) DEFAULT NULL COMMENT '物流单号',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- 7. 订单商品表
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `order_id` bigint(20) UNSIGNED NOT NULL COMMENT '订单ID',
  `product_id` bigint(20) UNSIGNED NOT NULL COMMENT '商品ID',
  `product_name` varchar(200) NOT NULL COMMENT '商品名称',
  `product_image` varchar(255) DEFAULT NULL COMMENT '商品图片',
  `spec` varchar(255) DEFAULT NULL COMMENT '规格',
  `price` decimal(10,2) NOT NULL COMMENT '商品价格',
  `quantity` int(11) NOT NULL COMMENT '数量',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单商品表';

-- 8. 优惠券表
CREATE TABLE IF NOT EXISTS `coupons` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '优惠券ID',
  `name` varchar(100) NOT NULL COMMENT '优惠券名称',
  `type` varchar(20) NOT NULL COMMENT '优惠券类型：discount-折扣，reduction-满减',
  `value` decimal(10,2) NOT NULL COMMENT '优惠券值',
  `min_amount` decimal(10,2) DEFAULT 0.00 COMMENT '最低消费金额',
  `discount_rate` decimal(5,2) DEFAULT NULL COMMENT '折扣率（折扣类型时使用）',
  `total` int(11) NOT NULL COMMENT '发行总量',
  `used` int(11) DEFAULT 0 COMMENT '已使用数量',
  `per_user_limit` int(11) DEFAULT 1 COMMENT '每人限领数量',
  `start_time` datetime NOT NULL COMMENT '开始时间',
  `end_time` datetime NOT NULL COMMENT '结束时间',
  `status` varchar(20) DEFAULT 'active' COMMENT '状态：active-生效中，inactive-已失效',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_time` (`start_time`, `end_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='优惠券表';

-- 9. 用户优惠券表
CREATE TABLE IF NOT EXISTS `user_coupons` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint(20) UNSIGNED NOT NULL COMMENT '用户ID',
  `coupon_id` bigint(20) UNSIGNED NOT NULL COMMENT '优惠券ID',
  `status` varchar(20) DEFAULT 'unused' COMMENT '状态：unused-未使用，used-已使用，expired-已过期',
  `order_id` bigint(20) UNSIGNED DEFAULT NULL COMMENT '订单ID',
  `used_at` datetime DEFAULT NULL COMMENT '使用时间',
  `expire_at` datetime NOT NULL COMMENT '过期时间',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_coupon_id` (`coupon_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户优惠券表';

-- 10. 收藏表
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint(20) UNSIGNED NOT NULL COMMENT '用户ID',
  `product_id` bigint(20) UNSIGNED NOT NULL COMMENT '商品ID',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_product` (`user_id`, `product_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏表';

-- 11. 商品评论表
CREATE TABLE IF NOT EXISTS `comments` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  `user_id` bigint(20) UNSIGNED NOT NULL COMMENT '用户ID',
  `product_id` bigint(20) UNSIGNED NOT NULL COMMENT '商品ID',
  `order_id` bigint(20) UNSIGNED DEFAULT NULL COMMENT '订单ID',
  `rating` tinyint(1) NOT NULL COMMENT '评分：1-5星',
  `content` text NOT NULL COMMENT '评论内容',
  `images` json DEFAULT NULL COMMENT '评论图片',
  `anonymous` tinyint(1) DEFAULT 0 COMMENT '是否匿名：0-否，1-是',
  `reply` text DEFAULT NULL COMMENT '商家回复',
  `reply_time` datetime DEFAULT NULL COMMENT '回复时间',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态：0-隐藏，1-显示',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品评论表';

-- 12. 积分记录表
CREATE TABLE IF NOT EXISTS `points_records` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint(20) UNSIGNED NOT NULL COMMENT '用户ID',
  `type` varchar(20) NOT NULL COMMENT '类型：earn-获得，spend-消费',
  `amount` int(11) NOT NULL COMMENT '积分数量',
  `description` varchar(255) NOT NULL COMMENT '描述',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='积分记录表';

-- 13. 余额记录表
CREATE TABLE IF NOT EXISTS `balance_records` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint(20) UNSIGNED NOT NULL COMMENT '用户ID',
  `type` varchar(20) NOT NULL COMMENT '类型：recharge-充值，consume-消费，withdraw-提现，refund-退款',
  `amount` decimal(10,2) NOT NULL COMMENT '金额',
  `description` varchar(255) NOT NULL COMMENT '描述',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='余额记录表';

-- 14. 售后申请表
CREATE TABLE IF NOT EXISTS `after_sales` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '售后ID',
  `user_id` bigint(20) UNSIGNED NOT NULL COMMENT '用户ID',
  `order_id` bigint(20) UNSIGNED NOT NULL COMMENT '订单ID',
  `type` varchar(20) NOT NULL COMMENT '售后类型：refund-退款，return-退货，exchange-换货，repair-维修',
  `reason` varchar(500) NOT NULL COMMENT '售后原因',
  `images` json DEFAULT NULL COMMENT '凭证图片',
  `status` varchar(20) DEFAULT 'pending' COMMENT '状态：pending-待审核，approved-已通过，rejected-已拒绝，processing-处理中，completed-已完成，cancelled-已取消',
  `refund_amount` decimal(10,2) DEFAULT NULL COMMENT '退款金额',
  `reply` text DEFAULT NULL COMMENT '商家回复',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='售后申请表';

-- 15. 轮播图表
CREATE TABLE IF NOT EXISTS `banners` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '轮播图ID',
  `title` varchar(100) NOT NULL COMMENT '标题',
  `image` varchar(255) NOT NULL COMMENT '图片地址',
  `link` varchar(255) DEFAULT NULL COMMENT '跳转链接',
  `link_type` varchar(20) DEFAULT 'none' COMMENT '链接类型：product-商品，category-分类，url-网址，none-无',
  `position` varchar(20) DEFAULT 'home' COMMENT '位置：home-首页，category-分类页，product-商品页',
  `sort` int(11) DEFAULT 0 COMMENT '排序',
  `status` varchar(20) DEFAULT 'active' COMMENT '状态：active-启用，inactive-禁用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_position` (`position`),
  KEY `idx_status` (`status`),
  KEY `idx_sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='轮播图表';

-- 16. 公告表
CREATE TABLE IF NOT EXISTS `notices` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '公告ID',
  `title` varchar(200) NOT NULL COMMENT '公告标题',
  `content` text NOT NULL COMMENT '公告内容',
  `type` varchar(20) DEFAULT 'announcement' COMMENT '类型：announcement-公告，activity-活动，system-系统',
  `status` varchar(20) DEFAULT 'active' COMMENT '状态：active-启用，inactive-禁用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='公告表';

-- 17. 搜索历史表
CREATE TABLE IF NOT EXISTS `search_history` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint(20) UNSIGNED DEFAULT NULL COMMENT '用户ID（为空表示热门搜索）',
  `keyword` varchar(100) NOT NULL COMMENT '搜索关键词',
  `count` int(11) DEFAULT 1 COMMENT '搜索次数',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_keyword` (`keyword`),
  KEY `idx_count` (`count`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='搜索历史表';

-- 18. 用户公告阅读记录表
CREATE TABLE IF NOT EXISTS `notice_reads` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint(20) UNSIGNED NOT NULL COMMENT '用户ID',
  `notice_id` bigint(20) UNSIGNED NOT NULL COMMENT '公告ID',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_notice` (`user_id`, `notice_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_notice_id` (`notice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户公告阅读记录表';

-- 19. 签到记录表
CREATE TABLE IF NOT EXISTS `check_in_records` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint(20) UNSIGNED NOT NULL COMMENT '用户ID',
  `check_in_date` date NOT NULL COMMENT '签到日期',
  `consecutive_days` int(11) DEFAULT 1 COMMENT '连续签到天数',
  `points` int(11) DEFAULT 0 COMMENT '获得积分',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_date` (`user_id`, `check_in_date`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_check_in_date` (`check_in_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='签到记录表';