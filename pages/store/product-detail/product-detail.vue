<template>
  <view class="product-detail-container">
    <scroll-view scroll-y class="scroll-content">
      <swiper class="product-swiper" indicator-dots circular>
        <swiper-item v-for="(image, index) in product.images" :key="index">
          <image :src="image" mode="aspectFill" class="product-image" @click="previewImage(index)" />
        </swiper-item>
      </swiper>

      <view class="product-info">
        <view class="price-row">
          <text class="price">¥{{ product.price }}</text>
          <text v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</text>
          <view class="discount-tag" v-if="product.originalPrice">
            {{ Math.round((1 - product.price / product.originalPrice) * 100) }}%OFF
          </view>
        </view>

        <view class="product-title">{{ product.name }}</view>
        <view class="product-tags" v-if="product.tags && product.tags.length">
          <text v-for="tag in product.tags" :key="tag" class="tag">{{ tag }}</text>
        </view>

        <view class="product-stats">
          <text class="stat-item">销量 {{ product.sales }}</text>
          <text class="stat-item">库存 {{ product.stock }}</text>
          <text class="stat-item">评分 {{ product.rating }}</text>
        </view>
      </view>

      <view class="section">
        <view class="section-title">商品规格</view>
        <view class="spec-list" v-if="product.specs && product.specs.length">
          <view v-for="spec in product.specs" :key="spec.id" class="spec-item">
            <text class="spec-name">{{ spec.name }}</text>
            <view class="spec-options">
              <view
                v-for="option in spec.options"
                :key="option.id"
                :class="['spec-option', { active: selectedSpecs[spec.id] === option.id }]"
                @click="selectSpec(spec.id, option.id)"
              >
                {{ option.name }}
              </view>
            </view>
          </view>
        </view>
        <view v-else class="no-spec">暂无规格</view>
      </view>

      <view class="section">
        <view class="section-title">商品详情</view>
        <view class="product-description">{{ product.description }}</view>
      </view>
    </scroll-view>

    <view class="bottom-bar">
      <view class="bar-left">
        <view class="bar-item" @click="goToCart">
          <text class="bar-icon">🛒</text>
          <text class="bar-text">购物车</text>
          <view v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</view>
        </view>
        <view class="bar-item" @click="toggleFavorite">
          <text class="bar-icon">{{ isFavorite ? '❤️' : '🤍' }}</text>
          <text class="bar-text">收藏</text>
        </view>
      </view>
      <view class="bar-right">
        <button class="btn-add-cart" @click="addToCart">加入购物车</button>
        <button class="btn-buy-now" @click="buyNow">立即购买</button>
      </view>
    </view>

    <view class="spec-popup" v-if="showSpecPopup" @click="closeSpecPopup">
      <view class="popup-content" @click.stop>
        <view class="popup-header">
          <image :src="product.images[0]" mode="aspectFill" class="popup-image" />
          <view class="popup-price">¥{{ currentPrice }}</view>
          <view class="popup-stock">库存: {{ currentStock }}</view>
        </view>
        <view class="popup-body">
          <view v-for="spec in product.specs" :key="spec.id" class="popup-spec-item">
            <text class="popup-spec-name">{{ spec.name }}</text>
            <view class="popup-spec-options">
              <view
                v-for="option in spec.options"
                :key="option.id"
                :class="['popup-spec-option', { active: selectedSpecs[spec.id] === option.id }]"
                @click="selectSpec(spec.id, option.id)"
              >
                {{ option.name }}
              </view>
            </view>
          </view>
          <view class="quantity-selector">
            <text class="quantity-label">购买数量</text>
            <view class="quantity-controls">
              <button class="quantity-btn" @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
              <text class="quantity-value">{{ quantity }}</text>
              <button class="quantity-btn" @click="increaseQuantity" :disabled="quantity >= currentStock">+</button>
            </view>
          </view>
        </view>
        <view class="popup-footer">
          <button class="popup-btn popup-btn-confirm" @click="confirmAddToCart">确认</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { productApi, cartApi } from '@/api'
