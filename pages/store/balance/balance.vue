<template>
  <view class="balance-container">
    <scroll-view scroll-y class="scroll-content">
      <!-- 余额概览 -->
      <view class="balance-overview">
        <text class="balance-title">我的余额</text>
        <text class="balance-amount">¥{{ totalBalance }}</text>
        <text class="balance-tip">可用于订单支付</text>
      </view>

      <!-- 余额操作 -->
      <view class="balance-actions">
        <button class="action-btn recharge" @click="recharge">
          <text class="action-icon">🔄</text>
          <text class="action-text">充值</text>
        </button>
        <button class="action-btn withdraw" @click="withdraw">
          <text class="action-icon">💳</text>
          <text class="action-text">提现</text>
        </button>
      </view>

      <!-- 余额记录 -->
      <view class="balance-record">
        <view class="record-header">
          <text class="record-title">余额记录</text>
        </view>
        <view v-if="loading" class="loading">加载中...</view>
        <view v-else-if="records.length === 0" class="empty">
          <text class="empty-text">暂无余额记录</text>
        </view>
        <view v-else class="record-list">
          <view
            v-for="record in records"
            :key="record.id"
            class="record-item"
          >
            <view class="record-content">
              <text class="record-name">{{ record.name }}</text>
              <text class="record-time">{{ record.createdAt }}</text>
            </view>
            <text
              class="record-amount"
              :class="{ 'increase': record.type === 'recharge', 'decrease': record.type === 'consume' }"
            >
              {{ record.type === 'recharge' ? '+' : '-' }}¥{{ record.amount.toFixed(2) }}
            </text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface BalanceRecord {
  id: string
  name: string
  amount: number
  type: 'recharge' | 'consume' | 'withdraw'
  createdAt: string
}

const totalBalance = ref(1280.50)
const records = ref<BalanceRecord[]>([])
const loading = ref(true)

const loadBalanceData = async () => {
  // 这里应该调用获取余额记录的API
  // 模拟数据
  setTimeout(() => {
    records.value = [
      {
        id: '1',
        name: '充值',
        amount: 500,
        type: 'recharge',
        createdAt: '2024-01-01 12:00:00'
      },
      {
        id: '2',
        name: '订单支付',
        amount: 199.50,
        type: 'consume',
        createdAt: '2024-01-02 10:00:00'
      },
      {
        id: '3',
        name: '充值',
        amount: 1000,
        type: 'recharge',
        createdAt: '2024-01-03 14:00:00'
      },
      {
        id: '4',
        name: '订单支付',
        amount: 120,
        type: 'consume',
        createdAt: '2024-01-04 09:00:00'
      }
    ]
    loading.value = false
  }, 1000)
}

const recharge = () => {
  uni.showModal({
    title: '余额充值',
    content: '请选择充值金额',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '跳转到充值页面',
          icon: 'success'
        })
      }
    }
  })
}

const withdraw = () => {
  if (totalBalance.value === 0) {
    uni.showToast({
      title: '余额不足',
      icon: 'none'
    })
    return
  }
  uni.showModal({
    title: '余额提现',
    content: '确定要提现吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '跳转到提现页面',
          icon: 'success'
        })
      }
    }
  })
}

onMounted(() => {
  loadBalanceData()
})
</script>

<style scoped lang="scss">
.balance-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.scroll-content {
  padding-bottom: 20rpx;
}

.balance-overview {
  background: linear-gradient(135deg, #1890ff, #096dd9);
  color: #fff;
  padding: 60rpx 30rpx;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.balance-overview::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)" /></svg>');
  background-size: 20rpx 20rpx;
}

.balance-title {
  font-size: 32rpx;
  margin-bottom: 30rpx;
  position: relative;
  z-index: 1;
}

.balance-amount {
  font-size: 72rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  position: relative;
  z-index: 1;
}

.balance-tip {
  font-size: 24rpx;
  opacity: 0.9;
  position: relative;
  z-index: 1;
}

.balance-actions {
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
}

.action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 1rpx solid #e0e0e0;
  border-radius: 10rpx;
  padding: 40rpx 20rpx;
  gap: 15rpx;
}

.action-btn.recharge {
  border-color: #1890ff;
}

.action-btn.withdraw {
  border-color: #52c41a;
}

.action-icon {
  font-size: 48rpx;
}

.action-text {
  font-size: 28rpx;
  color: #333;
}

.balance-record {
  background-color: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 10rpx;
  overflow: hidden;
}

.record-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.record-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.loading {
  text-align: center;
  padding: 40rpx 0;
  color: #999;
  font-size: 28rpx;
}

.empty {
  text-align: center;
  padding: 60rpx 0;
  color: #999;
  font-size: 28rpx;
}

.record-list {
  padding: 0 30rpx;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.record-item:last-child {
  border-bottom: none;
}

.record-content {
  flex: 1;
}

.record-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.record-time {
  font-size: 24rpx;
  color: #999;
}

.record-amount {
  font-size: 32rpx;
  font-weight: bold;
}

.record-amount.increase {
  color: #52c41a;
}

.record-amount.decrease {
  color: #ff4d4f;
}
</style>