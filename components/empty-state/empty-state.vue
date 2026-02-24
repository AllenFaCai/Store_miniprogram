<template>
  <view class="empty-state">
    <text class="empty-icon">{{ icon }}</text>
    <text class="empty-text">{{ text }}</text>
    <button v-if="showButton" class="empty-button" @click="handleButtonClick">{{ buttonText }}</button>
  </view>
</template>

<script setup lang="ts">
interface Props {
  icon?: string
  text: string
  showButton?: boolean
  buttonText?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: '📭',
  showButton: false,
  buttonText: '去逛逛'
})

const emit = defineEmits<{
  buttonClick: []
}>()

const handleButtonClick = () => {
  emit('buttonClick')
}
</script>

<style scoped lang="scss">
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

.empty-button {
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  color: #fff;
  border: none;
  border-radius: 30rpx;
  padding: 20rpx 60rpx;
  font-size: 28rpx;
}
</style>