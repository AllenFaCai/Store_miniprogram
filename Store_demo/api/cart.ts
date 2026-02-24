import request from '@/utils/request'

export const getCartList = async (): Promise<any> => {
  const userId = uni.getStorageSync('userId') || '1'
  return request({
    url: '/cart',
    method: 'GET',
    params: { userId }
  })
}

export const addToCart = async (data: {
  productId: string
  quantity: number
  spec?: string
}): Promise<any> => {
  const userId = uni.getStorageSync('userId') || '1'
  return request({
    url: '/cart',
    method: 'POST',
    data: { userId, ...data }
  })
}

export const updateCartQuantity = async (id: string, quantity: number): Promise<any> => {
  return request({
    url: `/cart/${id}/quantity`,
    method: 'PUT',
    data: { quantity }
  })
}

export const updateCartChecked = async (id: string, checked: boolean): Promise<any> => {
  return request({
    url: `/cart/${id}/checked`,
    method: 'PUT',
    data: { checked }
  })
}

export const updateCartCheckedAll = async (checked: boolean): Promise<any> => {
  const userId = uni.getStorageSync('userId') || '1'
  return request({
    url: '/cart/checked-all',
    method: 'PUT',
    data: { userId, checked }
  })
}

export const deleteCartItem = async (id: string): Promise<any> => {
  return request({
    url: `/cart/${id}`,
    method: 'DELETE'
  })
}

export const clearCart = async (): Promise<any> => {
  const userId = uni.getStorageSync('userId') || '1'
  return request({
    url: '/cart',
    method: 'DELETE',
    params: { userId }
  })
}

export const getCartCount = async (): Promise<any> => {
  const userId = uni.getStorageSync('userId') || '1'
  return request({
    url: '/cart/count',
    method: 'GET',
    params: { userId }
  })
}

export const cartApi = {
  getCartList,
  addToCart,
  updateCartQuantity,
  updateCartChecked,
  updateCartCheckedAll,
  deleteCartItem,
  clearCart,
  getCartCount
}