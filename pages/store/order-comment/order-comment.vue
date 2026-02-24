<template>
  <view class="order-comment-container">
    <scroll-view scroll-y class="scroll-content">
      <!-- 商品列表 -->
      <view class="products-section">
        <view v-for="(item, index) in orderItems" :key="item.productId" class="product-item">
          <image :src="item.product.images[0]" mode="aspectFill" class="product-image" />
          <view class="product-info">
            <text class="product-name">{{ item.product.name }}</text>
            <text v-if="item.spec" class="product-spec">{{ item.spec }}</text>
          </view>
        </view>
      </view>

      <!-- 评价等级 -->
      <view class="rating-section">
        <text class="rating-label">商品评价</text>
        <view class="rating-stars">
          <text
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ 'star-active': rating >= star }"
            @click="rating = star"
          >
            ★
          </text>
        </view>
        <text class="rating-text">{{ ratingText }}</text>
      </view>

      <!-- 评价内容 -->
      <view class="content-section">
        <text class="content-label">评价内容</text>
        <textarea
          v-model="commentContent"
          class="content-textarea"
          placeholder="请输入您的评价..."
          placeholder-class="content-placeholder"
          rows="5"
        ></textarea>
      </view>

      <!-- 上传图片 -->
      <view class="upload-section">
        <text class="upload-label">上传图片（最多5张）</text>
        <view class="upload-grid">
          <view
            v-for="(image, index) in uploadedImages"
            :key="index"
            class="upload-item"
          >
            <image :src="image" mode="aspectFill" class="upload-image" />
            <text class="upload-remove" @click="removeImage(index)">×</text>
          </view>
          <view
            v-if="uploadedImages.length < 5"
            class="upload-item upload-add"
            @click="uploadImage"
          >
            <text class="upload-add-icon">+</text>
          </view>
        </view>
      </view>

      <!-- 匿名评价 -->
      <view class="anonymous-section">
        <text class="anonymous-label">匿名评价</text>
        <switch 
          :checked="anonymous" 
          @change="anonymous = $event.detail.value" 
          class="anonymous-switch" 
        />
      </view>
    </scroll-view>

    <!-- 底部提交 -->
    <view class="bottom-bar">
      <button class="submit-btn" @click="submitComment">提交评价</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const orderId = ref('')
const orderItems = ref<any[]>([
  {
    productId: '1',
    product: {
      id: '1',
      name: 'iPhone 15 Pro',
      images: ['https://example.com/iphone15.jpg'],
      price: 9999
    },
    spec: '颜色：午夜色',
    quantity: 1
  }
])
const rating = ref(5)
const commentContent = ref('')
const uploadedImages = ref<string[]>([])
const anonymous = ref(false)

const ratingText = computed(() => {
  const texts = ['', '非常差', '较差', '一般', '满意', '非常满意']
  return texts[rating.value] || ''
})

const uploadImage = async () => {
  uni.chooseImage({
    count: 5 - uploadedImages.value.length,
    sizeType: ['compressed'],
    success: (res) => {
      uploadedImages.value = [...uploadedImages.value, ...res.tempFilePaths]
    }
  })
}

const removeImage = (index: number) => {
  uploadedImages.value.splice(index, 1)
}

const submitComment = async () => {
  if (!commentContent.value.trim()) {
    uni.showToast({
      title: '请输入评价内容',
      icon: 'none'
    })
    return
  }

  try {
    uni.showLoading({ title: '提交评价中...' })
    
    // 这里应该调用提交评价的API
    console.log('提交评价:', {
      orderId: orderId.value,
      rating: rating.value,
      content: commentContent.value,
      images: uploadedImages.value,
      anonymous: anonymous.value,
      items: orderItems.value.map(item => item.productId)
    })

    // 模拟提交成功
    setTimeout(() => {
      uni.hideLoading()
      uni.showToast({
        title: '评价提交成功',
        icon: 'success'
      })
      // 返回订单详情页
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }, 1000)
  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: '评价提交失败',
      icon: 'none'
    })
  }
}

// 页面加载时获取订单信息
const loadOrderData = () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  if (currentPage.options.orderId) {
    orderId.value = currentPage.options.orderId
  }
  // 这里应该调用获取订单详情的API，加载商品信息
}

loadOrderData()
</script>

<style scoped lang="scss">
.order-comment-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.scroll-content {
  padding-bottom: 120rpx;
}

.products-section {
  background-color: #fff;
  margin: 20rpx;
  border-radius: 10rpx;
  padding: 30rpx;
}

.product-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.product-item:last-child {
  margin-bottom: 0;
}

.product-image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 8rpx;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  padding-left: 20rpx;
}

.product-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-spec {
  font-size: 24rpx;
  color: #999;
}

.rating-section {
  background-color: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 10rpx;
  padding: 30rpx;
}

.rating-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.rating-stars {
  display: flex;
  gap: 20rpx;
  margin-bottom: 15rpx;
}

.star {
  font-size: 48rpx;
  color: #e0e0e0;
  cursor: pointer;
}

.star-active {
  color: #ffd700;
}

.rating-text {
  font-size: 26rpx;
  color: #666;
}

.content-section {
  background-color: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 10rpx;
  padding: 30rpx;
}

.content-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.content-textarea {
  font-size: 26rpx;
  color: #333;
  min-height: 200rpx;
  padding: 20rpx;
  background-color: #f9f9f9;
  border-radius: 8rpx;
  line-height: 1.5;
}

.content-placeholder {
  color: #999;
}

.upload-section {
  background-color: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 10rpx;
  padding: 30rpx;
}

.upload-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.upload-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20rpx;
}

.upload-item {
  position: relative;
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
  overflow: hidden;
}

.upload-image {
  width: 100%;
  height: 100%;
}

.upload-remove {
  position: absolute;
  top: 0;
  right: 0;
  width: 36rpx;
  height: 36rpx;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 28rpx;
  text-align: center;
  line-height: 36rpx;
  border-radius: 0 8rpx 0 18rpx;
}

.upload-add {
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1rpx dashed #e0e0e0;
}

.upload-add-icon {
  font-size: 48rpx;
  color: #999;
}

.anonymous-section {
  background-color: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 10rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.anonymous-label {
  font-size: 28rpx;
  color: #333;
}

.anonymous-switch {
  transform: scale(0.8);
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-top: 1rpx solid #e0e0e0;
}

.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  color: #fff;
  border: none;
  border-radius: 30rpx;
  padding: 25rpx 0;
  font-size: 32rpx;
  font-weight: bold;
}
</style>