-- 商城示例数据
USE miniprogram_store;

-- 1. 插入商品分类数据
INSERT INTO `categories` (`id`, `name`, `icon`, `parent_id`, `level`, `sort`, `status`) VALUES
(1, '手机数码', 'https://example.com/category/phone.jpg', 0, 1, 1, 1),
(2, '家用电器', 'https://example.com/category/appliance.jpg', 0, 1, 2, 1),
(3, '服装鞋包', 'https://example.com/category/clothing.jpg', 0, 1, 3, 1),
(4, '美妆护肤', 'https://example.com/category/beauty.jpg', 0, 1, 4, 1),
(5, '食品饮料', 'https://example.com/category/food.jpg', 0, 1, 5, 1);

-- 插入子分类
INSERT INTO `categories` (`id`, `name`, `icon`, `parent_id`, `level`, `sort`, `status`) VALUES
(11, '智能手机', 'https://example.com/category/smartphone.jpg', 1, 2, 1, 1),
(12, '平板电脑', 'https://example.com/category/tablet.jpg', 1, 2, 2, 1),
(13, '智能手表', 'https://example.com/category/watch.jpg', 1, 2, 3, 1),
(21, '空调', 'https://example.com/category/air.jpg', 2, 2, 1, 1),
(22, '冰箱', 'https://example.com/category/fridge.jpg', 2, 2, 2, 1),
(23, '洗衣机', 'https://example.com/category/washing.jpg', 2, 2, 3, 1);

-- 2. 插入商品数据
INSERT INTO `products` (`id`, `name`, `description`, `price`, `original_price`, `stock`, `sales`, `category_id`, `images`, `details`, `is_hot`, `is_new`, `is_recommend`, `status`, `sort`) VALUES
(1, 'iPhone 15 Pro', '苹果最新旗舰手机，搭载 A17 Pro 芯片，支持 USB-C 接口', 9999.00, 10999.00, 500, 1000, 11, '["https://example.com/product/iphone15-1.jpg", "https://example.com/product/iphone15-2.jpg", "https://example.com/product/iphone15-3.jpg"]', '<h3>产品详情</h3><p>iPhone 15 Pro 采用钛金属机身，更轻更坚固。</p><p>搭载 A17 Pro 芯片，性能更加强劲。</p>', 1, 1, 1, 1, 1),
(2, 'AirPods Pro 2', '主动降噪耳机，支持空间音频', 1899.00, 1999.00, 1000, 2000, 11, '["https://example.com/product/airpods-1.jpg", "https://example.com/product/airpods-2.jpg"]', '<h3>产品详情</h3><p>AirPods Pro 2 搭载全新 H2 芯片，降噪能力提升2倍。</p>', 1, 0, 1, 1, 2),
(3, 'MacBook Air M3', '轻薄笔记本电脑，搭载 M3 芯片', 7999.00, 8999.00, 200, 500, 11, '["https://example.com/product/macbook-1.jpg", "https://example.com/product/macbook-2.jpg"]', '<h3>产品详情</h3><p>MacBook Air 搭载 M3 芯片，性能强劲，续航持久。</p>', 1, 1, 1, 1, 3),
(4, 'iPad Pro 12.9', '专业平板电脑，搭载 M2 芯片', 8999.00, 9999.00, 300, 800, 11, '["https://example.com/product/ipad-1.jpg", "https://example.com/product/ipad-2.jpg"]', '<h3>产品详情</h3><p>iPad Pro 搭载 M2 芯片，性能强劲，适合专业创作。</p>', 0, 1, 0, 1, 4),
(5, 'Apple Watch Series 9', '智能手表，健康监测', 2999.00, 3299.00, 400, 600, 13, '["https://example.com/product/watch-1.jpg", "https://example.com/product/watch-2.jpg"]', '<h3>产品详情</h3><p>Apple Watch Series 9，更强大的健康监测功能。</p>', 1, 1, 1, 1, 5),
(6, '小米空调', '变频空调，静音节能', 2499.00, 2999.00, 200, 300, 21, '["https://example.com/product/air-1.jpg", "https://example.com/product/air-2.jpg"]', '<h3>产品详情</h3><p>小米变频空调，静音节能，智能控温。</p>', 1, 0, 1, 1, 6),
(7, '海尔冰箱', '多门冰箱，大容量', 3999.00, 4999.00, 150, 200, 22, '["https://example.com/product/fridge-1.jpg", "https://example.com/product/fridge-2.jpg"]', '<h3>产品详情</h3><p>海尔多门冰箱，大容量设计，智能保鲜。</p>', 0, 0, 1, 1, 7),
(8, '美的洗衣机', '滚筒洗衣机，智能洗涤', 1999.00, 2499.00, 300, 400, 23, '["https://example.com/product/washing-1.jpg", "https://example.com/product/washing-2.jpg"]', '<h3>产品详情</h3><p>美的滚筒洗衣机，智能洗涤程序，省水省电。</p>', 0, 1, 0, 1, 8);

