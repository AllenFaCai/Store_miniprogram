<template>
  <view class="admin-container">
    <view class="admin-header">
      <text class="admin-title">商品管理</text>
    </view>
    
    <view class="admin-tabs">
      <view 
        v-for="tab in tabs" 
        :key="tab.id" 
        class="tab-item" 
        :class="{ active: currentTab === tab.id }"
        @click="switchTab(tab.id)"
      >
        <text class="tab-text">{{ tab.name }}</text>
      </view>
    </view>

    <view class="admin-content">
      <view v-if="currentTab === 'list'" class="product-list">
        <view class="list-header">
          <text class="list-title">商品列表</text>
          <button class="add-btn" @click="goToAddProduct">添加商品</button>
        </view>
        
        <view v-if="loading" class="loading">加载中...</view>
        
        <view v-else-if="products.length === 0" class="empty">暂无商品</view>
        
        <view v-else class="product-items">
          <view 
            v-for="product in products" 
            :key="product.id" 
            class="product-item"
            @click="editProduct(product.id)"
          >
            <image :src="product.images[0]" mode="aspectFill" class="product-image" />
            <view class="product-info">
              <text class="product-name">{{ product.name }}</text>
              <text class="product-price">¥{{ product.price }}</text>
              <view class="product-status">
                <text :class="['status-text', product.status === 1 ? 'active' : 'inactive']">
                  {{ product.status === 1 ? '已上架' : '已下架' }}
                </text>
              </view>
            </view>
            <view class="product-actions">
              <button class="action-btn edit" @click.stop="editProduct(product.id)">编辑</button>
              <button 
                class="action-btn toggle" 
                @click.stop="toggleProductStatus(product.id, product.status)"
              >
                {{ product.status === 1 ? '下架' : '上架' }}
              </button>
              <button class="action-btn delete" @click.stop="deleteProduct(product.id)">删除</button>
            </view>
          </view>
        </view>
      </view>

      <view v-if="currentTab === 'add'" class="product-form">
        <view class="form-header">
          <text class="form-title">{{ isEdit ? '编辑商品' : '添加商品' }}</text>
          <button class="back-btn" @click="backToList">返回列表</button>
        </view>

        <scroll-view scroll-y class="form-scroll">
          <view class="form-section">
            <text class="section-title">基本信息</text>
            
            <view class="form-item">
              <text class="form-label">商品名称 *</text>
              <input 
                v-model="form.name" 
                class="form-input" 
                placeholder="请输入商品名称"
                maxlength="100"
              />
            </view>

            <view class="form-item">
              <text class="form-label">商品分类 *</text>
              <picker 
                :value="categoryIndex" 
                :range="categoryOptions" 
                range-key="name"
                @change="onCategoryChange"
              >
                <view class="form-picker">
                  <text :class="['picker-text', { placeholder: !form.categoryId }]">
                    {{ categoryText || '请选择分类' }}
                  </text>
                  <text class="picker-arrow">></text>
                </view>
              </picker>
            </view>

            <view class="form-item">
              <text class="form-label">商品价格 *</text>
              <input 
                v-model="form.price" 
                type="digit"
                class="form-input" 
                placeholder="请输入商品价格"
              />
            </view>

            <view class="form-item">
              <text class="form-label">原价</text>
              <input 
                v-model="form.originalPrice" 
                type="digit"
                class="form-input" 
                placeholder="请输入原价"
              />
            </view>

            <view class="form-item">
              <text class="form-label">库存数量 *</text>
              <input 
                v-model="form.stock" 
                type="number"
                class="form-input" 
                placeholder="请输入库存数量"
              />
            </view>

            <view class="form-item">
              <text class="form-label">商品描述</text>
              <textarea 
                v-model="form.description" 
                class="form-textarea" 
                placeholder="请输入商品描述"
                maxlength="500"
              />
            </view>
          </view>

          <view class="form-section">
            <text class="section-title">商品图片</text>
            
            <view class="image-upload">
              <view 
                v-for="(image, index) in form.images" 
                :key="index" 
                class="image-item"
              >
                <image :src="image" mode="aspectFill" class="upload-image" />
                <view class="image-delete" @click="removeImage(index)">
                  <text class="delete-icon">×</text>
                </view>
              </view>
              
              <view 
                v-if="form.images.length < 5" 
                class="image-add" 
                @click="chooseImage"
              >
                <text class="add-icon">+</text>
                <text class="add-text">添加图片</text>
              </view>
            </view>
            <text class="image-tip">最多上传5张图片</text>
          </view>

          <view class="form-section">
            <text class="section-title">商品规格</text>
            
            <view class="form-item">
              <text class="form-label">规格名称</text>
              <input 
                v-model="form.spec" 
                class="form-input" 
                placeholder="如：颜色、尺寸等"
                maxlength="50"
              />
            </view>

            <view class="form-item">
              <text class="form-label">规格值</text>
              <input 
                v-model="form.specValue" 
                class="form-input" 
                placeholder="如：红色、蓝色等，多个用逗号分隔"
                maxlength="200"
              />
            </view>
          </view>

          <view class="form-section">
            <text class="section-title">上架设置</text>
            
            <view class="form-item">
              <text class="form-label">商品状态</text>
              <view class="switch-wrapper">
                <text class="switch-label">{{ form.status === 1 ? '立即上架' : '暂不上架' }}</text>
                <switch 
                  :checked="form.status === 1" 
                  @change="form.status = $event.detail.value ? 1 : 0" 
                  class="form-switch" 
                />
              </view>
            </view>
          </view>
        </scroll-view>

        <view class="form-footer">
          <button class="submit-btn" @click="submitForm">保存商品</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { productApi } from '@/api/product'
