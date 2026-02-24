import request from '@/utils/request'
import { Comment } from '@/types'

// 获取商品评论列表
export const getCommentList = async (params: {
  productId: string
  page?: number
  pageSize?: number
  rating?: number
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
              productId: params.productId,
              orderId: '1',
              rating: 5,
              content: '商品质量很好，物流也很快，非常满意！',
              images: ['https://example.com/comment/1.jpg', 'https://example.com/comment/2.jpg'],
              anonymous: false,
              reply: '感谢您的评价，我们会继续努力！',
              replyTime: '2024-01-02 10:00:00',
              createdAt: '2024-01-01 12:00:00'
            },
            {
              id: '2',
              userId: '2',
              productId: params.productId,
              orderId: '2',
              rating: 4,
              content: '整体不错，就是包装有点简陋',
              images: [],
              anonymous: true,
              createdAt: '2024-01-03 15:00:00'
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

// 获取评论详情
export const getCommentDetail = async (id: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          id,
          userId: '1',
          productId: '1',
          orderId: '1',
          rating: 5,
          content: '商品质量很好，物流也很快，非常满意！',
          images: ['https://example.com/comment/1.jpg', 'https://example.com/comment/2.jpg'],
          anonymous: false,
          reply: '感谢您的评价，我们会继续努力！',
          replyTime: '2024-01-02 10:00:00',
          createdAt: '2024-01-01 12:00:00'
        }
      })
    }, 500)
  })
}

// 添加评论
export const addComment = async (data: {
  productId: string
  orderId: string
  rating: number
  content: string
  images?: string[]
  anonymous?: boolean
}): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          commentId: '1'
        }
      })
    }, 500)
  })
}

// 删除评论
export const deleteComment = async (id: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          commentId: id
        }
      })
    }, 500)
  })
}

// 获取评论统计
export const getCommentStats = async (productId: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          total: 100,
          rating5: 60,
          rating4: 25,
          rating3: 10,
          rating2: 3,
          rating1: 2,
          averageRating: 4.5
        }
      })
    }, 500)
  })
}