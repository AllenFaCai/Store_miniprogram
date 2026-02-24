<template>
  <view class="address-list-container">
    <scroll-view scroll-y class="scroll-content">
      <view v-if="addresses.length === 0" class="empty">
        <text class="empty-icon">📍</text>
        <text class="empty-text">暂无收货地址</text>
        <button class="empty-btn" @click="addAddress">添加地址</button>
      </view>
      <view v-else class="address-list">
        <view
          v-for="address in addresses"
          :key="address.id"
          class="address-item"
          @click="selectAddress(address)"
        >
          <view class="address-header">
            <text class="receiver-name">{{ address.receiverName }}</text>
            <text class="receiver-phone">{{ address.receiverPhone }}</text>
            <view v-if="address.isDefault" class="default-tag">默认</view>
          </view>
          <view class="address-content">
            <text class="address-text">{{ address.province }}{{ address.city }}{{ address.district }}{{ address.detailAddress }}</text>
          </view>
          <view class="address-footer">
            <button class="action-btn" @click.stop="editAddress(address)">
              <text class="action-icon">✏️</text>
              <text class="action-text">编辑</text>
            </button>
            <button class="action-btn" @click.stop="deleteAddress(address.id)">
              <text class="action-icon">🗑️</text>
              <text class="action-text">删除</text>
            </button>
            <button
              v-if="!address.isDefault"
              class="action-btn"
              @click.stop="setDefault(address.id)"
            >
              <text class="action-icon">⭐</text>
              <text class="action-text">设为默认</text>
            </button>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部添加按钮 -->
    <view class="bottom-bar">
      <button class="add-btn" @click="addAddress">
        <text class="add-icon">+</text>
        <text class="add-text">添加新地址</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Address } from '@/types'

const addresses = ref<Address[]>([])
const isSelectMode = ref(false)

const loadAddresses = async () => {
  // 这里应该调用获取地址列表的API
  // 模拟数据
  addresses.value = [
    {
      id: '1',
      userId: 'user1',
      receiverName: '张三',
      receiverPhone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detailAddress: '科技园南区T3栋801',
      isDefault: true,
      createdAt: '2024-01-01 10:00:00',
      updatedAt: '2024-01-01 10:00:00'
    },
    {
      id: '2',
      userId: 'user1',
      receiverName: '李四',
      receiverPhone: '13900139000',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detailAddress: '望京SOHO T1 C座2001',
      isDefault: false,
      createdAt: '2024-01-02 10:00:00',
      updatedAt: '2024-01-02 10:00:00'
    }
  ]

  // 检查是否是选择模式（从订单确认页进入）
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  isSelectMode.value = currentPage.options.selectMode === 'true'
}

const selectAddress = (address: Address) => {
  if (isSelectMode.value) {
    // 返回选择的地址
    uni.setStorageSync('selectedAddress', address)
    uni.navigateBack()
  }
}

const addAddress = () => {
  uni.navigateTo({
    url: '/pages/store/address-edit/address-edit'
  })
}

const editAddress = (address: Address) => {
  uni.navigateTo({
    url: `/pages/store/address-edit/address-edit?id=${address.id}`
  })
}

const deleteAddress = (addressId: string) => {
  uni.showModal({
    title: '删除地址',
    content: '确定要删除这个地址吗？',
    success: async (res) => {
      if (res.confirm) {
        // 调用删除地址API
        const index = addresses.value.findIndex(item => item.id === addressId)
        if (index > -1) {
          addresses.value.splice(index, 1)
          uni.showToast({
            title: '地址已删除',
            icon: 'success'
          })
        }
      }
    }
  })
}

const setDefault = (addressId: string) => {
  // 调用设置默认地址API
  addresses.value.forEach(item => {
    item.isDefault = item.id === addressId
  })
  uni.showToast({
    title: '已设为默认地址',
    icon: 'success'
  })
}

onMounted(() => {
  loadAddresses()
})
</script>

<style scoped lang="scss">
.address-list-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.scroll-content {
  padding-bottom: 120rpx;
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

.address-list {
  padding: 20rpx;
}

.address-item {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.address-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.receiver-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-right: 30rpx;
}

.receiver-phone {
  font-size: 26rpx;
  color: #666;
  flex: 1;
}

.default-tag {
  background-color: #ff4d4f;
  color: #fff;
  font-size: 20rpx;
  padding: 5rpx 15rpx;
  border-radius: 15rpx;
}

.address-content {
  margin-bottom: 20rpx;
}

.address-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.address-footer {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 5rpx;
  background-color: transparent;
  border: 1rpx solid #e0e0e0;
  border-radius: 20rpx;
  padding: 10rpx 20rpx;
  font-size: 24rpx;
  color: #666;
}

.action-icon {
  font-size: 24rpx;
}

.action-text {
  font-size: 24rpx;
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

.add-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  color: #fff;
  border: none;
  border-radius: 30rpx;
  padding: 25rpx 0;
  font-size: 32rpx;
  font-weight: bold;
}

.add-icon {
  font-size: 36rpx;
}

.add-text {
  font-size: 32rpx;
}
</style>