import { categoryApi } from '@/api/category'

const tabs = [
  { id: 'list', name: '商品列表' },
  { id: 'add', name: '添加商品' }
]

const currentTab = ref('list')
const loading = ref(false)
const products = ref<any[]>([])
const isEdit = ref(false)
const editProductId = ref('')

const categoryOptions = ref<any[]>([])
const categoryIndex = ref(0)

const form = ref({
  name: '',
  categoryId: '',
  price: '',
  originalPrice: '',
  stock: '',
  description: '',
  images: [] as string[],
  spec: '',
  specValue: '',
  status: 1
})

const categoryText = computed(() => {
  const category = categoryOptions.value.find(c => c.id === form.value.categoryId)
  return category ? category.name : ''
})

const loadProducts = async () => {
  loading.value = true
  try {
    const res = await productApi.getProducts({ pageSize: 100 })
    if (res.code === 200) {
      products.value = res.data
    }
  } catch (error) {
    console.error('加载商品列表失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const res = await categoryApi.getCategoryList()
    if (res.code === 200) {
      categoryOptions.value = res.data
    }
  } catch (error) {
    console.error('加载分类列表失败:', error)
  }
}

const switchTab = (tabId: string) => {
  currentTab.value = tabId
  if (tabId === 'list') {
    loadProducts()
  } else {
    resetForm()
  }
}

const goToAddProduct = () => {
  isEdit.value = false
  editProductId.value = ''
  resetForm()
  currentTab.value = 'add'
}

const editProduct = (id: string) => {
  isEdit.value = true
  editProductId.value = id
  
  const product = products.value.find(p => p.id === id)
  if (product) {
    form.value = {
      name: product.name,
      categoryId: product.categoryId,
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      stock: product.stock.toString(),
      description: product.description || '',
      images: product.images || [],
      spec: product.spec || '',
      specValue: product.specValue || '',
      status: product.status
    }
    
    const categoryIndexValue = categoryOptions.value.findIndex(c => c.id === product.categoryId)
    if (categoryIndexValue !== -1) {
      categoryIndex.value = categoryIndexValue
    }
  }
  
  currentTab.value = 'add'
}

const backToList = () => {
  currentTab.value = 'list'
  loadProducts()
}

const resetForm = () => {
  form.value = {
    name: '',
    categoryId: '',
    price: '',
    originalPrice: '',
    stock: '',
    description: '',
    images: [],
    spec: '',
    specValue: '',
    status: 1
  }
  categoryIndex.value = 0
}

const onCategoryChange = (e: any) => {
  categoryIndex.value = e.detail.value
  form.value.categoryId = categoryOptions.value[e.detail.value].id
}

const chooseImage = () => {
  uni.chooseImage({
    count: 5 - form.value.images.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      form.value.images = [...form.value.images, ...res.tempFilePaths]
    }
  })
}

const removeImage = (index: number) => {
  form.value.images.splice(index, 1)
}

const toggleProductStatus = async (id: string, currentStatus: number) => {
  const newStatus = currentStatus === 1 ? 0 : 1
  const action = newStatus === 1 ? '上架' : '下架'
  
  uni.showModal({
    title: '确认操作',
    content: `确定要${action}该商品吗？`,
    success: async (res) => {
      if (res.confirm) {
        try {
          const res = await productApi.updateProductStatus(id, newStatus)
          if (res.code === 200) {
            uni.showToast({
              title: `${action}成功`,
              icon: 'success'
            })
            loadProducts()
          }
        } catch (error) {
          console.error(`${action}失败:`, error)
          uni.showToast({
            title: `${action}失败`,
            icon: 'none'
          })
        }
      }
    }
  })
}

