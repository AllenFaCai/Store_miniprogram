<template>
  <view class="points-container">
    <scroll-view scroll-y class="scroll-content">
      <!-- 积分概览 -->
      <view class="points-overview">
        <text class="points-title">我的积分</text>
        <text class="points-amount">{{ totalPoints }}</text>
        <text class="points-tip">积分可用于兑换商品或抵扣订单金额</text>
      </view>

      <!-- 积分记录 -->
      <view class="points-record">
        <view class="record-header">
          <text class="record-title">积分记录</text>
        </view>
        <view v-if="loading" class="loading">加载中...</view>
        <view v-else-if="records.length === 0" class="empty">
          <text class="empty-text">暂无积分记录</text>
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
              class="record-points"
              :class="{ 'increase': record.type === 'increase', 'decrease': record.type === 'decrease' }"
            >
              {{ record.type === 'increase' ? '+' : '-' }}{{ record.points }}
            </text>
          </view>
        </view>
      </view>

      <!-- 积分规则 -->
      <view class="points-rules">
        <view class="rules-header">
          <text class="rules-title">积分规则</text>
        </view>
        <view class="rules-content">
          <view class="rule-item">
            <text class="rule-icon">1.</text>
            <text class="rule-text">购物消费：每消费1元获得1积分</text>
          </view>
          <view class="rule-item">
            <text class="rule-icon">2.</text>
            <text class="rule-text">评价商品：每评价1个商品获得5积分</text>
          </view>
          <view class="rule-item">
            <text class="rule-icon">3.</text>
            <text class="rule-text">每日签到：连续签到可获得额外积分</text>
          </view>
          <view class="rule-item">
            <text class="rule-icon">4.</text>
            <text class="rule-text">积分有效期：自获得之日起1年内有效</text>
          </view>
          <view class="rule-item">
            <text class="rule-icon">5.</text>
            <text class="rule-text">100积分可抵扣1元订单金额</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface PointsRecord {
  id: string
  name: string
  points: number
  type: 'increase' | 'decrease'
  createdAt: string
}

const totalPoints = ref(1280)
const records = ref<PointsRecord[]>([])
const loading = ref(true)

const loadPointsData = async () => {
  // 这里应该调用获取积分记录的API
  // 模拟数据
  setTimeout(() => {
    records.value = [
      {
        id: '1',
        name: '购物获得积分',
        points: 199,
        type: 'increase',
        createdAt: '2024-01-01 12:00:00'
      },
      {
        id: '2',
        name: '评价商品获得积分',
        points: 5,
        type: 'increase',
        createdAt: '2024-01-02 10:00:00'
      },
      {
        id: '3',
        name: '积分抵扣订单',
        points: 100,
        type: 'decrease',
        createdAt: '2024-01-03 14:00:00'
      },
      {
        id: '4',
        name: '签到获得积分',
        points: 10,
        type: 'increase',
        createdAt: '2024-01-04 09:00:00'
      }
    ]
    loading.value = false
  }, 1000)
}

onMounted(() => {
  loadPointsData()
})
</script>

<style scoped lang="scss">
.points-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.scroll-content {
  padding-bottom: 20rpx;
}

.points-overview {
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  color: #fff;
  padding: 60rpx 30rpx;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.points-overview::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)" /></svg>');
  background-size: 20rpx 20rpx;
}

.points-title {
  font-size: 32rpx;
  margin-bottom: 30rpx;
  position: relative;
  z-index: 1;
}

.points-amount {
  font-size: 72rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  position: relative;
  z-index: 1;
}

.points-tip {
  font-size: 24rpx;
  opacity: 0.9;
  position: relative;
  z-index: 1;
}

.points-record {
  background-color: #fff;
  margin: 20rpx;
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

.record-points {
  font-size: 32rpx;
  font-weight: bold;
}

.record-points.increase {
  color: #52c41a;
}

.record-points.decrease {
  color: #ff4d4f;
}

.points-rules {
  background-color: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 10rpx;
  overflow: hidden;
}

.rules-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.rules-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.rules-content {
  padding: 30rpx;
}

.rule-item {
  display: flex;
  margin-bottom: 20rpx;
  align-items: flex-start;
}

.rule-item:last-child {
  margin-bottom: 0;
}

.rule-icon {
  font-size: 28rpx;
  color: #666;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.rule-text {
  flex: 1;
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}
</style>