import { Product } from '@/types'

const productId = ref('')
const product = ref<Product>({} as Product)
const selectedSpecs = ref<Record<string, string>>({})
const quantity = ref(1)
const isFavorite = ref(false)
const cartCount = ref(0)
const showSpecPopup = ref(false)

const currentPrice = computed(() => {
  let price = product.value.price
  if (product.value.specs) {
    for (const spec of product.value.specs) {
      const selectedOption = spec.options.find(opt => selectedSpecs.value[spec.id] === opt.id)
      if (selectedOption && selectedOption.price) {
        price = selectedOption.price
      }
    }
  }
  return price
})

const currentStock = computed(() => {
  let stock = product.value.stock
  if (product.value.specs) {
    for (const spec of product.value.specs) {
      const selectedOption = spec.options.find(opt => selectedSpecs.value[spec.id] === opt.id)
      if (selectedOption && selectedOption.stock !== undefined) {
        stock = selectedOption.stock
      }
    }
  }
  return stock
})

const loadProductDetail = async () => {
  try {
    const res = await productApi.getProductDetail(productId.value)
    if (res.code === 200) {
      product.value = res.data
      if (product.value.specs) {
        product.value.specs.forEach(spec => {
          if (spec.options.length > 0) {
            selectedSpecs.value[spec.id] = spec.options[0].id
          }
        })
      }
    }
  } catch (error) {
    console.error('加载商品详情失败:', error)
  }
}

const previewImage = (index: number) => {
  uni.previewImage({
    urls: product.value.images,
    current: index
  })
}

const selectSpec = (specId: string, optionId: string) => {
  selectedSpecs.value[specId] = optionId
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const increaseQuantity = () => {
  if (quantity.value < currentStock.value) {
    quantity.value++
  }
}

const addToCart = async () => {
  if (product.value.specs && product.value.specs.length > 0) {
    showSpecPopup.value = true
  } else {
    try {
      const res = await cartApi.addToCart(productId.value, quantity.value)
      if (res.code === 200) {
        uni.showToast({
          title: '添加成功',
          icon: 'success'
        })
        cartCount.value += quantity.value
      }
    } catch (error) {
      console.error('添加购物车失败:', error)
    }
  }
}

const confirmAddToCart = async () => {
  try {
    const specValue = JSON.stringify(selectedSpecs.value)
    const res = await cartApi.addToCart(productId.value, quantity.value, specValue)
    if (res.code === 200) {
      uni.showToast({
        title: '添加成功',
        icon: 'success'
      })
      cartCount.value += quantity.value
      showSpecPopup.value = false
    }
  } catch (error) {
    console.error('添加购物车失败:', error)
  }
}

const closeSpecPopup = () => {
  showSpecPopup.value = false
}

const buyNow = () => {
  if (product.value.specs && product.value.specs.length > 0) {
    showSpecPopup.value = true
  } else {
    const orderData = {
      items: [{ productId: productId.value, quantity: quantity.value }],
      addressId: ''
    }
    uni.navigateTo({
      url: `/pages/store/order-confirm/order-confirm?data=${encodeURIComponent(JSON.stringify(orderData))}`
    })
  }
}

const goToCart = () => {
  uni.switchTab({
    url: '/pages/store/cart/cart'
  })
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  uni.showToast({
    title: isFavorite.value ? '已收藏' : '已取消收藏',
    icon: 'success'
  })
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  productId.value = currentPage.options.id
  loadProductDetail()
})
</script>