const deleteProduct = (id: string) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除该商品吗？删除后无法恢复',
    success: async (res) => {
      if (res.confirm) {
        try {
          const res = await productApi.deleteProduct(id)
          if (res.code === 200) {
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            })
            loadProducts()
          }
        } catch (error) {
          console.error('删除失败:', error)
          uni.showToast({
            title: '删除失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

const submitForm = async () => {
  if (!form.value.name.trim()) {
    uni.showToast({
      title: '请输入商品名称',
      icon: 'none'
    })
    return
  }

  if (!form.value.categoryId) {
    uni.showToast({
      title: '请选择商品分类',
      icon: 'none'
    })
    return
  }

  if (!form.value.price) {
    uni.showToast({
      title: '请输入商品价格',
      icon: 'none'
    })
    return
  }

  if (!form.value.stock) {
    uni.showToast({
      title: '请输入库存数量',
      icon: 'none'
    })
    return
  }

  if (form.value.images.length === 0) {
    uni.showToast({
      title: '请上传商品图片',
      icon: 'none'
    })
    return
  }

  uni.showLoading({ title: '保存中...' })

  try {
    const data = {
      name: form.value.name,
      categoryId: form.value.categoryId,
      price: parseFloat(form.value.price),
      originalPrice: form.value.originalPrice ? parseFloat(form.value.originalPrice) : null,
      stock: parseInt(form.value.stock),
      description: form.value.description,
      images: form.value.images,
      spec: form.value.spec,
      specValue: form.value.specValue,
      status: form.value.status
    }

    let res
    if (isEdit.value) {
      res = await productApi.updateProduct(editProductId.value, data)
    } else {
      res = await productApi.createProduct(data)
    }

    if (res.code === 200) {
      uni.hideLoading()
      uni.showToast({
        title: isEdit.value ? '修改成功' : '添加成功',
        icon: 'success'
      })
      backToList()
    }
  } catch (error) {
    uni.hideLoading()
    console.error('保存失败:', error)
    uni.showToast({
      title: '保存失败',
      icon: 'none'
    })
  }
}

onMounted(() => {
  loadProducts()
  loadCategories()
})
</script>

<style scoped lang="scss">
.admin-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.admin-header {
  background-color: #fff;
  padding: 30rpx;
  border-bottom: 1px solid #eee;
}

.admin-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.admin-tabs {
  display: flex;
  background-color: #fff;
  padding: 20rpx 30rpx;
  border-bottom: 1px solid #eee;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  position: relative;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 4rpx;
  background-color: #1890ff;
  border-radius: 2rpx;
}

.tab-text {
  font-size: 28rpx;
  color: #666;
}

.tab-item.active .tab-text {
  color: #1890ff;
  font-weight: bold;
}

.admin-content {
  padding: 20rpx;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.list-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.add-btn {
  background-color: #1890ff;
  color: #fff;
  border: none;
  padding: 15rpx 30rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
}

.loading,
.empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.product-items {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.product-item {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  display: flex;
  gap: 20rpx;
}

.product-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
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
}

.product-price {
  font-size: 32rpx;
  color: #ff4d4f;
  font-weight: bold;
  margin-top: 10rpx;
}

.product-status {
  margin-top: 10rpx;
}

.status-text {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}

.status-text.active {
  background-color: #e6f7ff;
  color: #1890ff;
}

.status-text.inactive {
  background-color: #f5f5f5;
  color: #999;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.action-btn {
  padding: 10rpx 20rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
  border: none;
}

.action-btn.edit {
  background-color: #1890ff;
  color: #fff;
}

.action-btn.toggle {
  background-color: #52c41a;
  color: #fff;
}

.action-btn.delete {
  background-color: #ff4d4f;
  color: #fff;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.form-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.back-btn {
  background-color: #fff;
  color: #666;
  border: 1px solid #ddd;
  padding: 15rpx 30rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
}

.form-scroll {
  height: calc(100vh - 300rpx);
}

.form-section {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
  display: block;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 15rpx;
}

.form-input {
  width: 100%;
  padding: 20rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
  background-color: #fff;
}

.form-textarea {
  width: 100%;
  min-height: 200rpx;
  padding: 20rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
  background-color: #fff;
}

.form-picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  background-color: #fff;
}

.picker-text {
  font-size: 28rpx;
  color: #333;
}

.picker-text.placeholder {
  color: #999;
}

.picker-arrow {
  font-size: 24rpx;
  color: #999;
}

.image-upload {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.image-item {
  position: relative;
  width: 160rpx;
  height: 160rpx;
}

.upload-image {
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
}

.image-delete {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: #ff4d4f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-icon {
  color: #fff;
  font-size: 32rpx;
  line-height: 1;
}

.image-add {
  width: 160rpx;
  height: 160rpx;
  border: 2rpx dashed #ddd;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
}

.add-icon {
  font-size: 60rpx;
  color: #999;
  line-height: 1;
}

.add-text {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

.image-tip {
  font-size: 24rpx;
  color: #999;
  margin-top: 20rpx;
  display: block;
}

.switch-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  background-color: #fff;
}

.switch-label {
  font-size: 28rpx;
  color: #333;
}

.form-footer {
  padding: 30rpx;
  background-color: #fff;
  border-top: 1px solid #eee;
}

.submit-btn {
  width: 100%;
  background-color: #1890ff;
  color: #fff;
  border: none;
  padding: 30rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
  font-weight: bold;
}
</style>