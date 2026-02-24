import request from '@/utils/request'

export const getUserInfo = async (): Promise<any> => {
  const userId = uni.getStorageSync('userId') || '1'
  return request({
    url: `/user/${userId}`,
    method: 'GET'
  })
}

export const updateUserInfo = async (data: any): Promise<any> => {
  const userId = uni.getStorageSync('userId') || '1'
  return request({
    url: `/user/${userId}`,
    method: 'PUT',
    data
  })
}

export const getAddressList = async (): Promise<any> => {
  const userId = uni.getStorageSync('userId') || '1'
  return request({
    url: `/user/${userId}/addresses`,
    method: 'GET'
  })
}

export const addAddress = async (data: any): Promise<any> => {
  const userId = uni.getStorageSync('userId') || '1'
  return request({
    url: `/user/${userId}/addresses`,
    method: 'POST',
    data
  })
}

export const updateAddress = async (id: string, data: any): Promise<any> => {
  const userId = uni.getStorageSync('userId') || '1'
  return request({
    url: `/user/${userId}/addresses/${id}`,
    method: 'PUT',
    data
  })
}

export const deleteAddress = async (id: string): Promise<any> => {
  const userId = uni.getStorageSync('userId') || '1'
  return request({
    url: `/user/${userId}/addresses/${id}`,
    method: 'DELETE'
  })
}

export const setDefaultAddress = async (id: string): Promise<any> => {
  const userId = uni.getStorageSync('userId') || '1'
  return request({
    url: `/user/${userId}/addresses/${id}/default`,
    method: 'PUT'
  })
}

export const getUserAssets = async (): Promise<any> => {
  const userId = uni.getStorageSync('userId') || '1'
  return request({
    url: `/user/${userId}/assets`,
    method: 'GET'
  })
}

export const userApi = {
  getUserInfo,
  updateUserInfo,
  getAddressList,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getUserAssets
}