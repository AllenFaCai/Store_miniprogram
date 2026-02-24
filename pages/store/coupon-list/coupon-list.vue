<template>
  <view class="coupon-list-container">
    <scroll-view scroll-y class="scroll-content">
      <view class="coupon-tabs">
        <view
          v-for="(tab, index) in tabs"
          :key="index"
          class="coupon-tab"
          :class="{ 'active': activeTab === tab.key }"
          @click="switchTab(tab.key)"
        >
          <text class="tab-text">{{ tab.name }}</text>
        </view>
      </view>

      <view v-if="loading" class="loading">加载中...</view>
      <view v-else-if="coupons.length === 0" class="empty">
        <text class="empty-icon">🎫</text>
        <text class="empty-text">暂无优惠券</text>
        <button class="empty-btn" @click="goToHome">去购物</button>
      </view>
      <view v-else class="coupon-list">
        <view
          v-for="coupon in coupons"
          :key="coupon.id"
          class="coupon-item"
          :class="{ 'disabled': coupon.status === 'used' || coupon.status === 'expired' }"
        >
          <view class="coupon-left">
            <text class="coupon-amount">¥{{ coupon.value }}</text>
            <text class="coupon-condition">满{{ coupon.minAmount }}可用</text>
          </view>
          <view class="coupon-right">
            <text class="coupon-name">{{ coupon.name }}</text>
            <text class="coupon-validity">有效期至：{{ coupon.endDate }}</text>
            <text v-if="coupon.status === 'available'" class="coupon-status available">可使用</text>
            <text v-else-if="coupon.status === 'used'" class="coupon-status used">已使用</text>
            <text v-else-if="coupon.status === 'expired'" class="coupon-status expired">已过期</text>
          </view>
          <view class="coupon-corner"></view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Coupon {
  id: string
  name: string
  value: number
  minAmount: number
  startDate: string
  endDate: string
  status: 'available' | 'used' | 'expired'
  type: 'full减' | '折扣'
}

const tabs = [
  { key: 'all', name: '全部' },
  { key: 'available', name: '可使用' },
  { key: 'used', name: '已使用' },
  { key: 'expired', name: '已过期' }
]

const activeTab = ref('all')
const coupons = ref<Coupon[]>([])
const loading = ref(true)

const switchTab = (tabKey: string) => {
  activeTab.value = tabKey
  loadCoupons()
}

const loadCoupons = async () => {
  loading.value = true
  try {
    // 这里应该调用获取优惠券列表的API
    // 模拟数据
    setTimeout(() => {
      coupons.value = [
        {
          id: '1',
          name: '新人专享券',
          value: 50,
          minAmount: 200,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          status: 'available',
          type: 'full减'
        },
        {
          id: '2',
          name: '全场通用券',
          value: 20,
          minAmount: 100,
          startDate: '2024-01-01',
          endDate: '2024-06-30',
          status: 'available',
          type: 'full减'
        },
        {
          id: '3',
          name: '限时折扣券',
          value: 30,
          minAmount: 150,
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          status: 'expired',
          type: 'full减'
        },
        {
          id: '4',
          name: '会员专享券',
          value: 100,
          minAmount: 500,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          status: 'used',
          type: 'full减'
        }
      ]
      loading.value = false
    }, 1000)
  } catch (error) {
    console.error('加载优惠券失败:', error)
    loading.value = false
  }
}

const goToHome = () => {
  uni.switchTab({
    url: '/pages/store/home/home'
  })
}

onMounted(() => {
  loadCoupons()
})
</script>

<style scoped lang="scss">
.coupon-list-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.coupon-tabs {
  display: flex;
  background-color: #fff;
  border-bottom: 1rpx solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.coupon-tab {
  flex: 1;
  text-align: center;
  padding: 30rpx 0;
  position: relative;
}

.coupon-tab.active {
  color: #ff4d4f;
}

.coupon-tab.active::after {
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

.coupon-list {
  padding: 20rpx;
}

.coupon-item {
  display: flex;
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  border-radius: 10rpx;
  margin-bottom: 20rpx;
  position: relative;
  overflow: hidden;
}

.coupon-item.disabled {
  background: linear-gradient(135deg, #999, #777);
}

.coupon-left {
  width: 200rpx;
  padding: 40rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  position: relative;
}

.coupon-left::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 1rpx;
  background-color: rgba(255, 255, 255, 0.3);
}

.coupon-amount {
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.coupon-condition {
  font-size: 24rpx;
  opacity: 0.9;
}

.coupon-right {
  flex: 1;
  padding: 30rpx;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.coupon-name {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.coupon-validity {
  font-size: 24rpx;
  opacity: 0.9;
  margin-bottom: 20rpx;
}

.coupon-status {
  font-size: 20rpx;
  padding: 5rpx 15rpx;
  border-radius: 15rpx;
  align-self: flex-start;
}

.coupon-status.available {
  background-color: rgba(255, 255, 255, 0.3);
}

.coupon-status.used {
  background-color: rgba(255, 255, 255, 0.3);
}

.coupon-status.expired {
  background-color: rgba(255, 255, 255, 0.3);
}

.coupon-corner {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(50%, -50%);
  width: 40rpx;
  height: 40rpx;
  background-color: #f5f5f5;
  border-radius: 50%;
}
</style>