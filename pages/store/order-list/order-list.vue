<template>
  <view class="order-list-container">
    <view class="order-tabs">
      <view
        v-for="(tab, index) in tabs"
        :key="index"
        class="order-tab"
        :class="{ 'active': activeTab === tab.key }"
        @click="switchTab(tab.key)"
      >
        <text class="tab-text">{{ tab.name }}</text>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-content" @scrolltolower="loadMore">
      <view v-if="loading" class="loading">加载中...</view>
      <view v-else-if="orders.length === 0" class="empty">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无订单</text>
        <button class="empty-btn" @click="goToHome">去购物</button>
      </view>
      <view v-else class="order-list">
        <view
          v-for="order in orders"
          :key="order.id"
          class="order-item"
          @click="goToOrderDetail(order.id)"
        >
          <view class="order-header">
            <text class="order-no">订单编号：{{ order.orderNo }}</text>
            <text class="order-status">{{ getOrderStatusText(order.status) }}</text>
          </view>
          <view class="order-products">
            <view
              v-for="item in order.items"
              :key="item.productId"
              class="order-product"
            >
              <image :src="item.product.images[0]" mode="aspectFill" class="product-image" />
              <view class="product-info">
                <text class="product-name">{{ item.product.name }}</text>
                <text v-if="item.spec" class="product-spec">{{ item.spec }}</text>
              </view>
            </view>
          </view>
          <view class="order-footer">
            <text class="order-amount">共{{ order.totalQuantity }}件 合计：¥{{ order.payAmount }}</text>
            <view class="order-actions">
              <button
                v-if="order.status === 'pending'"
                class="action-btn secondary"
                @click.stop="cancelOrder(order.id)"
              >
                取消订单
              </button>
              <button
                v-if="order.status === 'pending'"
                class="action-btn primary"
                @click.stop="payOrder(order.id)"
              >
                立即支付
              </button>
              <button
                v-if="order.status === 'shipped'"
                class="action-btn primary"
                @click.stop="confirmReceipt(order.id)"
              >
                确认收货
              </button>
              <button
                v-if="order.status === 'completed'"
                class="action-btn secondary"
                @click.stop="buyAgain(order)"
              >
                再次购买
              </button>
              <button
                v-if="order.status === 'completed'"
                class="action-btn primary"
                @click.stop="goToComment(order.id)"
              >
                评价
              </button>
            </view>
          </view>
        </view>
      </view>
      <loading-more v-if="!loading" :loading="loadingMore" :no-more="noMore" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Order, OrderStatus } from '@/types'
import LoadingMore from '@/components/loading-more/loading-more.vue'

const tabs = [
  { key: 'all', name: '全部' },
  { key: 'pending', name: '待付款' },
  { key: 'paid', name: '待发货' },
  { key: 'shipped', name: '待收货' },
  { key: 'completed', name: '已完成' }
]

