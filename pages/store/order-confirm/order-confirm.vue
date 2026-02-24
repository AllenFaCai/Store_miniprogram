<template>
  <view class="order-confirm-container">
    <scroll-view scroll-y class="scroll-content">
      <!-- 收货地址 -->
      <view class="address-section" @click="selectAddress">
        <view class="address-content">
          <view class="address-info">
            <text class="receiver-name">{{ selectedAddress.receiverName || '请选择收货地址' }}</text>
            <text v-if="selectedAddress.receiverPhone" class="receiver-phone">{{ selectedAddress.receiverPhone }}</text>
          </view>
          <view v-if="selectedAddress.detailAddress" class="address-detail">
            {{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.district }}{{ selectedAddress.detailAddress }}
          </view>
        </view>
        <text class="address-arrow">></text>
      </view>

      <!-- 商品信息 -->
      <view class="products-section">
        <view class="section-title">商品信息</view>
        <view v-for="item in orderItems" :key="item.productId" class="order-item">
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

      <!-- 优惠券 -->
      <view class="coupon-section" @click="selectCoupon">
        <text class="coupon-label">优惠券</text>
        <view class="coupon-info">
          <text v-if="selectedCoupon" class="coupon-name">{{ selectedCoupon.name }}</text>
          <text v-else class="no-coupon">未使用优惠券</text>
          <text class="coupon-arrow">></text>
        </view>
      </view>

      <!-- 订单信息 -->
      <view class="order-info-section">
        <view class="info-item">
          <text class="info-label">商品金额</text>
          <text class="info-value">¥{{ goodsAmount }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">运费</text>
          <text class="info-value">¥{{ freight }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">优惠券</text>
          <text class="info-value">-¥{{ couponAmount }}</text>
        </view>
        <view class="info-item total">
          <text class="info-label total-label">实付款</text>
          <text class="info-value total-value">¥{{ payAmount }}</text>
        </view>
      </view>

      <!-- 备注 -->
      <view class="remark-section">
        <text class="remark-label">备注</text>
        <input
          v-model="remark"
          class="remark-input"
          placeholder="请输入备注信息"
          placeholder-class="remark-placeholder"
        />
      </view>
    </scroll-view>

    <!-- 底部结算 -->
    <view class="bottom-bar">
      <view class="total-info">
        <text class="total-text">合计：</text>
        <text class="total-price">¥{{ payAmount }}</text>
      </view>
      <button class="pay-btn" @click="submitOrder">提交订单</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Product, Address, Coupon } from '@/types'

const orderItems = ref<any[]>([])
const selectedAddress = ref<Address>({
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
})
const selectedCoupon = ref<Coupon | null>(null)
const remark = ref('')
const freight = ref(0)
const couponAmount = ref(0)

const goodsAmount = computed(() => {
  return orderItems.value.reduce((total, item) => {
    return total + (item.product.price * item.quantity)
  }, 0)
})

const payAmount = computed(() => {
  return goodsAmount.value + freight.value - couponAmount.value
})

const loadOrderData = () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  if (currentPage.options.data) {
    try {
      const data = JSON.parse(decodeURIComponent(currentPage.options.data))
      if (data.items) {
        orderItems.value = data.items
      }
    } catch (error) {
      console.error('解析订单数据失败:', error)
    }
  }
}

const selectAddress = () => {
  uni.navigateTo({
    url: '/pages/store/address-list/address-list?select=true'
  })
}

const selectCoupon = () => {
  uni.navigateTo({
    url: '/pages/store/coupon-list/coupon-list?select=true'
  })
}

const submitOrder = async () => {
  if (!selectedAddress.value.id) {
    uni.showToast({
      title: '请选择收货地址',
      icon: 'none'
    })
    return
  }

  if (orderItems.value.length === 0) {
    uni.showToast({
      title: '请选择商品',
      icon: 'none'
    })
    return
  }

  try {
    uni.showLoading({ title: '提交订单中...' })
    // 这里应该调用创建订单的API
    console.log('提交订单:', {
      items: orderItems.value,
      addressId: selectedAddress.value.id,
      couponId: selectedCoupon.value?.id,
      remark: remark.value,
      totalAmount: goodsAmount.value,
      freight: freight.value,
      discountAmount: couponAmount.value,
      payAmount: payAmount.value
    })
    
    // 模拟订单创建成功
    setTimeout(() => {
      uni.hideLoading()
      uni.showToast({
        title: '订单创建成功',
        icon: 'success'
      })
      // 跳转到订单详情页
      uni.navigateTo({
        url: '/pages/store/order-detail/order-detail?id=1'
      })
    }, 1000)
  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: '订单创建失败',
      icon: 'none'
    })
  }
}

onMounted(() => {
  loadOrderData()
})
</script>

<style scoped lang="scss">
.order-confirm-container {
  min-height: 100vh;
  background-color: #f5f5f5;
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
  align-items: center;
  justify-content: space-between;
}

.address-content {
  flex: 1;
}

.receiver-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-right: 30rpx;
}

.receiver-phone {
  font-size: 28rpx;
  color: #666;
}

.address-info {
  margin-bottom: 15rpx;
}

.address-detail {
  font-size: 26rpx;
  color: #999;
  line-height: 1.5;
}

.address-arrow {
  font-size: 32rpx;
  color: #999;
}

.products-section {
  background-color: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 10rpx;
  overflow: hidden;
}

.section-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
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

.coupon-section {
  background-color: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 10rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.coupon-label {
  font-size: 28rpx;
  color: #333;
}

.coupon-info {
  display: flex;
  align-items: center;
  gap: 15rpx;
}

.coupon-name {
  font-size: 26rpx;
  color: #ff4d4f;
}

.no-coupon {
  font-size: 26rpx;
  color: #999;
}

.coupon-arrow {
  font-size: 32rpx;
  color: #999;
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

.remark-section {
  background-color: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 10rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  gap: 30rpx;
}

.remark-label {
  font-size: 28rpx;
  color: #333;
  flex-shrink: 0;
}

.remark-input {
  flex: 1;
  font-size: 26rpx;
  color: #333;
  padding: 10rpx 0;
}

.remark-placeholder {
  color: #999;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-top: 1rpx solid #e0e0e0;
}

.total-info {
  display: flex;
  align-items: baseline;
  gap: 10rpx;
}

.total-text {
  font-size: 28rpx;
  color: #666;
}

.total-price {
  font-size: 36rpx;
  font-weight: bold;
  color: #ff4d4f;
}

.pay-btn {
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  color: #fff;
  border: none;
  border-radius: 30rpx;
  padding: 20rpx 60rpx;
  font-size: 30rpx;
  font-weight: bold;
}
</style>