-- 3. 插入用户数据
INSERT INTO `users` (`id`, `openid`, `nickname`, `avatar`, `gender`, `phone`, `email`, `points`, `balance`, `status`) VALUES
(1, 'wx_openid_123456', '测试用户', 'https://example.com/avatar/default.jpg', 1, '13800138000', 'test@example.com', 1280, 1280.50, 1),
(2, 'wx_openid_234567', '新用户', 'https://example.com/avatar/default2.jpg', 2, '13900139000', 'new@example.com', 0, 0.00, 1);

-- 4. 插入收货地址数据
INSERT INTO `addresses` (`id`, `user_id`, `receiver_name`, `receiver_phone`, `province`, `city`, `district`, `detail_address`, `is_default`) VALUES
(1, 1, '张三', '13800138000', '广东省', '深圳市', '南山区', '科技园南区T3栋801', 1),
(2, 1, '李四', '13900139000', '北京市', '北京市', '朝阳区', '望京SOHO T1 C座2001', 0);

-- 5. 插入购物车数据
INSERT INTO `cart_items` (`id`, `user_id`, `product_id`, `quantity`, `spec`, `selected`) VALUES
(1, 1, 1, 1, '颜色：午夜色', 1),
(2, 1, 2, 2, '颜色：白色', 0);

-- 6. 插入订单数据
INSERT INTO `orders` (`id`, `order_no`, `user_id`, `total_amount`, `freight`, `discount_amount`, `pay_amount`, `payment_method`, `payment_time`, `status`, `receiver_name`, `receiver_phone`, `province`, `city`, `district`, `detail_address`, `logistics_company`, `tracking_number`, `remark`) VALUES
(1, '2024010112345678', 1, 9999.00, 0.00, 0.00, 9999.00, '微信支付', '2024-01-01 12:05:00', 'shipped', '张三', '13800138000', '广东省', '深圳市', '南山区', '科技园南区T3栋801', '顺丰速运', 'SF1234567890', ''),
(2, '2024010212345679', 1, 1899.00, 0.00, 0.00, 1899.00, '微信支付', '2024-01-02 10:05:00', 'completed', '张三', '13800138000', '广东省', '深圳市', '南山区', '科技园南区T3栋801', '顺丰速运', 'SF1234567891', '');

-- 7. 插入订单商品数据
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `product_image`, `spec`, `price`, `quantity`) VALUES
(1, 1, 1, 'iPhone 15 Pro', 'https://example.com/product/iphone15-1.jpg', '颜色：午夜色', 9999.00, 1),
(2, 2, 2, 'AirPods Pro 2', 'https://example.com/product/airpods-1.jpg', '颜色：白色', 1899.00, 1);

-- 8. 插入优惠券数据
INSERT INTO `coupons` (`id`, `name`, `type`, `value`, `min_amount`, `total`, `used`, `per_user_limit`, `start_time`, `end_time`, `status`) VALUES
(1, '新人专享券', 'reduction', 50.00, 200.00, 1000, 200, 1, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 'active'),
(2, '全场通用券', 'reduction', 20.00, 100.00, 500, 100, 1, '2024-01-01 00:00:00', '2024-06-30 23:59:59', 'active'),
(3, '限时折扣券', 'reduction', 30.00, 150.00, 200, 50, 1, '2024-01-01 00:00:00', '2024-01-31 23:59:59', 'active'),
(4, '会员专享券', 'reduction', 100.00, 500.00, 100, 10, 1, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 'active');

-- 9. 插入用户优惠券数据
INSERT INTO `user_coupons` (`id`, `user_id`, `coupon_id`, `status`, `expire_at`) VALUES
(1, 1, 1, 'unused', '2024-12-31 23:59:59'),
(2, 1, 2, 'unused', '2024-06-30 23:59:59'),
(3, 1, 3, 'expired', '2024-01-31 23:59:59'),
(4, 1, 4, 'used', '2024-12-31 23:59:59');

