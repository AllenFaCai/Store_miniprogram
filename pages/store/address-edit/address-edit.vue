<template>
  <view class="address-edit-container">
    <scroll-view scroll-y class="scroll-content">
      <view class="form-section">
        <!-- 收货人信息 -->
        <view class="form-item">
          <text class="form-label">收货人</text>
          <input
            v-model="form.receiverName"
            class="form-input"
            placeholder="请输入收货人姓名"
          />
        </view>
        <view class="form-item">
          <text class="form-label">手机号码</text>
          <input
            v-model="form.receiverPhone"
            class="form-input"
            placeholder="请输入手机号码"
            type="number"
            maxlength="11"
          />
        </view>

        <!-- 地区选择 -->
        <view class="form-item">
          <text class="form-label">所在地区</text>
          <view
            class="region-select"
            @click="showRegionSelector = true"
          >
            <text
              class="region-text"
              :class="{ 'placeholder': !form.province }"
            >
              {{ form.province }}{{ form.city }}{{ form.district }}<text v-if="!form.province">请选择</text>
            </text>
            <text class="region-arrow">▼</text>
          </view>
        </view>

        <!-- 详细地址 -->
        <view class="form-item">
          <text class="form-label">详细地址</text>
          <textarea
            v-model="form.detailAddress"
            class="form-textarea"
            placeholder="请输入详细地址信息，如道路、门牌号、小区、楼栋号、单元等"
            rows="4"
          ></textarea>
        </view>

        <!-- 设为默认 -->
        <view class="form-item default-item">
          <text class="form-label">设为默认</text>
          <switch 
  :checked="form.isDefault" 
  @change="form.isDefault = $event.detail.value" 
  class="default-switch" 
/>
        </view>
      </view>
    </scroll-view>

    <!-- 底部提交 -->
    <view class="bottom-bar">
      <button class="submit-btn" @click="submitForm">保存地址</button>
    </view>

    <!-- 地区选择器 -->
    <picker-view
      v-if="showRegionSelector"
      class="region-picker"
      :value="pickerValue"
      @change="onPickerChange"
    >
      <picker-view-column>
        <view
          v-for="province in provinces"
          :key="province"
          class="picker-item"
        >
          {{ province }}
        </view>
      </picker-view-column>
      <picker-view-column>
        <view
          v-for="city in cities"
          :key="city"
          class="picker-item"
        >
          {{ city }}
        </view>
      </picker-view-column>
      <picker-view-column>
        <view
          v-for="district in districts"
          :key="district"
          class="picker-item"
        >
          {{ district }}
        </view>
      </picker-view-column>
    </picker-view>
    <view v-if="showRegionSelector" class="picker-mask" @click="showRegionSelector = false"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Address } from '@/types'

const addressId = ref('')
const showRegionSelector = ref(false)
const pickerValue = ref([0, 0, 0])

const form = ref<Address>({
  id: '',
  userId: '',
  receiverName: '',
  receiverPhone: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  isDefault: false,
  createdAt: '',
  updatedAt: ''
})

// 模拟省市区数据
const provinces = ref(['广东省', '北京市', '上海市', '浙江省'])
const cities = ref(['深圳市', '广州市', '东莞市'])
const districts = ref(['南山区', '福田区', '宝安区'])

const loadAddressData = async () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  if (currentPage.options.id) {
    addressId.value = currentPage.options.id
    // 这里应该调用获取地址详情的API
    // 模拟数据
    form.value = {
      id: addressId.value,
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
    }
  }
}

const onPickerChange = (e: any) => {
  pickerValue.value = e.detail.value
  form.value.province = provinces.value[pickerValue.value[0]]
  form.value.city = cities.value[pickerValue.value[1]]
  form.value.district = districts.value[pickerValue.value[2]]
}

const validateForm = (): boolean => {
  if (!form.value.receiverName) {
    uni.showToast({ title: '请输入收货人姓名', icon: 'none' })
    return false
  }
  if (!form.value.receiverPhone || !/^1[3-9]\d{9}$/.test(form.value.receiverPhone)) {
    uni.showToast({ title: '请输入正确的手机号码', icon: 'none' })
    return false
  }
  if (!form.value.province || !form.value.city || !form.value.district) {
    uni.showToast({ title: '请选择所在地区', icon: 'none' })
    return false
  }
  if (!form.value.detailAddress) {
    uni.showToast({ title: '请输入详细地址', icon: 'none' })
    return false
  }
  return true
}

const submitForm = async () => {
  if (!validateForm()) return

  try {
    uni.showLoading({ title: '保存中...' })
    // 这里应该调用保存地址的API
    setTimeout(() => {
      uni.hideLoading()
      uni.showToast({ title: '保存成功', icon: 'success' })
      uni.navigateBack()
    }, 1000)
  } catch (error) {
    uni.hideLoading()
    uni.showToast({ title: '保存失败', icon: 'none' })
  }
}

onMounted(() => {
  loadAddressData()
})
</script>

<style scoped lang="scss">
.address-edit-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.scroll-content {
  padding-bottom: 120rpx;
}

.form-section {
  background-color: #fff;
  margin: 20rpx;
  border-radius: 10rpx;
  overflow: hidden;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  width: 140rpx;
  flex-shrink: 0;
}

.form-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  padding: 0 20rpx;
}

.region-select {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20rpx;
}

.region-text {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.region-text.placeholder {
  color: #999;
}

.region-arrow {
  font-size: 24rpx;
  color: #999;
}

.form-textarea {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  min-height: 200rpx;
  padding: 20rpx;
  background-color: #f9f9f9;
  border-radius: 8rpx;
  line-height: 1.5;
  resize: none;
}

.default-item {
  justify-content: space-between;
}

.default-switch {
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

.region-picker {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 500rpx;
  background-color: #fff;
  z-index: 1000;
}

.picker-item {
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 28rpx;
}

.picker-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
</style>