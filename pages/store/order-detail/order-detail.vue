<template>
  <view class="order-detail-container">
    <view class="order-status-section">
      <text class="order-status">{{ orderStatusText }}</text>
      <text class="order-time">下单时间：{{ order.createdAt }}</text>
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- 收货地址 -->
      <view class="address-section">
        <view class="address-icon">📍</view>
        <view class="address-content">
          <view class="address-info">
            <text class="receiver-name">{{ order.address.receiverName }}</text>
            <text class="receiver-phone">{{ order.address.receiverPhone }}</text>
          </view>
          <view class="address-detail">
            {{ order.address.province }}{{ order.address.city }}{{ order.address.district }}{{ order.address.detailAddress }}
          </view>
        </view>
      </view>

      <!-- 商品信息 -->
      <view class="products-section">
        <view v-for="item in order.items" :key="item.productId" class="order-item">
          <image :src="item.product.images[0]" mode="aspectFill" class="item-image" />
          <view class="item-info">
            <text class="item-name">{{ item.product.name }}</text>
            <text v-if="item.spec" class="item-spec">{{ item.spec }}</text>
            <view class="item-bottom">
              <text class="item-price">¥{{ item.product.price }}</text>
              <text class="item-quantity">x{{ item.quantity }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 订单信息 -->
      <view class="order-info-section">
        <view class="info-item">
          <text class="info-label">商品金额</text>
          <text class="info-value">¥{{ order.totalAmount }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">运费</text>
          <text class="info-value">¥{{ order.freight }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">优惠券</text>
          <text class="info-value">-¥{{ order.discountAmount }}</text>
        </view>
        <view class="info-item total">
          <text class="info-label total-label">实付款</text>
          <text class="info-value total-value">¥{{ order.payAmount }}</text>
        </view>
      </view>

      <!-- 物流信息 -->
      <view v-if="order.status === 'shipped'" class="logistics-section">
        <view class="section-title">物流信息</view>
        <view class="logistics-info">
          <text class="logistics-company">{{ order.logisticsInfo.company }}</text>
          <text class="logistics-number">运单号：{{ order.logisticsInfo.trackingNumber }}</text>
        </view>
      </view>

      <!-- 订单详情 -->
      <view class="order-detail-section">
        <view class="section-title">订单详情</view>
        <view class="detail-item">
          <text class="detail-label">订单编号</text>
          <text class="detail-value">{{ order.orderNo }}</text>
        </view>
        <view class="detail-item">
          <text class="detail-label">支付方式</text>
          <text class="detail-value">{{ order.paymentMethod }}</text>
        </view>
        <view class="detail-item">
          <text class="detail-label">支付时间</text>
          <text class="detail-value">{{ order.paidAt || '未支付' }}</text>
        </view>
        <view class="detail-item">
          <text class="detail-label">发货时间</text>
          <text class="detail-value">{{ order.shippedAt || '未发货' }}</text>
        </view>
        <view class="detail-item">
          <text class="detail-label">完成时间</text>
          <text class="detail-value">{{ order.completedAt || '未完成' }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view v-if="showActionBar" class="bottom-bar">
      <button v-if="order.status === 'pending'" class="action-btn secondary" @click="cancelOrder">取消订单</button>
      <button v-if="order.status === 'pending'" class="action-btn primary" @click="payOrder">立即支付</button>
      <button v-if="order.status === 'paid'" class="action-btn primary" @click="remindShip">提醒发货</button>
      <button v-if="order.status === 'shipped'" class="action-btn secondary" @click="checkLogistics">查看物流</button>
      <button v-if="order.status === 'shipped'" class="action-btn primary" @click="confirmReceipt">确认收货</button>
      <button v-if="order.status === 'completed'" class="action-btn secondary" @click="buyAgain">再次购买</button>
      <button v-if="order.status === 'completed'" class="action-btn primary" @click="goToComment">评价</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Order, OrderStatus } from '@/types'

const orderId = ref('')
const order = ref<Order>({
  id: '',
  orderNo: '',
  userId: '',
  status: 'pending',
  totalAmount: 0,
  freight: 0,
  discountAmount: 0,
  payAmount: 0,
  paymentMethod: '微信支付',
  address: {
    id: '',
    userId: '',
    receiverName: '',
    receiverPhone: '',
    province: '',
    city: '',
    district: '',
    detailAddress: '',
    isDefault: false,
    createdAt: '',
    updatedAt: ''
  },
  items: [],
  logisticsInfo: {
    company: '',
    trackingNumber: ''
  },
  remark: '',
  createdAt: '',
  updatedAt: '',
  paidAt: '',
  shippedAt: '',
  completedAt: ''
})

const orderStatusText = computed(() => {
  const statusMap: Record<string, string> = {
    pending: '待支付',
    paid: '待发货',
    shipped: '待收货',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[order.value.status] || '未知状态'
})

const showActionBar = computed(() => {
  return ['pending', 'paid', 'shipped', 'completed'].includes(order.value.status)
})

const loadOrderData = async () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  if (currentPage.options.id) {
    orderId.value = currentPage.options.id
  }

  // 这里应该调用获取订单详情的API
  // 模拟数据
  order.value = {
    id: orderId.value || '1',
    orderNo: '2024010112345678',
    userId: 'user1',
    status: 'shipped',
    totalAmount: 199.8,
    freight: 0,
    discountAmount: 20,
    payAmount: 179.8,
    paymentMethod: '微信支付',
    address: {
      id: 'addr1',
      userId: 'user1',
      receiverName: '张三',
      receiverPhone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detailAddress: '科技园南区T3栋801',
      isDefault: true,
      createdAt: '2024-01-01 10:00:00',
      updatedAt: '2024-01-01 10:00:00'
    },
    items: [
      {
        productId: '1',
        quantity: 2,
        spec: '颜色：红色',
        product: {
          id: '1',
          name: 'iPhone 15 Pro',
          description: '苹果最新旗舰手机',
          price: 99.9,
          originalPrice: 129.9,
          images: ['https://example.com/iphone15.jpg'],
          categoryId: '1',
          sales: 1000,
          stock: 500,
          isHot: true,
          isNew: true,
          createdAt: '2024-01-01 00:00:00',
          updatedAt: '2024-01-01 00:00:00'
        }
      }
    ],
    logisticsInfo: {
      company: '顺丰速运',
      trackingNumber: 'SF1234567890'
    },
    remark: '尽快发货',
    createdAt: '2024-01-01 12:00:00',
    updatedAt: '2024-01-01 12:00:00',
    paidAt: '2024-01-01 12:05:00',
    shippedAt: '2024-01-01 14:00:00',
    completedAt: ''
  }
}

const cancelOrder = async () => {
  uni.showModal({
    title: '取消订单',
    content: '确定要取消这个订单吗？',
    success: async (res) => {
      if (res.confirm) {
        // 调用取消订单API
        uni.showToast({
          title: '订单已取消',
          icon: 'success'
        })
        // 刷新订单状态
        order.value.status = 'cancelled'
      }
    }
  })
}

const payOrder = async () => {
  // 调用支付API
  uni.showToast({
    title: '跳转到支付页面',
    icon: 'success'
  })
}

const remindShip = async () => {
  uni.showToast({
    title: '已提醒商家发货',
    icon: 'success'
  })
}

const checkLogistics = async () => {
  uni.showToast({
    title: '查看物流信息',
    icon: 'success'
  })
}

const confirmReceipt = async () => {
  uni.showModal({
    title: '确认收货',
    content: '请确认您已收到商品',
    success: async (res) => {
      if (res.confirm) {
        // 调用确认收货API
        uni.showToast({
          title: '收货成功',
          icon: 'success'
        })
        // 刷新订单状态
        order.value.status = 'completed'
      }
    }
  })
}

const buyAgain = async () => {
  // 跳转到购物车，添加相同商品
  uni.showToast({
    title: '商品已加入购物车',
    icon: 'success'
  })
}

const goToComment = async () => {
  uni.navigateTo({
    url: '/pages/store/order-comment/order-comment?orderId=' + order.value.id
  })
}

onMounted(() => {
  loadOrderData()
})
</script>

<style scoped lang="scss">
.order-detail-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.order-status-section {
  background-color: #1890ff;
  color: #fff;
  padding: 30rpx;
}

.order-status {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
  display: block;
}

.order-time {
  font-size: 24rpx;
  opacity: 0.9;
}

.scroll-content {
  padding-bottom: 120rpx;
}

.address-section {
  background-color: #fff;
  margin: 20rpx;
  border-radius: 10rpx;
  padding: 30rpx;
  display: flex;
  gap: 20rpx;
}

.address-icon {
  font-size: 40rpx;
  flex-shrink: 0;
}

.address-content {
  flex: 1;
}

.receiver-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-right: 30rpx;
}

.receiver-phone {
  font-size: 26rpx;
  color: #666;
}

.address-info {
  margin-bottom: 15rpx;
}

.address-detail {
  font-size: 24rpx;
  color: #999;
  line-height: 1.5;
}

.products-section {
  background-color: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 10rpx;
  overflow: hidden;
}

.order-item {
  display: flex;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.order-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 150rpx;
  height: 150rpx;
  border-radius: 8rpx;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  padding-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-name {
  font-size: 28rpx;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 10rpx;
}

.item-spec {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 15rpx;
}

.item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-price {
  font-size: 32rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.item-quantity {
  font-size: 26rpx;
  color: #666;
}

.order-info-section {
  background-color: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 10rpx;
  overflow: hidden;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 26rpx;
  color: #666;
}

.info-value {
  font-size: 26rpx;
  color: #333;
}

.info-item.total {
  background-color: #f9f9f9;
}

.total-label {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.total-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #ff4d4f;
}

.logistics-section {
  background-color: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 10rpx;
  padding: 30rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.logistics-info {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.logistics-company {
  display: block;
  margin-bottom: 10rpx;
}

.order-detail-section {
  background-color: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 10rpx;
  padding: 30rpx;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-size: 26rpx;
  color: #666;
}

.detail-value {
  font-size: 26rpx;
  color: #333;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20rpx;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-top: 1rpx solid #e0e0e0;
}

.action-btn {
  border-radius: 30rpx;
  padding: 20rpx 40rpx;
  font-size: 28rpx;
}

.action-btn.primary {
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  color: #fff;
  border: none;
}

.action-btn.secondary {
  background-color: #fff;
  color: #666;
  border: 1rpx solid #e0e0e0;
}
</style>