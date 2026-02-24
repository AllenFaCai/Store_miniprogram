# API 接口文档

## 概述

本项目提供了完整的商城 API 接口封装，所有接口都使用模拟数据，方便前端开发和测试。

## 目录结构

```
api/
├── index.ts           # API 入口文件
├── category.ts        # 分类相关接口
├── product.ts         # 商品相关接口
├── user.ts           # 用户相关接口
├── order.ts          # 订单相关接口
├── cart.ts           # 购物车相关接口
├── favorite.ts       # 收藏相关接口
├── comment.ts        # 评论相关接口
├── wallet.ts         # 钱包相关接口
├── coupon.ts         # 优惠券相关接口
├── after-sales.ts    # 售后相关接口
├── search.ts         # 搜索相关接口
├── banner.ts         # 轮播图相关接口
└── notice.ts         # 公告相关接口
```

## 使用方法

### 导入 API

```typescript
import { categoryApi, productApi, userApi, orderApi, cartApi } from '@/api'
```

### 调用接口

所有接口都返回 Promise，可以使用 async/await 或 then/catch 处理。

```typescript
// 获取分类列表
const res = await categoryApi.getCategoryList()
if (res.code === 200) {
  console.log(res.data)
}

// 获取商品列表
const res = await productApi.getProducts({
  categoryId: '1',
  page: 1,
  pageSize: 10
})
```

## 接口列表

### 1. 分类 API (categoryApi)

| 接口 | 说明 | 参数 |
|------|------|------|
| getCategoryList | 获取分类列表 | - |
| getCategoryDetail | 获取分类详情 | id: string |

### 2. 商品 API (productApi)

| 接口 | 说明 | 参数 |
|------|------|------|
| getProducts | 获取商品列表 | categoryId?, page?, pageSize?, keyword?, sort? |
| getProductDetail | 获取商品详情 | id: string |
| searchProducts | 搜索商品 | keyword, page?, pageSize?, sort?, categoryId?, minPrice?, maxPrice? |
| getHotProducts | 获取热门商品 | limit? |
| getNewProducts | 获取新品 | limit? |

### 3. 用户 API (userApi)

| 接口 | 说明 | 参数 |
|------|------|------|
| login | 用户登录 | username, password |
| register | 用户注册 | username, password, phone, email |
| getUserInfo | 获取用户信息 | - |
| updateUserInfo | 更新用户信息 | Partial<User> |
| getAddressList | 获取地址列表 | - |
| addAddress | 添加地址 | Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'> |
| updateAddress | 更新地址 | id: string, data: Partial<Address> |
| deleteAddress | 删除地址 | id: string |
| setDefaultAddress | 设置默认地址 | id: string |

### 4. 订单 API (orderApi)

| 接口 | 说明 | 参数 |
|------|------|------|
| createOrder | 创建订单 | addressId, items, couponId?, remark? |
| getOrderList | 获取订单列表 | status?, page?, pageSize? |
| getOrderDetail | 获取订单详情 | id: string |
| cancelOrder | 取消订单 | id: string |
| payOrder | 支付订单 | id: string, paymentMethod: string |
| confirmReceipt | 确认收货 | id: string |
| commentOrder | 评价订单 | id: string, rating, content, images?, anonymous? |

### 5. 购物车 API (cartApi)

| 接口 | 说明 | 参数 |
|------|------|------|
| addToCart | 添加到购物车 | productId, quantity, spec? |
| getCartList | 获取购物车列表 | - |
| updateCartQuantity | 更新购物车数量 | id: string, quantity: number |
| updateCartChecked | 更新购物车选中状态 | id: string, checked: boolean |
| updateCartCheckedAll | 全选/取消全选 | checked: boolean |
| deleteCartItem | 删除购物车项 | id: string |
| clearCart | 清空购物车 | - |
| getCartCount | 获取购物车数量 | - |

### 6. 收藏 API (favoriteApi)

| 接口 | 说明 | 参数 |
|------|------|------|
| addFavorite | 添加收藏 | productId: string |
| removeFavorite | 取消收藏 | favoriteId: string |
| getFavoriteList | 获取收藏列表 | page?, pageSize? |
| checkFavorite | 检查是否已收藏 | productId: string |

### 7. 评论 API (commentApi)

| 接口 | 说明 | 参数 |
|------|------|------|
| getCommentList | 获取商品评论列表 | productId, page?, pageSize?, rating? |
| getCommentDetail | 获取评论详情 | id: string |
| addComment | 添加评论 | productId, orderId, rating, content, images?, anonymous? |
| deleteComment | 删除评论 | id: string |
| getCommentStats | 获取评论统计 | productId: string |

