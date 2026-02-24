<template>
  <view class="product-list-container">
    <view class="search-bar">
      <view class="search-input" @click="goToSearch">
        <text class="search-icon">🔍</text>
        <text class="search-placeholder">搜索商品</text>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-content" @scrolltolower="loadMore">
      <view v-if="loading" class="loading">加载中...</view>
      <view v-else-if="products.length === 0" class="empty">
        <text class="empty-icon">📦</text>
        <text class="empty-text">没有找到相关商品</text>
      </view>
      <view v-else class="product-grid">
        <view
          v-for="product in products"
          :key="product.id"
          class="product-item"
          @click="goToProductDetail(product.id)"
        >
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
      <loading-more v-if="!loading" :loading="loadingMore" :no-more="noMore" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Product } from '@/types'
import { productApi } from '@/api/product'
import LoadingMore from '@/components/loading-more/loading-more.vue'

const categoryId = ref('')
const keyword = ref('')
const products = ref<Product[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = ref(10)

const loadProducts = async () => {
  loading.value = true
  try {
    const params = {
      page: 1,
      pageSize: pageSize.value
    }
    
    if (categoryId.value) {
      params.categoryId = categoryId.value
    }
    
    if (keyword.value) {
      params.keyword = keyword.value
    }
    
    const res = await productApi.getProducts(params)
    if (res.code === 200) {
      products.value = res.data.list
      noMore.value = res.data.list.length < pageSize.value
      page.value = 2
    }
  } catch (error) {
    console.error('加载商品失败:', error)
  } finally {
    loading.value = false
  }
}

const loadMoreProducts = async () => {
  if (loadingMore.value || noMore.value) return
  
  loadingMore.value = true
  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value
    }
    
    if (categoryId.value) {
      params.categoryId = categoryId.value
    }
    
    if (keyword.value) {
      params.keyword = keyword.value
    }
    
    const res = await productApi.getProducts(params)
    if (res.code === 200) {
      products.value = [...products.value, ...res.data.list]
      noMore.value = res.data.list.length < pageSize.value
      page.value++
    }
  } catch (error) {
    console.error('加载更多商品失败:', error)
  } finally {
    loadingMore.value = false
  }
}

const loadMore = () => {
  loadMoreProducts()
}

const goToSearch = () => {
  uni.navigateTo({
    url: '/pages/store/search/search'
  })
}

const goToProductDetail = (productId: string) => {
  uni.navigateTo({
    url: `/pages/store/product-detail/product-detail?id=${productId}`
  })
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  if (currentPage.options.categoryId) {
    categoryId.value = currentPage.options.categoryId
  }
  if (currentPage.options.keyword) {
    keyword.value = currentPage.options.keyword
  }
  loadProducts()
})
</script>

<style scoped lang="scss">
.product-list-container {
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
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
  flex: 1;
  overflow-y: auto;
  padding: 20rpx;
}

.loading {
  text-align: center;
  padding: 100rpx 0;
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
</style>