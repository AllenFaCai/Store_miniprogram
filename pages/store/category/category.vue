<template>
  <view class="category-container">
    <view class="category-layout">
      <scroll-view scroll-y class="category-sidebar">
        <view
          v-for="category in categories"
          :key="category.id"
          :class="['category-item', { active: activeCategoryId === category.id }]"
          @click="selectCategory(category.id)"
        >
          <text class="category-name">{{ category.name }}</text>
        </view>
      </scroll-view>

      <scroll-view scroll-y class="category-content">
        <view v-if="currentCategory" class="category-detail">
          <image v-if="currentCategory.icon" :src="currentCategory.icon" mode="aspectFill" class="category-banner" />
          
          <view v-if="currentCategory.children && currentCategory.children.length" class="sub-category-section">
            <view class="section-title">{{ currentCategory.name }}分类</view>
            <view class="sub-category-grid">
              <view
                v-for="subCategory in currentCategory.children"
                :key="subCategory.id"
                class="sub-category-item"
                @click="goToProductList(subCategory.id)"
              >
                <image :src="subCategory.icon" mode="aspectFill" class="sub-category-icon" />
                <text class="sub-category-name">{{ subCategory.name }}</text>
              </view>
            </view>
          </view>

          <view class="category-products">
            <view class="section-title">热门商品</view>
            <view class="product-grid">
              <view v-for="product in categoryProducts" :key="product.id" class="product-item" @click="goToProductDetail(product.id)">
                <image :src="product.images[0]" mode="aspectFill" class="product-image" />
                <text class="product-name">{{ product.name }}</text>
                <text class="product-price">¥{{ product.price }}</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Category, Product } from '@/types'
import { categoryApi, productApi } from '@/api'

const categories = ref<Category[]>([])
const activeCategoryId = ref('')
const categoryProducts = ref<Product[]>([])

const currentCategory = computed(() => {
  return categories.value.find(cat => cat.id === activeCategoryId.value)
})

const loadCategories = async () => {
  try {
    const res = await categoryApi.getCategoryList()
    if (res.code === 200) {
      categories.value = res.data
      if (categories.value.length > 0) {
        activeCategoryId.value = categories.value[0].id
        loadCategoryProducts(activeCategoryId.value)
      }
    }
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

const loadCategoryProducts = async (categoryId: string) => {
  try {
    const res = await productApi.getProducts({ categoryId, page: 1, pageSize: 10 })
    if (res.code === 200) {
      categoryProducts.value = res.data.list
    }
  } catch (error) {
    console.error('加载商品失败:', error)
  }
}

const selectCategory = (categoryId: string) => {
  activeCategoryId.value = categoryId
  loadCategoryProducts(categoryId)
}

const goToProductList = (categoryId: string) => {
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
  loadCategories()
})
</script>

<style scoped lang="scss">
.category-container {
  height: 100vh;
  background-color: #f5f5f5;
}

.category-layout {
  display: flex;
  height: 100%;
}

.category-sidebar {
  width: 200rpx;
  background-color: #f8f8f8;
  height: 100%;
}

.category-item {
  padding: 30rpx 20rpx;
  text-align: center;
  border-bottom: 1rpx solid #e0e0e0;
}

.category-item.active {
  background-color: #fff;
  border-left: 4rpx solid #ff4d4f;
}

.category-name {
  font-size: 26rpx;
  color: #333;
}

.category-item.active .category-name {
  color: #ff4d4f;
  font-weight: bold;
}

.category-content {
  flex: 1;
  height: 100%;
  padding: 20rpx;
}

.category-detail {
  padding-bottom: 40rpx;
}

.category-banner {
  width: 100%;
  height: 200rpx;
  border-radius: 10rpx;
  margin-bottom: 30rpx;
}

.sub-category-section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.sub-category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.sub-category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
}

.sub-category-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-bottom: 10rpx;
}

.sub-category-name {
  font-size: 24rpx;
  color: #666;
}

.category-products {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.product-item {
  display: flex;
  flex-direction: column;
}

.product-image {
  width: 100%;
  height: 200rpx;
  border-radius: 8rpx;
  margin-bottom: 10rpx;
}

.product-name {
  font-size: 24rpx;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 5rpx;
}

.product-price {
  font-size: 28rpx;
  color: #ff4d4f;
  font-weight: bold;
}
</style>