import request from '@/utils/request'
import { UserCoupon } from '@/types'

// 获取用户优惠券列表
export const getUserCoupons = async (params: {
  status?: 'unused' | 'used' | 'expired'
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
              couponId: '1',
              coupon: {
                id: '1',
                name: '新人专享券',
                type: 'reduction',
                value: 50,
                minAmount: 200,
                startTime: '2024-01-01',
                endTime: '2024-12-31',
                total: 1000,
                used: 200,
                status: 'active'
              },
              status: 'unused',
              expireAt: '2024-12-31'
            },
            {
              id: '2',
              userId: '1',
              couponId: '2',
              coupon: {
                id: '2',
                name: '全场通用券',
                type: 'reduction',
                value: 20,
                minAmount: 100,
                startTime: '2024-01-01',
                endTime: '2024-06-30',
                total: 500,
                used: 100,
                status: 'active'
              },
              status: 'unused',
              expireAt: '2024-06-30'
            },
            {
              id: '3',
              userId: '1',
              couponId: '3',
              coupon: {
                id: '3',
                name: '限时折扣券',
                type: 'reduction',
                value: 30,
                minAmount: 150,
                startTime: '2024-01-01',
                endTime: '2024-01-31',
                total: 200,
                used: 50,
                status: 'active'
              },
              status: 'expired',
              expireAt: '2024-01-31'
            },
            {
              id: '4',
              userId: '1',
              couponId: '4',
              coupon: {
                id: '4',
                name: '会员专享券',
                type: 'reduction',
                value: 100,
                minAmount: 500,
                startTime: '2024-01-01',
                endTime: '2024-12-31',
                total: 100,
                used: 10,
                status: 'active'
              },
              status: 'used',
              orderId: '1',
              usedAt: '2024-01-05 12:00:00',
              expireAt: '2024-12-31'
            }
          ],
          total: 4,
          page: params.page || 1,
          pageSize: params.pageSize || 10
        }
      })
    }, 500)
  })
}

// 获取可用优惠券
export const getAvailableCoupons = async (params: {
  amount?: number
  categoryIds?: string[]
}): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: [
          {
            id: '1',
            name: '新人专享券',
            type: 'reduction',
            value: 50,
            minAmount: 200,
            startTime: '2024-01-01',
            endTime: '2024-12-31',
            total: 1000,
            used: 200,
            status: 'active'
          },
          {
            id: '2',
            name: '全场通用券',
            type: 'reduction',
            value: 20,
            minAmount: 100,
            startTime: '2024-01-01',
            endTime: '2024-06-30',
            total: 500,
            used: 100,
            status: 'active'
          }
        ]
      })
    }, 500)
  })
}

// 领取优惠券
export const receiveCoupon = async (couponId: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          userCouponId: '1'
        }
      })
    }, 500)
  })
}

// 获取优惠券中心列表
export const getCouponCenter = async (params: {
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
              name: '新人专享券',
              type: 'reduction',
              value: 50,
              minAmount: 200,
              startTime: '2024-01-01',
              endTime: '2024-12-31',
              total: 1000,
              used: 200,
              status: 'active'
            },
            {
              id: '2',
              name: '全场通用券',
              type: 'reduction',
              value: 20,
              minAmount: 100,
              startTime: '2024-01-01',
              endTime: '2024-06-30',
              total: 500,
              used: 100,
              status: 'active'
            },
            {
              id: '3',
              name: '限时折扣券',
              type: 'reduction',
              value: 30,
              minAmount: 150,
              startTime: '2024-01-01',
              endTime: '2024-01-31',
              total: 200,
              used: 50,
              status: 'active'
            }
          ],
          total: 3,
          page: params.page || 1,
          pageSize: params.pageSize || 10
        }
      })
    }, 500)
  })
}