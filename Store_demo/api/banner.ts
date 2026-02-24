import request from '@/utils/request'
import { Banner } from '@/types'

// 获取轮播图列表
export const getBannerList = async (params?: {
  position?: 'home' | 'category' | 'product'
}): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: [
          {
            id: '1',
            title: '新品上市',
            image: 'https://example.com/banner/1.jpg',
            link: '/pages/store/product-detail/product-detail?id=1',
            linkType: 'product',
            sort: 1,
            status: 'active',
            createdAt: '2024-01-01'
          },
          {
            id: '2',
            title: '限时优惠',
            image: 'https://example.com/banner/2.jpg',
            link: '/pages/store/product-list/product-list?keyword=优惠',
            linkType: 'url',
            sort: 2,
            status: 'active',
            createdAt: '2024-01-01'
          },
          {
            id: '3',
            title: '会员专享',
            image: 'https://example.com/banner/3.jpg',
            link: '/pages/store/category/category?id=1',
            linkType: 'category',
            sort: 3,
            status: 'active',
            createdAt: '2024-01-01'
          }
        ]
      })
    }, 500)
  })
}