<template>
  <view class="favorite-list-container">
    <scroll-view scroll-y class="scroll-content" @scrolltolower="loadMore">
      <view v-if="loading" class="loading">加载中...</view>
      <view v-else-if="favorites.length === 0" class="empty">
        <text class="empty-icon">❤️</text>
        <text class="empty-text">暂无收藏</text>
        <button class="empty-btn" @click="goToHome">去购物</button>
      </view>
      <view v-else class="favorite-grid">
        <view
          v-for="favorite in favorites"
          :key="favorite.id"
          class="favorite-item"
          @click="goToProductDetail(favorite.product.id)"
        >
          <view class="product-image-container">
            <image :src="favorite.product.images[0]" mode="aspectFill" class="product-image" />
            <button class="favorite-btn" @click.stop="removeFavorite(favorite.id)">
              <text class="favorite-icon">❤️</text>
            </button>
          </view>
          <view class="product-info">
            <text class="product-name">{{ favorite.product.name }}</text>
            <text class="product-price">¥{{ favorite.product.price }}</text>
          </view>
        </view>
      </view>
      <view v-if="!loading && favorites.length > 0" class="loading-more">
        <text v-if="loadingMore">加载中...</text>
        <text v-else-if="noMore">没有更多了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Product } from '@/types'

interface Favorite {
  id: string
  productId: string
  product: Product
  createdAt: string
}

const favorites = ref<Favorite[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = ref(10)

const loadFavorites = async () => {
  loading.value = true
  try {
    // 这里应该调用获取收藏列表的API
    // 模拟数据
    setTimeout(() => {
      favorites.value = [
        {
          id: '1',
          productId: '1',
          product: {
            id: '1',
            name: 'iPhone 15 Pro',
            description: '苹果最新旗舰手机',
            price: 9999,
            originalPrice: 10999,
            images: ['https://example.com/iphone15.jpg'],
            categoryId: '1',
            sales: 1000,
            stock: 500,
            isHot: true,
            isNew: true,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          },
          createdAt: '2024-01-01'
        },
        {
          id: '2',
          productId: '2',
          product: {
            id: '2',
            name: 'AirPods Pro 2',
            description: '主动降噪耳机',
            price: 1899,
            originalPrice: 1999,
            images: ['https://example.com/airpods.jpg'],
            categoryId: '1',
            sales: 2000,
            stock: 1000,
            isHot: true,
            isNew: false,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          },
          createdAt: '2024-01-01'
        },
        {
          id: '3',
          productId: '3',
          product: {
            id: '3',
            name: 'MacBook Air M3',
            description: '轻薄笔记本电脑',
            price: 7999,
            originalPrice: 8999,
            images: ['https://example.com/macbook.jpg'],
            categoryId: '1',
            sales: 500,
            stock: 200,
            isHot: true,
            isNew: true,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          },
          createdAt: '2024-01-01'
        },
        {
          id: '4',
          productId: '4',
          product: {
            id: '4',
            name: 'iPad Pro 12.9',
            description: '专业平板电脑',
            price: 8999,
            originalPrice: 9999,
            images: ['https://example.com/ipad.jpg'],
            categoryId: '1',
            sales: 800,
            stock: 300,
            isHot: false,
            isNew: true,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          },
          createdAt: '2024-01-01'
        }
      ]
      loading.value = false
      noMore.value = true
    }, 1000)
  } catch (error) {
    console.error('加载收藏失败:', error)
    loading.value = false
  }
}

const loadMore = async () => {
  if (loadingMore.value || noMore.value) return
  loadingMore.value = true
  try {
    // 这里应该调用加载更多收藏的API
    setTimeout(() => {
      loadingMore.value = false
      noMore.value = true
    }, 1000)
  } catch (error) {
    console.error('加载更多收藏失败:', error)
    loadingMore.value = false
  }
}

const removeFavorite = (favoriteId: string) => {
  uni.showModal({
    title: '取消收藏',
    content: '确定要取消收藏这个商品吗？',
    success: (res) => {
      if (res.confirm) {
        // 调用取消收藏API
        const index = favorites.value.findIndex(item => item.id === favoriteId)
        if (index > -1) {
          favorites.value.splice(index, 1)
          uni.showToast({
            title: '已取消收藏',
            icon: 'success'
          })
        }
      }
    }
  })
}

const goToProductDetail = (productId: string) => {
  uni.navigateTo({
    url: `/pages/store/product-detail/product-detail?id=${productId}`
  })
}

const goToHome = () => {
  uni.switchTab({
    url: '/pages/store/home/home'
  })
}

onMounted(() => {
  loadFavorites()
})
</script>

<style scoped lang="scss">
.favorite-list-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.scroll-content {
  padding: 20rpx;
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

.favorite-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.favorite-item {
  background-color: #fff;
  border-radius: 10rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.product-image-container {
  position: relative;
  width: 100%;
  height: 300rpx;
}

.product-image {
  width: 100%;
  height: 100%;
}

.favorite-btn {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.favorite-icon {
  font-size: 36rpx;
  color: #fff;
}

.product-info {
  padding: 20rpx;
}

.product-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 15rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.product-price {
  font-size: 32rpx;
  font-weight: bold;
  color: #ff4d4f;
}

.loading-more {
  text-align: center;
  padding: 40rpx 0;
  color: #999;
  font-size: 24rpx;
}
</style>