import request from '@/utils/request'
import { Address, ApiResponse } from '@/types'

export const addressApi = {
  getAddressList(): Promise<ApiResponse<Address[]>> {
    return request.get('/addresses')
  },

  getAddressDetail(id: string): Promise<ApiResponse<Address>> {
    return request.get(`/addresses/${id}`)
  },

  createAddress(data: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Address>> {
    return request.post('/addresses', data)
  },

  updateAddress(id: string, data: Partial<Address>): Promise<ApiResponse<Address>> {
    return request.put(`/addresses/${id}`, data)
  },

  deleteAddress(id: string): Promise<ApiResponse<void>> {
    return request.delete(`/addresses/${id}`)
  },

  setDefaultAddress(id: string): Promise<ApiResponse<void>> {
    return request.put(`/addresses/${id}/default`)
  }
}