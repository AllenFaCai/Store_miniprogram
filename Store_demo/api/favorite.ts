import request from '@/utils/request'
import { Favorite } from '@/types'

// 添加收藏
export const addFavorite = async (productId: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          favoriteId: '1',
          productId
        }
      })
    }, 500)
  })
}

// 取消收藏
export const removeFavorite = async (favoriteId: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          favoriteId
        }
      })
    }, 500)
  })
}

// 获取收藏列表
export const getFavoriteList = async (params: {
  page?: number
  pageSize?: number
}): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          list: [
            {
              id: '1',
              userId: '1',
              productId: '1',
              product: {
                id: '1',
                name: 'iPhone 15 Pro',
                price: 9999,
                images: ['https://example.com/product/iphone15-1.jpg'],
                sales: 1000,
                stock: 500
              },
              createdAt: '2024-01-01'
            },
            {
              id: '2',
              userId: '1',
              productId: '2',
              product: {
                id: '2',
                name: 'AirPods Pro 2',
                price: 1899,
                images: ['https://example.com/product/airpods-1.jpg'],
                sales: 2000,
                stock: 1000
              },
              createdAt: '2024-01-02'
            }
          ],
          total: 2,
          page: params.page || 1,
          pageSize: params.pageSize || 10
        }
      })
    }, 500)
  })
}

// 检查是否已收藏
export const checkFavorite = async (productId: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          isFavorite: false
        }
      })
    }, 300)
  })
}