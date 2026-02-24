<template>
  <view class="after-sales-container">
    <scroll-view scroll-y class="scroll-content">
      <view class="after-sales-overview">
        <text class="overview-title">售后服务</text>
        <text class="overview-subtitle">我们致力于为您提供优质的售后服务体验</text>
      </view>

      <!-- 售后类型 -->
      <view class="after-sales-types">
        <view
          v-for="type in afterSalesTypes"
          :key="type.key"
          class="type-item"
          @click="selectAfterSalesType(type.key)"
        >
          <text class="type-icon">{{ type.icon }}</text>
          <text class="type-name">{{ type.name }}</text>
          <text class="type-desc">{{ type.description }}</text>
        </view>
      </view>

      <!-- 售后政策 -->
      <view class="after-sales-policy">
        <view class="policy-header">
          <text class="policy-title">售后政策</text>
        </view>
        <view class="policy-content">
          <view class="policy-item">
            <text class="policy-icon">📦</text>
            <text class="policy-text">7天无理由退换货</text>
          </view>
          <view class="policy-item">
            <text class="policy-icon">🛡️</text>
            <text class="policy-text">正品保障，假一赔十</text>
          </view>
          <view class="policy-item">
            <text class="policy-icon">⚡</text>
            <text class="policy-text">快速退款，24小时内处理</text>
          </view>
          <view class="policy-item">
            <text class="policy-icon">🚚</text>
            <text class="policy-text">退换货运费险</text>
          </view>
        </view>
      </view>

      <!-- 售后流程 -->
      <view class="after-sales-process">
        <view class="process-header">
          <text class="process-title">售后流程</text>
        </view>
        <view class="process-content">
          <view
            v-for="(step, index) in processSteps"
            :key="index"
            class="process-step"
          >
            <view class="step-number">{{ index + 1 }}</view>
            <view class="step-content">
              <text class="step-name">{{ step.name }}</text>
              <text class="step-desc">{{ step.description }}</text>
            </view>
            <view v-if="index < processSteps.length - 1" class="step-line"></view>
          </view>
        </view>
      </view>

      <!-- 联系客服 -->
      <view class="contact-service">
        <button class="service-btn" @click="contactCustomerService">
          <text class="service-icon">💬</text>
          <text class="service-text">联系客服</text>
        </button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface AfterSalesType {
  key: string
  name: string
  description: string
  icon: string
}

interface ProcessStep {
  name: string
  description: string
}

const afterSalesTypes = ref<AfterSalesType[]>([
  {
    key: 'refund',
    name: '申请退款',
    description: '未发货或已收货均可申请',
    icon: '💰'
  },
  {
    key: 'return',
    name: '申请退货',
    description: '已收货且符合退货条件',
    icon: '📦'
  },
  {
    key: 'exchange',
    name: '申请换货',
    description: '商品质量问题可申请',
    icon: '🔄'
  },
  {
    key: 'repair',
    name: '申请维修',
    description: '商品保修期内可申请',
    icon: '🔧'
  }
])

const processSteps = ref<ProcessStep[]>([
  {
    name: '提交申请',
    description: '在订单详情页选择售后类型并提交申请'
  },
  {
    name: '审核处理',
    description: '客服将在24小时内审核您的申请'
  },
  {
    name: '寄回商品',
    description: '审核通过后，按照指引寄回商品'
  },
  {
    name: '确认收货',
    description: '商家确认收到商品后进行处理'
  },
  {
    name: '完成售后',
    description: '退款/换货/维修完成'
  }
])

const selectAfterSalesType = (type: string) => {
  uni.showToast({
    title: `您选择了${type}`,
    icon: 'success'
  })
  // 这里应该跳转到对应的售后申请页面
}

const contactCustomerService = () => {
  uni.showModal({
    title: '联系客服',
    content: '客服工作时间：9:00-21:00',
    confirmText: '在线咨询',
    cancelText: '电话联系',
    success: (res) => {
      if (res.confirm) {
        // 跳转到在线咨询页面
        uni.showToast({
          title: '跳转到在线咨询',
          icon: 'success'
        })
      } else if (res.cancel) {
        // 拨打电话
        uni.makePhoneCall({
          phoneNumber: '400-123-4567'
        })
      }
    }
  })
}
</script>

<style scoped lang="scss">
.after-sales-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.scroll-content {
  padding-bottom: 20rpx;
}

.after-sales-overview {
  background: linear-gradient(135deg, #1890ff, #096dd9);
  color: #fff;
  padding: 60rpx 30rpx;
  text-align: center;
}

.overview-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.overview-subtitle {
  font-size: 28rpx;
  opacity: 0.9;
}

.after-sales-types {
  padding: 20rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.type-item {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.type-icon {
  font-size: 64rpx;
  margin-bottom: 20rpx;
}

.type-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 15rpx;
}

.type-desc {
  font-size: 24rpx;
  color: #999;
  line-height: 1.4;
}

.after-sales-policy {
  background-color: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 10rpx;
  overflow: hidden;
}

.policy-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.policy-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.policy-content {
  padding: 30rpx;
}

.policy-item {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  gap: 20rpx;
}

.policy-item:last-child {
  margin-bottom: 0;
}

.policy-icon {
  font-size: 40rpx;
  flex-shrink: 0;
}

.policy-text {
  font-size: 28rpx;
  color: #333;
}

.after-sales-process {
  background-color: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 10rpx;
  overflow: hidden;
}

.process-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.process-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.process-content {
  padding: 30rpx;
  position: relative;
}

.process-step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 40rpx;
  position: relative;
}

.process-step:last-child {
  margin-bottom: 0;
}

.step-number {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  background-color: #1890ff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: bold;
  flex-shrink: 0;
  margin-right: 20rpx;
}

.step-content {
  flex: 1;
}

.step-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.step-desc {
  font-size: 24rpx;
  color: #999;
  line-height: 1.4;
}

.step-line {
  position: absolute;
  top: 50rpx;
  left: 25rpx;
  bottom: -40rpx;
  width: 2rpx;
  background-color: #e0e0e0;
}

.contact-service {
  padding: 20rpx;
}

.service-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15rpx;
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  color: #fff;
  border: none;
  border-radius: 30rpx;
  padding: 30rpx 0;
  font-size: 32rpx;
  font-weight: bold;
}

.service-icon {
  font-size: 36rpx;
}

.service-text {
  font-size: 32rpx;
}
</style>