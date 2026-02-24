import request from '@/utils/request'
import { AfterSales } from '@/types'

// 创建售后申请
export const createAfterSales = async (data: {
  orderId: string
  type: 'refund' | 'return' | 'exchange' | 'repair'
  reason: string
  images?: string[]
  description?: string
}): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          afterSalesId: '1'
        }
      })
    }, 500)
  })
}

// 获取售后列表
export const getAfterSalesList = async (params: {
  status?: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'cancelled'
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
              orderId: '1',
              type: 'refund',
              reason: '商品有质量问题',
              images: ['https://example.com/aftersales/1.jpg', 'https://example.com/aftersales/2.jpg'],
              status: 'approved',
              refundAmount: 199,
              reply: '您的售后申请已通过，请按照指引寄回商品',
              createdAt: '2024-01-01 12:00:00',
              updatedAt: '2024-01-02 10:00:00'
            },
            {
              id: '2',
              userId: '1',
              orderId: '2',
              type: 'return',
              reason: '不想要了',
              images: [],
              status: 'pending',
              createdAt: '2024-01-03 14:00:00',
              updatedAt: '2024-01-03 14:00:00'
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

// 获取售后详情
export const getAfterSalesDetail = async (id: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          id,
          userId: '1',
          orderId: '1',
          type: 'refund',
          reason: '商品有质量问题',
          images: ['https://example.com/aftersales/1.jpg', 'https://example.com/aftersales/2.jpg'],
          status: 'approved',
          refundAmount: 199,
          reply: '您的售后申请已通过，请按照指引寄回商品',
          createdAt: '2024-01-01 12:00:00',
          updatedAt: '2024-01-02 10:00:00'
        }
      })
    }, 500)
  })
}

// 取消售后申请
export const cancelAfterSales = async (id: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          afterSalesId: id,
          status: 'cancelled'
        }
      })
    }, 500)
  })
}

// 提交退货物流信息
export const submitReturnLogistics = async (id: string, data: {
  logisticsCompany: string
  trackingNumber: string
}): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          afterSalesId: id,
          status: 'processing'
        }
      })
    }, 500)
  })
}