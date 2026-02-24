import request from '@/utils/request'
import { Category } from '@/types'

export const getCategoryList = async (): Promise<any> => {
  return request({
    url: '/categories',
    method: 'GET'
  })
}

export const getCategoryDetail = async (id: string): Promise<any> => {
  return request({
    url: `/categories/${id}`,
    method: 'GET'
  })
}

export const categoryApi = {
  getCategoryList,
  getCategoryDetail
}