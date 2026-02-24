<template>
  <view class="product-card" @click="handleClick">
    <image :src="product.images[0]" mode="aspectFill" class="product-image" />
    <view class="product-info">
      <text class="product-name">{{ product.name }}</text>
      <text class="product-desc" v-if="showDesc">{{ product.description }}</text>
      <view class="product-bottom">
        <view class="price-row">
          <text class="price">¥{{ product.price }}</text>
          <text v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</text>
        </view>
        <text class="sales" v-if="showSales">已售{{ product.sales }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { Product } from '@/types'

interface Props {
  product: Product
  showDesc?: boolean
  showSales?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showDesc: false,
  showSales: true
})

const emit = defineEmits<{
  click: [product: Product]
}>()

const handleClick = () => {
  emit('click', props.product)
}
</script>

<style scoped lang="scss">
.product-card {
  background-color: #fff;
  border-radius: 10rpx;
  overflow: hidden;
  cursor: pointer;
}

.product-image {
  width: 100%;
  height: 300rpx;
  display: block;
}

.product-info {
  padding: 20rpx;
}

.product-name {
  font-size: 28rpx;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  margin-bottom: 10rpx;
}

.product-desc {
  font-size: 24rpx;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 10rpx;
  display: block;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-row {
  display: flex;
  align-items: baseline;
}

.price {
  font-size: 32rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.original-price {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
  margin-left: 10rpx;
}

.sales {
  font-size: 22rpx;
  color: #999;
}
</style>