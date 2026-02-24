import request from '@/utils/request'

export const createOrder = async (data: {
  addressId: string
  items: Array<{
    productId: string
    quantity: number
    spec?: string
  }>
  couponId?: string
  remark?: string
}): Promise<any> => {
  const userId = uni.getStorageSync('userId') || '1'
  return request({
    url: '/orders',
    method: 'POST',
    data: { userId, ...data }
  })
}

export const getOrderList = async (params: {
  status?: string
  page?: number
  pageSize?: number
}): Promise<any> => {
  const userId = uni.getStorageSync('userId') || '1'
  return request({
    url: '/orders',
    method: 'GET',
    params: { userId, ...params }
  })
}

export const getOrderDetail = async (id: string): Promise<any> => {
  const userId = uni.getStorageSync('userId') || '1'
  return request({
    url: `/orders/${id}`,
    method: 'GET',
    params: { userId }
  })
}

export const cancelOrder = async (id: string): Promise<any> => {
  const userId = uni.getStorageSync('userId') || '1'
  return request({
    url: `/orders/${id}/cancel`,
    method: 'PUT',
    data: { userId }
  })
}

export const payOrder = async (id: string, paymentMethod: string): Promise<any> => {
  const userId = uni.getStorageSync('userId') || '1'
  return request({
    url: `/orders/${id}/pay`,
    method: 'PUT',
    data: { userId, paymentMethod }
  })
}

export const confirmReceipt = async (id: string): Promise<any> => {
  const userId = uni.getStorageSync('userId') || '1'
  return request({
    url: `/orders/${id}/confirm`,
    method: 'PUT',
    data: { userId }
  })
}

export const commentOrder = async (id: string, data: {
  rating: number
  content: string
  images?: string[]
  anonymous?: boolean
}): Promise<any> => {
  const userId = uni.getStorageSync('userId') || '1'
  return request({
    url: `/orders/${id}/comment`,
    method: 'POST',
    data: { userId, ...data }
  })
}

export const orderApi = {
  createOrder,
  getOrderList,
  getOrderDetail,
  cancelOrder,
  payOrder,
  confirmReceipt,
  commentOrder
}