<style scoped lang="scss">
.product-detail-container {
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.scroll-content {
  flex: 1;
  overflow-y: auto;
}

.product-swiper {
  width: 100%;
  height: 750rpx;
  background-color: #fff;
}

.product-image {
  width: 100%;
  height: 100%;
}

.product-info {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.price-row {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.price {
  font-size: 48rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.original-price {
  font-size: 28rpx;
  color: #999;
  text-decoration: line-through;
  margin-left: 20rpx;
}

.discount-tag {
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  color: #fff;
  font-size: 20rpx;
  padding: 5rpx 15rpx;
  border-radius: 20rpx;
  margin-left: 20rpx;
}

.product-title {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 20rpx;
  line-height: 1.5;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-bottom: 20rpx;
}

.tag {
  background-color: #f0f0f0;
  color: #666;
  font-size: 22rpx;
  padding: 5rpx 15rpx;
  border-radius: 4rpx;
}

.product-stats {
  display: flex;
  gap: 30rpx;
}

.stat-item {
  font-size: 24rpx;
  color: #999;
}

.section {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.spec-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.spec-item {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.spec-name {
  font-size: 28rpx;
  color: #666;
}

.spec-options {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.spec-option {
  padding: 10rpx 30rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #333;
  background-color: #fff;
}

.spec-option.active {
  border-color: #ff4d4f;
  color: #ff4d4f;
  background-color: #fff5f5;
}

.no-spec {
  font-size: 26rpx;
  color: #999;
}

.product-description {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
}

.bottom-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-top: 1rpx solid #e0e0e0;
}

.bar-left {
  display: flex;
  gap: 40rpx;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.bar-icon {
  font-size: 40rpx;
  margin-bottom: 5rpx;
}

.bar-text {
  font-size: 22rpx;
  color: #666;
}

.cart-badge {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  background-color: #ff4d4f;
  color: #fff;
  font-size: 18rpx;
  padding: 2rpx 10rpx;
  border-radius: 10rpx;
  min-width: 30rpx;
  text-align: center;
}

.bar-right {
  display: flex;
  gap: 20rpx;
}

.btn-add-cart,
.btn-buy-now {
  flex: 1;
  height: 70rpx;
  line-height: 70rpx;
  border-radius: 35rpx;
  font-size: 28rpx;
  border: none;
  padding: 0 30rpx;
}

.btn-add-cart {
  background: linear-gradient(135deg, #ffa502, #ff7f00);
  color: #fff;
}

.btn-buy-now {
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  color: #fff;
}

.spec-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.popup-content {
  width: 100%;
  background-color: #fff;
  border-radius: 30rpx 30rpx 0 0;
  padding: 30rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.popup-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding-bottom: 30rpx;
  border-bottom: 1rpx solid #e0e0e0;
}

.popup-image {
  width: 150rpx;
  height: 150rpx;
  border-radius: 10rpx;
}

.popup-price {
  font-size: 40rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.popup-stock {
  font-size: 24rpx;
  color: #999;
}

.popup-body {
  padding: 30rpx 0;
}

.popup-spec-item {
  margin-bottom: 30rpx;
}

.popup-spec-name {
  font-size: 28rpx;
  color: #666;
  display: block;
  margin-bottom: 15rpx;
}

.popup-spec-options {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.popup-spec-option {
  padding: 10rpx 30rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #333;
  background-color: #fff;
}

.popup-spec-option.active {
  border-color: #ff4d4f;
  color: #ff4d4f;
  background-color: #fff5f5;
}

.quantity-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30rpx;
}

.quantity-label {
  font-size: 28rpx;
  color: #666;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.quantity-btn {
  width: 60rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  background-color: #fff;
  font-size: 32rpx;
  color: #333;
  padding: 0;
}

.quantity-btn[disabled] {
  opacity: 0.5;
}

.quantity-value {
  font-size: 28rpx;
  color: #333;
  min-width: 60rpx;
  text-align: center;
}

.popup-footer {
  display: flex;
  gap: 20rpx;
  padding-top: 30rpx;
  border-top: 1rpx solid #e0e0e0;
}

.popup-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  font-size: 30rpx;
  border: none;
}

.popup-btn-confirm {
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  color: #fff;
}
</style>