const activeTab = ref('all')
const orders = ref<Order[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = ref(10)

const getOrderStatusText = (status: OrderStatus) => {
  const statusMap: Record<OrderStatus, string> = {
    pending: '待付款',
    paid: '待发货',
    shipped: '待收货',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || '未知状态'
}

const switchTab = (tabKey: string) => {
  activeTab.value = tabKey
  page.value = 1
  orders.value = []
  loadOrders()
}

const loadOrders = async () => {
  loading.value = true
  try {
    // 这里应该调用获取订单列表的API
    // 模拟数据
    setTimeout(() => {
      orders.value = [
        {
          id: '1',
          orderNo: '2024010112345678',
          userId: 'user1',
          status: 'shipped',
          totalAmount: 199.8,
          freight: 0,
          discountAmount: 20,
          payAmount: 179.8,
          paymentMethod: '微信支付',
          totalQuantity: 2,
          items: [
            {
              productId: '1',
              quantity: 1,
              spec: '颜色：红色',
              product: {
                id: '1',
                name: 'iPhone 15 Pro',
                images: ['https://example.com/iphone15.jpg'],
                price: 99.9
              }
            },
            {
              productId: '2',
              quantity: 1,
              spec: '颜色：蓝色',
              product: {
                id: '2',
                name: 'AirPods Pro 2',
                images: ['https://example.com/airpods.jpg'],
                price: 99.9
              }
            }
          ],
          createdAt: '2024-01-01 12:00:00'
        },
        {
          id: '2',
          orderNo: '2024010212345679',
          userId: 'user1',
          status: 'pending',
          totalAmount: 299.9,
          freight: 0,
          discountAmount: 50,
          payAmount: 249.9,
          paymentMethod: '微信支付',
          totalQuantity: 1,
          items: [
            {
              productId: '3',
              quantity: 1,
              product: {
                id: '3',
                name: 'MacBook Air M3',
                images: ['https://example.com/macbook.jpg'],
                price: 299.9
              }
            }
          ],
          createdAt: '2024-01-02 10:00:00'
        }
      ]
      loading.value = false
      noMore.value = true
    }, 1000)
  } catch (error) {
    console.error('加载订单失败:', error)
    loading.value = false
  }
}

const loadMore = async () => {
  if (loadingMore.value || noMore.value) return
  loadingMore.value = true
  try {
    // 这里应该调用加载更多订单的API
    setTimeout(() => {
      loadingMore.value = false
      noMore.value = true
    }, 1000)
  } catch (error) {
    console.error('加载更多订单失败:', error)
    loadingMore.value = false
  }
}

const goToOrderDetail = (orderId: string) => {
  uni.navigateTo({
    url: `/pages/store/order-detail/order-detail?id=${orderId}`
  })
}

const goToHome = () => {
  uni.switchTab({
    url: '/pages/store/home/home'
  })
}

const cancelOrder = (orderId: string) => {
  uni.showModal({
    title: '取消订单',
    content: '确定要取消这个订单吗？',
    success: (res) => {
      if (res.confirm) {
        // 调用取消订单API
        uni.showToast({
          title: '订单已取消',
          icon: 'success'
        })
      }
    }
  })
}

const payOrder = (orderId: string) => {
  // 调用支付API
  uni.showToast({
    title: '跳转到支付页面',
    icon: 'success'
  })
}

const confirmReceipt = (orderId: string) => {
  uni.showModal({
    title: '确认收货',
    content: '请确认您已收到商品',
    success: (res) => {
      if (res.confirm) {
        // 调用确认收货API
        uni.showToast({
          title: '收货成功',
          icon: 'success'
        })
      }
    }
  })
}

const buyAgain = (order: Order) => {
  // 跳转到购物车，添加相同商品
  uni.showToast({
    title: '商品已加入购物车',
    icon: 'success'
  })
}

const goToComment = (orderId: string) => {
  uni.navigateTo({
    url: `/pages/store/order-comment/order-comment?orderId=${orderId}`
  })
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped lang="scss">
.order-list-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.order-tabs {
  display: flex;
  background-color: #fff;
  border-bottom: 1rpx solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.order-tab {
  flex: 1;
  text-align: center;
  padding: 30rpx 0;
  position: relative;
}

.order-tab.active {
  color: #ff4d4f;
}

.order-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 25%;
  width: 50%;
  height: 4rpx;
  background-color: #ff4d4f;
  border-radius: 2rpx;
}

.tab-text {
  font-size: 28rpx;
}

.scroll-content {
  padding-bottom: 20rpx;
}

.loading {
  text-align: center;
  padding: 40rpx 0;
  color: #999;
  font-size: 28rpx;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 40rpx;
}

.empty-btn {
  background-color: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 30rpx;
  padding: 15rpx 60rpx;
  font-size: 28rpx;
}

.order-list {
  padding: 20rpx;
}

.order-item {
  background-color: #fff;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.order-no {
  font-size: 26rpx;
  color: #666;
}

.order-status {
  font-size: 26rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.order-products {
  padding: 30rpx;
}

.order-product {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.order-product:last-child {
  margin-bottom: 0;
}

.product-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  padding-left: 20rpx;
}

.product-name {
  font-size: 26rpx;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 10rpx;
}

.product-spec {
  font-size: 24rpx;
  color: #999;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
  background-color: #f9f9f9;
}

.order-amount {
  font-size: 26rpx;
  color: #333;
}

.order-actions {
  display: flex;
  gap: 15rpx;
}

.action-btn {
  border-radius: 20rpx;
  padding: 10rpx 25rpx;
  font-size: 24rpx;
}

.action-btn.primary {
  background-color: #ff4d4f;
  color: #fff;
  border: none;
}

.action-btn.secondary {
  background-color: #fff;
  color: #666;
  border: 1rpx solid #e0e0e0;
}
</style>