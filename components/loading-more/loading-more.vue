<template>
  <view class="loading-more">
    <view v-if="loading" class="loading-content">
      <view class="loading-spinner"></view>
      <text class="loading-text">{{ text }}</text>
    </view>
    <view v-else-if="noMore" class="no-more-text">没有更多了</view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  loading?: boolean
  noMore?: boolean
  text?: string
}

withDefaults(defineProps<Props>(), {
  loading: false,
  noMore: false,
  text: '加载中...'
})
</script>

<style scoped lang="scss">
.loading-more {
  padding: 30rpx 0;
}

.loading-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15rpx;
}

.loading-spinner {
  width: 30rpx;
  height: 30rpx;
  border: 3rpx solid #f3f3f3;
  border-top: 3rpx solid #ff4d4f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 24rpx;
  color: #999;
}

.no-more-text {
  text-align: center;
  font-size: 24rpx;
  color: #999;
}
</style>