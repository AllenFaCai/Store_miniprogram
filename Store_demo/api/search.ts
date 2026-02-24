import request from '@/utils/request'
import { SearchSuggestion, SearchHistory } from '@/types'

// 搜索商品
export const searchProducts = async (params: {
  keyword: string
  page?: number
  pageSize?: number
  sort?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
}): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          keyword: params.keyword,
          list: [
            {
              id: '1',
              name: 'iPhone 15 Pro',
              description: '苹果最新旗舰手机，搭载 A17 Pro 芯片',
              price: 9999,
              originalPrice: 10999,
              images: ['https://example.com/product/iphone15-1.jpg'],
              categoryId: '1',
              sales: 1000,
              stock: 500,
              isHot: true,
              isNew: true,
              createdAt: '2024-01-01',
              updatedAt: '2024-01-01'
            },
            {
              id: '2',
              name: 'AirPods Pro 2',
              description: '主动降噪耳机，支持空间音频',
              price: 1899,
              originalPrice: 1999,
              images: ['https://example.com/product/airpods-1.jpg'],
              categoryId: '1',
              sales: 2000,
              stock: 1000,
              isHot: true,
              isNew: false,
              createdAt: '2024-01-01',
              updatedAt: '2024-01-01'
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

// 获取搜索建议
export const getSearchSuggestions = async (keyword: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: [
          {
            keyword: 'iPhone 15',
            count: 1000
          },
          {
            keyword: 'iPhone 15 Pro',
            count: 500
          },
          {
            keyword: 'iPhone 15 Pro Max',
            count: 300
          }
        ]
      })
    }, 300)
  })
}

// 获取热门搜索
export const getHotSearch = async (): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: [
          'iPhone 15',
          'AirPods Pro',
          'MacBook Air',
          'iPad Pro',
          'Apple Watch'
        ]
      })
    }, 300)
  })
}

// 获取搜索历史
export const getSearchHistory = async (): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: [
          {
            id: '1',
            userId: '1',
            keyword: 'iPhone 15',
            createdAt: '2024-01-01 10:00:00'
          },
          {
            id: '2',
            userId: '1',
            keyword: 'AirPods Pro',
            createdAt: '2024-01-02 12:00:00'
          },
          {
            id: '3',
            userId: '1',
            keyword: 'MacBook Air',
            createdAt: '2024-01-03 14:00:00'
          }
        ]
      })
    }, 300)
  })
}

// 添加搜索历史
export const addSearchHistory = async (keyword: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          historyId: '1',
          keyword
        }
      })
    }, 300)
  })
}

// 清空搜索历史
export const clearSearchHistory = async (): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          success: true
        }
      })
    }, 300)
  })
}

// 删除搜索历史
export const deleteSearchHistory = async (id: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          historyId: id
        }
      })
    }, 300)
  })
}