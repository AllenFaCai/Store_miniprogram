<template>
  <view class="user-center-container">
    <view class="user-header">
      <view class="user-info">
        <image :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill" class="user-avatar" />
        <view class="user-detail">
          <text class="user-name">{{ userInfo.nickname || '未登录' }}</text>
          <text class="user-phone">{{ userInfo.phone || '点击登录' }}</text>
        </view>
      </view>
      <view class="user-stats">
        <view class="stat-item" @click="goToOrders('all')">
          <text class="stat-value">{{ orderStats.all }}</text>
          <text class="stat-label">全部订单</text>
        </view>
        <view class="stat-item" @click="goToOrders('pending')">
          <text class="stat-value">{{ orderStats.pending }}</text>
          <text class="stat-label">待付款</text>
        </view>
        <view class="stat-item" @click="goToOrders('shipped')">
          <text class="stat-value">{{ orderStats.shipped }}</text>
          <text class="stat-label">待收货</text>
        </view>
        <view class="stat-item" @click="goToOrders('completed')">
          <text class="stat-value">{{ orderStats.completed }}</text>
          <text class="stat-label">已完成</text>
        </view>
      </view>
    </view>

    <view class="user-assets">
      <view class="asset-item" @click="goToPoints">
        <text class="asset-icon">💎</text>
        <text class="asset-label">积分</text>
        <text class="asset-value">{{ userInfo.points || 0 }}</text>
      </view>
      <view class="asset-item" @click="goToBalance">
        <text class="asset-icon">💰</text>
        <text class="asset-label">余额</text>
        <text class="asset-value">¥{{ (userInfo.balance || 0).toFixed(2) }}</text>
      </view>
      <view class="asset-item" @click="goToCoupons">
        <text class="asset-icon">🎫</text>
        <text class="asset-label">优惠券</text>
        <text class="asset-value">{{ couponCount }}</text>
      </view>
      <view class="asset-item" @click="goToFavorites">
        <text class="asset-icon">❤️</text>
        <text class="asset-label">收藏</text>
        <text class="asset-value">{{ favoriteCount }}</text>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-item" @click="goToAddresses">
        <text class="menu-icon">📍</text>
        <text class="menu-text">收货地址</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="goToOrders('all')">
        <text class="menu-icon">📦</text>
        <text class="menu-text">我的订单</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="goToAfterSales">
        <text class="menu-icon">🔄</text>
        <text class="menu-text">售后服务</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="goToSettings">
        <text class="menu-icon">⚙️</text>
        <text class="menu-text">设置</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="goToAbout">
        <text class="menu-icon">ℹ️</text>
        <text class="menu-text">关于我们</text>
        <text class="menu-arrow">></text>
      </view>
    </view>

    <view v-if="isLoggedIn" class="logout-btn" @click="logout">
      <text>退出登录</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { User } from '@/types'

const userInfo = ref<User>({} as User)
const orderStats = ref({
  all: 0,
  pending: 0,
  shipped: 0,
  completed: 0
})
const couponCount = ref(0)
const favoriteCount = ref(0)

const isLoggedIn = computed(() => {
  return !!userInfo.value.id
})

const loadUserInfo = async () => {
  const token = uni.getStorageSync('token')
  if (!token) {
    return
  }

  try {
    const res = await uni.request({
      url: 'https://your-api-domain.com/api/user/info',
      method: 'GET',
      header: {
        'Authorization': token
      }
    })

    if (res.data.code === 200) {
      userInfo.value = res.data.data
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

const loadOrderStats = async () => {
  const token = uni.getStorageSync('token')
  if (!token) {
    return
  }

  try {
    const res = await uni.request({
      url: 'https://your-api-domain.com/api/orders/stats',
      method: 'GET',
      header: {
        'Authorization': token
      }
    })

    if (res.data.code === 200) {
      orderStats.value = res.data.data
    }
  } catch (error) {
    console.error('加载订单统计失败:', error)
  }
}

const goToOrders = (status: string) => {
  if (!isLoggedIn.value) {
    goToLogin()
    return
  }
  uni.navigateTo({
    url: `/pages/store/order-list/order-list?status=${status}`
  })
}

const goToAddresses = () => {
  if (!isLoggedIn.value) {
    goToLogin()
    return
  }
  uni.navigateTo({
    url: '/pages/store/address-list/address-list'
  })
}

const goToCoupons = () => {
  if (!isLoggedIn.value) {
    goToLogin()
    return
  }
  uni.navigateTo({
    url: '/pages/store/coupon-list/coupon-list'
  })
}

const goToFavorites = () => {
  if (!isLoggedIn.value) {
    goToLogin()
    return
  }
  uni.navigateTo({
    url: '/pages/store/favorite-list/favorite-list'
  })
}

const goToPoints = () => {
  if (!isLoggedIn.value) {
    goToLogin()
    return
  }
  uni.navigateTo({
    url: '/pages/store/points/points'
  })
}

const goToBalance = () => {
  if (!isLoggedIn.value) {
    goToLogin()
    return
  }
  uni.navigateTo({
    url: '/pages/store/balance/balance'
  })
}

const goToAfterSales = () => {
  if (!isLoggedIn.value) {
    goToLogin()
    return
  }
  uni.navigateTo({
    url: '/pages/store/after-sales/after-sales'
  })
}

const goToSettings = () => {
  uni.navigateTo({
    url: '/pages/ucenter/settings/settings'
  })
}

const goToAbout = () => {
  uni.navigateTo({
    url: '/pages/ucenter/about/about'
  })
}

const goToLogin = () => {
  uni.navigateTo({
    url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd'
  })
}

const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync('token')
        userInfo.value = {} as User
        orderStats.value = {
          all: 0,
          pending: 0,
          shipped: 0,
          completed: 0
        }
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        })
      }
    }
  })
}

onMounted(() => {
  loadUserInfo()
  loadOrderStats()
})
</script>

<style scoped lang="scss">
.user-center-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40rpx;
}

.user-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx 30rpx;
  color: #fff;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.user-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.user-name {
  font-size: 36rpx;
  font-weight: bold;
}

.user-phone {
  font-size: 26rpx;
  opacity: 0.8;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 20rpx;
  padding: 30rpx 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.stat-value {
  font-size: 36rpx;
  font-weight: bold;
}

.stat-label {
  font-size: 24rpx;
  opacity: 0.8;
}

.user-assets {
  display: flex;
  justify-content: space-around;
  background-color: #fff;
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 30rpx 0;
}

.asset-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.asset-icon {
  font-size: 48rpx;
}

.asset-label {
  font-size: 24rpx;
  color: #666;
}

.asset-value {
  font-size: 28rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.menu-section {
  background-color: #fff;
  margin: 20rpx;
  border-radius: 20rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.menu-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.menu-arrow {
  font-size: 28rpx;
  color: #999;
}

.logout-btn {
  margin: 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  text-align: center;
  font-size: 28rpx;
  color: #ff4d4f;
}
</style>