-- 10. 插入收藏数据
INSERT INTO `favorites` (`id`, `user_id`, `product_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 1, 4);

-- 11. 插入评论数据
INSERT INTO `comments` (`id`, `user_id`, `product_id`, `order_id`, `rating`, `content`, `images`, `anonymous`, `reply`, `reply_time`) VALUES
(1, 1, 1, 1, 5, '商品质量很好，物流也很快，非常满意！', '["https://example.com/comment/1.jpg", "https://example.com/comment/2.jpg"]', 0, '感谢您的评价，我们会继续努力！', '2024-01-02 10:00:00'),
(2, 1, 2, 2, 4, '整体不错，就是包装有点简陋', '[]', 1, NULL, NULL);

-- 12. 插入积分记录数据
INSERT INTO `points_records` (`id`, `user_id`, `type`, `amount`, `description`) VALUES
(1, 1, 'earn', 199, '购物获得积分'),
(2, 1, 'earn', 5, '评价商品获得积分'),
(3, 1, 'spend', 100, '积分抵扣订单'),
(4, 1, 'earn', 10, '签到获得积分');

-- 13. 插入余额记录数据
INSERT INTO `balance_records` (`id`, `user_id`, `type`, `amount`, `description`) VALUES
(1, 1, 'recharge', 500.00, '余额充值'),
(2, 1, 'consume', 199.50, '订单支付'),
(3, 1, 'recharge', 1000.00, '余额充值'),
(4, 1, 'consume', 120.00, '订单支付');

-- 14. 插入售后数据
INSERT INTO `after_sales` (`id`, `user_id`, `order_id`, `type`, `reason`, `images`, `status`, `refund_amount`, `reply`) VALUES
(1, 1, 1, 'refund', '商品有质量问题', '["https://example.com/aftersales/1.jpg", "https://example.com/aftersales/2.jpg"]', 'approved', 199.00, '您的售后申请已通过，请按照指引寄回商品'),
(2, 1, 2, 'return', '不想要了', '[]', 'pending', NULL, NULL);

-- 15. 插入轮播图数据
INSERT INTO `banners` (`id`, `title`, `image`, `link`, `link_type`, `position`, `sort`, `status`) VALUES
(1, '新品上市', 'https://example.com/banner/1.jpg', '/pages/store/product-detail/product-detail?id=1', 'product', 'home', 1, 'active'),
(2, '限时优惠', 'https://example.com/banner/2.jpg', '/pages/store/product-list/product-list?keyword=优惠', 'url', 'home', 2, 'active'),
(3, '会员专享', 'https://example.com/banner/3.jpg', '/pages/store/category/category?id=1', 'category', 'home', 3, 'active');

-- 16. 插入公告数据
INSERT INTO `notices` (`id`, `title`, `content`, `type`, `status`) VALUES
(1, '系统维护通知', '为了提供更好的服务，我们将于2024年1月15日凌晨2:00-4:00进行系统维护，期间部分功能可能无法使用，敬请谅解。', 'system', 'active'),
(2, '新年促销活动', '新年大促销，全场商品8折起，更有优惠券等你来领！活动时间：2024年1月1日-1月31日。', 'activity', 'active'),
(3, '新功能上线通知', '我们新增了积分兑换功能，现在可以使用积分兑换商品啦！', 'announcement', 'active');

-- 17. 插入搜索历史数据
INSERT INTO `search_history` (`id`, `user_id`, `keyword`, `count`) VALUES
(1, 1, 'iPhone 15', 10),
(2, 1, 'AirPods Pro', 5),
(3, 1, 'MacBook Air', 3),
(4, NULL, 'iPhone 15', 100),
(5, NULL, 'AirPods Pro', 80),
(6, NULL, 'MacBook Air', 60);

-- 18. 插入签到记录数据
INSERT INTO `check_in_records` (`id`, `user_id`, `check_in_date`, `consecutive_days`, `points`) VALUES
(1, 1, '2024-01-01', 1, 10),
(2, 1, '2024-01-02', 2, 10),
(3, 1, '2024-01-03', 3, 10),
(4, 1, '2024-01-04', 4, 10),
(5, 1, '2024-01-05', 5, 10);