### 8. 钱包 API (walletApi)

| 接口 | 说明 | 参数 |
|------|------|------|
| getPointsRecord | 获取积分记录 | page?, pageSize?, type? |
| getBalanceRecord | 获取余额记录 | page?, pageSize?, type? |
| rechargeBalance | 余额充值 | amount: number, paymentMethod: string |
| withdrawBalance | 余额提现 | amount: number |
| checkIn | 签到 | - |
| getUserAssets | 获取用户资产信息 | - |

### 9. 优惠券 API (couponApi)

| 接口 | 说明 | 参数 |
|------|------|------|
| getUserCoupons | 获取用户优惠券列表 | status?, page?, pageSize? |
| getAvailableCoupons | 获取可用优惠券 | amount?, categoryIds? |
| receiveCoupon | 领取优惠券 | couponId: string |
| getCouponCenter | 获取优惠券中心列表 | page?, pageSize? |

### 10. 售后 API (afterSalesApi)

| 接口 | 说明 | 参数 |
|------|------|------|
| createAfterSales | 创建售后申请 | orderId, type, reason, images?, description? |
| getAfterSalesList | 获取售后列表 | status?, page?, pageSize? |
| getAfterSalesDetail | 获取售后详情 | id: string |
| cancelAfterSales | 取消售后申请 | id: string |
| submitReturnLogistics | 提交退货物流信息 | id: string, logisticsCompany, trackingNumber |

### 11. 搜索 API (searchApi)

| 接口 | 说明 | 参数 |
|------|------|------|
| searchProducts | 搜索商品 | keyword, page?, pageSize?, sort?, categoryId?, minPrice?, maxPrice? |
| getSearchSuggestions | 获取搜索建议 | keyword: string |
| getHotSearch | 获取热门搜索 | - |
| getSearchHistory | 获取搜索历史 | - |
| addSearchHistory | 添加搜索历史 | keyword: string |
| clearSearchHistory | 清空搜索历史 | - |
| deleteSearchHistory | 删除搜索历史 | id: string |

### 12. 轮播图 API (bannerApi)

| 接口 | 说明 | 参数 |
|------|------|------|
| getBannerList | 获取轮播图列表 | position? |

### 13. 公告 API (noticeApi)

| 接口 | 说明 | 参数 |
|------|------|------|
| getNoticeList | 获取公告列表 | type?, page?, pageSize? |
| getNoticeDetail | 获取公告详情 | id: string |
| markNoticeRead | 标记公告已读 | id: string |
| getUnreadNoticeCount | 获取未读公告数量 | - |

## 响应格式

所有接口都返回统一的响应格式：

```typescript
{
  code: number,      // 状态码，200 表示成功
  message: string,   // 提示信息
  data: any         // 返回数据
}
```

## 错误处理

建议在调用接口时进行错误处理：

```typescript
try {
  const res = await productApi.getProducts({ page: 1, pageSize: 10 })
  if (res.code === 200) {
    // 处理成功逻辑
    console.log(res.data)
  } else {
    // 处理业务错误
    uni.showToast({
      title: res.message || '请求失败',
      icon: 'none'
    })
  }
} catch (error) {
  // 处理网络错误
  console.error('请求失败:', error)
  uni.showToast({
    title: '网络错误，请稍后重试',
    icon: 'none'
  })
}
```

## 切换到真实 API

当后端接口开发完成后，只需修改对应的 API 文件，将模拟数据替换为真实的 API 调用即可。

例如，将 `product.ts` 中的 `getProducts` 方法修改为：

```typescript
export const getProducts = async (params: ProductQuery): Promise<any> => {
  return request({
    url: '/product/list',
    method: 'GET',
    params
  })
}
```

## 注意事项

1. 所有接口都使用模拟数据，实际开发中需要替换为真实的 API 调用
2. 模拟数据中的图片 URL 都是示例地址，需要替换为真实的图片地址
3. 建议在 `utils/request.ts` 中配置正确的 `BASE_URL`
4. 所有接口都返回 Promise，支持 async/await 和 Promise.then/catch 语法
5. 建议在调用接口时进行错误处理，提升用户体验

## 开发建议

1. **统一错误处理**：可以创建一个统一的错误处理函数
2. **请求拦截**：在 request.ts 中添加请求拦截器，统一处理 token
3. **响应拦截**：在 request.ts 中添加响应拦截器，统一处理错误码
4. **缓存策略**：对于不经常变化的数据，可以添加缓存策略
5. **请求取消**：对于页面切换时的请求，可以添加取消机制