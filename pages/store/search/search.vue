<template>
  <view class="search-container">
    <view class="search-bar">
      <view class="search-input-wrapper">
        <text class="search-icon">🔍</text>
        <input
          v-model="keyword"
          class="search-input"
          placeholder="搜索商品"
          placeholder-class="search-placeholder"
          @confirm="handleSearch"
        />
        <text v-if="keyword" class="clear-icon" @click="clearKeyword">✕</text>
      </view>
      <text class="cancel-btn" @click="goBack">取消</text>
    </view>

    <scroll-view scroll-y class="search-content">
      <view v-if="!hasSearched" class="search-history">
        <view class="history-header">
          <text class="history-title">搜索历史</text>
          <text class="clear-history" @click="clearHistory">清空</text>
        </view>
        <view class="history-tags">
          <text
            v-for="(item, index) in searchHistory"
            :key="index"
            class="history-tag"
            @click="searchByHistory(item)"
          >
            {{ item }}
          </text>
        </view>
      </view>

      <view v-if="!hasSearched" class="hot-search">
        <view class="hot-title">热门搜索</view>
        <view class="hot-tags">
          <text
            v-for="(item, index) in hotKeywords"
            :key="index"
            :class="['hot-tag', { top: index < 3 }]"
            @click="searchByHistory(item)"
          >
            {{ item }}
          </text>
        </view>
      </view>

      <view v-if="hasSearched" class="search-results">
        <view v-if="loading" class="loading">搜索中...</view>
        <view v-else-if="products.length === 0" class="empty">
          <text class="empty-icon">🔍</text>
          <text class="empty-text">没有找到相关商品</text>
        </view>
        <view v-else class="product-list">
          <view
            v-for="product in products"
            :key="product.id"
            class="product-item"
            @click="goToProductDetail(product.id)"
          >
            <image :src="product.images[0]" mode="aspectFill" class="product-image" />
            <view class="product-info">
              <text class="product-name">{{ product.name }}</text>
              <text class="product-desc">{{ product.description }}</text>
              <view class="product-bottom">
                <text class="product-price">¥{{ product.price }}</text>
                <text class="product-sales">已售{{ product.sales }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Product } from '@/types'
import { productApi } from '@/api/product'

const keyword = ref('')
const hasSearched = ref(false)
const loading = ref(false)
const products = ref<Product[]>([])
const searchHistory = ref<string[]>([])
const hotKeywords = ref(['手机', '电脑', '耳机', '充电器', '数据线', '手机壳', '平板', '键盘'])

const loadSearchHistory = () => {
  const history = uni.getStorageSync('searchHistory')
  if (history) {
    searchHistory.value = JSON.parse(history)
  }
}

const saveSearchHistory = (keyword: string) => {
  let history = searchHistory.value.filter(item => item !== keyword)
  history.unshift(keyword)
  if (history.length > 10) {
    history = history.slice(0, 10)
  }
  searchHistory.value = history
  uni.setStorageSync('searchHistory', JSON.stringify(history))
}

const handleSearch = async () => {
  if (!keyword.value.trim()) {
    uni.showToast({
      title: '请输入搜索关键词',
      icon: 'none'
    })
    return
  }

  hasSearched.value = true
  loading.value = true
  saveSearchHistory(keyword.value.trim())

  try {
    const res = await productApi.searchProducts(keyword.value.trim(), { page: 1, pageSize: 20 })
    if (res.code === 200) {
      products.value = res.data.list
    }
  } catch (error) {
    console.error('搜索失败:', error)
  } finally {
    loading.value = false
  }
}

const searchByHistory = (item: string) => {
  keyword.value = item
  handleSearch()
}

const clearKeyword = () => {
  keyword.value = ''
}

const clearHistory = () => {
  uni.showModal({
    title: '提示',
    content: '确定要清空搜索历史吗？',
    success: (res) => {
      if (res.confirm) {
        searchHistory.value = []
        uni.removeStorageSync('searchHistory')
      }
    }
  })
}

const goToProductDetail = (productId: string) => {
  uni.navigateTo({
    url: `/pages/store/product-detail/product-detail?id=${productId}`
  })
}

const goBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  loadSearchHistory()
})
</script>

<style scoped lang="scss">
.search-container {
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #fff;
  gap: 20rpx;
}

.search-input-wrapper {
  flex: 1;
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

.search-input {
  flex: 1;
  font-size: 28rpx;
}

.search-placeholder {
  color: #999;
}

.clear-icon {
  font-size: 28rpx;
  color: #999;
  margin-left: 10rpx;
}

.cancel-btn {
  font-size: 28rpx;
  color: #666;
}

.search-content {
  flex: 1;
  overflow-y: auto;
  padding: 20rpx;
}

.search-history {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.history-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.clear-history {
  font-size: 24rpx;
  color: #999;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.history-tag {
  background-color: #f5f5f5;
  color: #666;
  font-size: 24rpx;
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
}

.hot-search {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 30rpx;
}

.hot-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.hot-tag {
  background-color: #f5f5f5;
  color: #666;
  font-size: 24rpx;
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
}

.hot-tag.top {
  background-color: #fff5f5;
  color: #ff4d4f;
}

.search-results {
  min-height: 100%;
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

.product-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.product-item {
  display: flex;
  background-color: #fff;
  border-radius: 10rpx;
  overflow: hidden;
}

.product-image {
  width: 200rpx;
  height: 200rpx;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
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
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 32rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.product-sales {
  font-size: 22rpx;
  color: #999;
}
</style>