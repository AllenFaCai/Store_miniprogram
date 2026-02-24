<template>
  <view class="cart-container">
    <view v-if="cartList.length > 0" class="cart-content">
      <scroll-view scroll-y class="scroll-content">
        <view class="cart-item" v-for="item in cartList" :key="item.id">
          <view class="item-left">
            <checkbox
              :checked="item.selected"
              @click="toggleSelect(item.id)"
              color="#ff4d4f"
            />
            <image :src="item.product.images[0]" mode="aspectFill" class="item-image" />
          </view>
          <view class="item-right">
            <view class="item-name">{{ item.product.name }}</view>
            <view v-if="item.spec" class="item-spec">{{ item.spec }}</view>
            <view class="item-bottom">
              <view class="item-price">¥{{ item.product.price }}</view>
              <view class="item-quantity">
                <button class="quantity-btn" @click="updateQuantity(item.id, item.quantity - 1)" :disabled="item.quantity <= 1">-</button>
                <text class="quantity-value">{{ item.quantity }}</text>
                <button class="quantity-btn" @click="updateQuantity(item.id, item.quantity + 1)" :disabled="item.quantity >= item.product.stock">+</button>
              </view>
            </view>
          </view>
          <view class="item-delete" @click="deleteItem(item.id)">
            <text class="delete-icon">🗑️</text>
          </view>
        </view>
      </scroll-view>

      <view class="cart-footer">
        <view class="footer-left">
          <checkbox
            :checked="allSelected"
            @click="toggleSelectAll"
            color="#ff4d4f"
          />
          <text class="select-all-text">全选</text>
        </view>
        <view class="footer-right">
          <view class="total-info">
            <text class="total-label">合计:</text>
            <text class="total-price">¥{{ totalPrice }}</text>
          </view>
          <button class="checkout-btn" :disabled="selectedCount === 0" @click="checkout">结算({{ selectedCount }})</button>
        </view>
      </view>
    </view>

    <view v-else class="empty-cart">
      <text class="empty-icon">🛒</text>
      <text class="empty-text">购物车是空的</text>
      <button class="go-shopping-btn" @click="goShopping">去逛逛</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { cartApi } from '@/api/cart'
import { CartItem } from '@/types'

const cartList = ref<CartItem[]>([])

const allSelected = computed(() => {
  return cartList.value.length > 0 && cartList.value.every(item => item.selected)
})

const selectedCount = computed(() => {
  return cartList.value.filter(item => item.selected).length
})

const totalPrice = computed(() => {
  return cartList.value
    .filter(item => item.selected)
    .reduce((total, item) => total + item.product.price * item.quantity, 0)
    .toFixed(2)
})

const loadCartList = async () => {
  try {
    const res = await cartApi.getCartList()
    if (res.code === 200) {
      cartList.value = res.data
    }
  } catch (error) {
    console.error('加载购物车失败:', error)
  }
}

const toggleSelect = async (id: string) => {
  const item = cartList.value.find(item => item.id === id)
  if (item) {
    try {
      const res = await cartApi.toggleSelectCartItem(id, !item.selected)
      if (res.code === 200) {
        item.selected = !item.selected
      }
    } catch (error) {
      console.error('切换选中状态失败:', error)
    }
  }
}

const toggleSelectAll = async () => {
  const newSelected = !allSelected.value
  try {
    const res = await cartApi.selectAllCartItems(newSelected)
    if (res.code === 200) {
      cartList.value.forEach(item => {
        item.selected = newSelected
      })
    }
  } catch (error) {
    console.error('全选失败:', error)
  }
}

const updateQuantity = async (id: string, quantity: number) => {
  if (quantity < 1) return
  
  const item = cartList.value.find(item => item.id === id)
  if (item && quantity <= item.product.stock) {
    try {
      const res = await cartApi.updateCartItem(id, quantity)
      if (res.code === 200) {
        item.quantity = quantity
      }
    } catch (error) {
      console.error('更新数量失败:', error)
    }
  }
}

const deleteItem = async (id: string) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除这个商品吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          const res = await cartApi.deleteCartItem(id)
          if (res.code === 200) {
            cartList.value = cartList.value.filter(item => item.id !== id)
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            })
          }
        } catch (error) {
          console.error('删除失败:', error)
        }
      }
    }
  })
}

const checkout = () => {
  const selectedItems = cartList.value.filter(item => item.selected)
  if (selectedItems.length === 0) {
    uni.showToast({
      title: '请选择商品',
      icon: 'none'
    })
    return
  }

  const orderData = {
    items: selectedItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      spec: item.spec
    })),
    addressId: ''
  }

  uni.navigateTo({
    url: `/pages/store/order-confirm/order-confirm?data=${encodeURIComponent(JSON.stringify(orderData))}`
  })
}

const goShopping = () => {
  uni.switchTab({
    url: '/pages/store/home/home'
  })
}

onMounted(() => {
  loadCartList()
})
</script>

<style scoped lang="scss">
.cart-container {
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.cart-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.scroll-content {
  flex: 1;
  overflow-y: auto;
  padding: 20rpx;
}

.cart-item {
  display: flex;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  position: relative;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex-shrink: 0;
}

.item-image {
  width: 180rpx;
  height: 180rpx;
  border-radius: 8rpx;
}

.item-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-left: 20rpx;
}

.item-name {
  font-size: 28rpx;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.5;
}

.item-spec {
  font-size: 24rpx;
  color: #999;
  margin: 10rpx 0;
}

.item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-price {
  font-size: 32rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 15rpx;
}

.quantity-btn {
  width: 50rpx;
  height: 50rpx;
  line-height: 50rpx;
  text-align: center;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  background-color: #fff;
  font-size: 28rpx;
  color: #333;
  padding: 0;
}

.quantity-btn[disabled] {
  opacity: 0.5;
}

.quantity-value {
  font-size: 28rpx;
  color: #333;
  min-width: 50rpx;
  text-align: center;
}

.item-delete {
  position: absolute;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
}

.delete-icon {
  font-size: 36rpx;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-top: 1rpx solid #e0e0e0;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 15rpx;
}

.select-all-text {
  font-size: 28rpx;
  color: #666;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 30rpx;
}

.total-info {
  display: flex;
  align-items: baseline;
  gap: 10rpx;
}

.total-label {
  font-size: 28rpx;
  color: #666;
}

.total-price {
  font-size: 36rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.checkout-btn {
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  color: #fff;
  border: none;
  border-radius: 30rpx;
  padding: 15rpx 40rpx;
  font-size: 28rpx;
}

.checkout-btn[disabled] {
  opacity: 0.5;
}

.empty-cart {
  flex: 1;
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

.go-shopping-btn {
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  color: #fff;
  border: none;
  border-radius: 30rpx;
  padding: 20rpx 60rpx;
  font-size: 28rpx;
}
</style>