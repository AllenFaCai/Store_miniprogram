<template>
  <view class="home-container">
    <view class="search-bar" @click="goToSearch">
      <view class="search-input">
        <text class="search-icon">🔍</text>
        <text class="search-placeholder">搜索商品</text>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-content" @scrolltolower="loadMore">
      <swiper class="banner-swiper" indicator-dots circular autoplay interval="3000">
        <swiper-item v-for="(banner, index) in banners" :key="index">
          <image :src="banner.image" mode="aspectFill" class="banner-image" />
        </swiper-item>
      </swiper>

      <view class="category-section">
        <view class="section-title">
          <text class="title-text">商品分类</text>
          <text class="more-text" @click="goToCategories">更多 ></text>
        </view>
        <view class="category-grid">
          <view v-for="category in categories" :key="category.id" class="category-item" @click="goToCategory(category.id)">
            <image :src="category.icon" mode="aspectFill" class="category-icon" />
            <text class="category-name">{{ category.name }}</text>
          </view>
        </view>
      </view>

      <view class="hot-section">
        <view class="section-title">
          <text class="title-text">热门推荐</text>
        </view>
        <view class="product-grid">
          <view v-for="product in hotProducts" :key="product.id" class="product-item" @click="goToProductDetail(product.id)">
            <image :src="product.images[0]" mode="aspectFill" class="product-image" />
            <view class="product-info">
              <text class="product-name">{{ product.name }}</text>
              <view class="product-price-row">
                <text class="product-price">¥{{ product.price }}</text>
                <text v-if="product.originalPrice" class="product-original-price">¥{{ product.originalPrice }}</text>
              </view>
              <text class="product-sales">已售{{ product.sales }}件</text>
            </view>
          </view>
        </view>
      </view>

      <view class="recommend-section">
        <view class="section-title">
          <text class="title-text">为你推荐</text>
        </view>
        <view class="product-list">
          <view v-for="product in recommendProducts" :key="product.id" class="product-list-item" @click="goToProductDetail(product.id)">
            <image :src="product.images[0]" mode="aspectFill" class="list-product-image" />
            <view class="list-product-info">
              <text class="list-product-name">{{ product.name }}</text>
              <text class="list-product-desc">{{ product.description }}</text>
              <view class="list-product-price-row">
                <text class="list-product-price">¥{{ product.price }}</text>
                <text class="list-product-sales">已售{{ product.sales }}件</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view v-if="loading" class="loading-text">加载中...</view>
      <view v-if="noMore" class="loading-text">没有更多了</view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productApi } from '@/api/product'
import { Product, Category } from '@/types'

const banners = ref([
  { image: 'https://via.placeholder.com/750x300/FF6B6B/FFFFFF?text=Banner1' },
  { image: 'https://via.placeholder.com/750x300/4ECDC4/FFFFFF?text=Banner2' },
  { image: 'https://via.placeholder.com/750x300/45B7D1/FFFFFF?text=Banner3' }
])

const categories = ref<Category[]>([
  { id: '1', name: '数码', icon: 'https://via.placeholder.com/100x100/FF6B6B/FFFFFF?text=数码', level: 1, sort: 1 },
  { id: '2', name: '服饰', icon: 'https://via.placeholder.com/100x100/4ECDC4/FFFFFF?text=服饰', level: 1, sort: 2 },
  { id: '3', name: '食品', icon: 'https://via.placeholder.com/100x100/45B7D1/FFFFFF?text=食品', level: 1, sort: 3 },
  { id: '4', name: '家居', icon: 'https://via.placeholder.com/100x100/96CEB4/FFFFFF?text=家居', level: 1, sort: 4 },
  { id: '5', name: '美妆', icon: 'https://via.placeholder.com/100x100/FFEAA7/333333?text=美妆', level: 1, sort: 5 },
  { id: '6', name: '运动', icon: 'https://via.placeholder.com/100x100/DDA0DD/FFFFFF?text=运动', level: 1, sort: 6 },
  { id: '7', name: '母婴', icon: 'https://via.placeholder.com/100x100/98D8C8/333333?text=母婴', level: 1, sort: 7 },
  { id: '8', name: '图书', icon: 'https://via.placeholder.com/100x100/F7DC6F/333333?text=图书', level: 1, sort: 8 }
])

const hotProducts = ref<Product[]>([])
const recommendProducts = ref<Product[]>([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = ref(10)

const loadHotProducts = async () => {
  try {
    const res = await productApi.getHotProducts(8)
    if (res.code === 200) {
      hotProducts.value = res.data
    }
  } catch (error) {
    console.error('加载热门商品失败:', error)
  }
}

const loadRecommendProducts = async () => {
  if (loading.value || noMore.value) return
  
  loading.value = true
  try {
    const res = await productApi.getRecommendProducts(pageSize.value)
    if (res.code === 200) {
      if (page.value === 1) {
        recommendProducts.value = res.data
      } else {
        recommendProducts.value = [...recommendProducts.value, ...res.data]
      }
      
      if (res.data.length < pageSize.value) {
        noMore.value = true
      } else {
        page.value++
      }
    }
  } catch (error) {
    console.error('加载推荐商品失败:', error)
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  loadRecommendProducts()
}

const goToSearch = () => {
  uni.navigateTo({
    url: '/pages/store/search/search'
  })
}

const goToCategories = () => {
  uni.navigateTo({
    url: '/pages/store/category/category'
  })
}

const goToCategory = (categoryId: string) => {
  uni.navigateTo({
    url: `/pages/store/product-list/product-list?categoryId=${categoryId}`
  })
}

const goToProductDetail = (productId: string) => {
  uni.navigateTo({
    url: `/pages/store/product-detail/product-detail?id=${productId}`
  })
}

onMounted(() => {
  loadHotProducts()
  loadRecommendProducts()
})
</script>

<style scoped lang="scss">
.home-container {
  height: 100vh;
  background-color: #f5f5f5;
}

.search-bar {
  padding: 20rpx;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}

.search-input {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 30rpx;
  padding: 15rpx 30rpx;
}

.search-icon {
  font-size: 32rpx;
  margin-right: 10rpx;
}

.search-placeholder {
  color: #999;
  font-size: 28rpx;
}

.scroll-content {
  height: calc(100vh - 100rpx);
}

.banner-swiper {
  width: 100%;
  height: 300rpx;
}

.banner-image {
  width: 100%;
  height: 100%;
}

.category-section,
.hot-section,
.recommend-section {
  margin-top: 20rpx;
  background-color: #fff;
  padding: 30rpx;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.more-text {
  font-size: 24rpx;
  color: #999;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30rpx;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.category-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin-bottom: 10rpx;
}

.category-name {
  font-size: 24rpx;
  color: #666;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.product-item {
  background-color: #fff;
  border-radius: 10rpx;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 300rpx;
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

.product-price-row {
  display: flex;
  align-items: baseline;
  margin-bottom: 5rpx;
}

.product-price {
  font-size: 32rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.product-original-price {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
  margin-left: 10rpx;
}

.product-sales {
  font-size: 22rpx;
  color: #999;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.product-list-item {
  display: flex;
  background-color: #fff;
  border-radius: 10rpx;
  overflow: hidden;
}

.list-product-image {
  width: 200rpx;
  height: 200rpx;
  flex-shrink: 0;
}

.list-product-info {
  flex: 1;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.list-product-name {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.list-product-desc {
  font-size: 24rpx;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.list-product-price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-product-price {
  font-size: 32rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.list-product-sales {
  font-size: 22rpx;
  color: #999;
}

.loading-text {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 24rpx;
}
</style>