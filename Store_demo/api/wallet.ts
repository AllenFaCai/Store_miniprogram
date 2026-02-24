import request from '@/utils/request'
import { PointsRecord, BalanceRecord } from '@/types'

// 获取积分记录
export const getPointsRecord = async (params: {
  page?: number
  pageSize?: number
  type?: 'earn' | 'spend'
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
              type: 'earn',
              amount: 199,
              description: '购物获得积分',
              createdAt: '2024-01-01 12:00:00'
            },
            {
              id: '2',
              userId: '1',
              type: 'earn',
              amount: 5,
              description: '评价商品获得积分',
              createdAt: '2024-01-02 10:00:00'
            },
            {
              id: '3',
              userId: '1',
              type: 'spend',
              amount: 100,
              description: '积分抵扣订单',
              createdAt: '2024-01-03 14:00:00'
            },
            {
              id: '4',
              userId: '1',
              type: 'earn',
              amount: 10,
              description: '签到获得积分',
              createdAt: '2024-01-04 09:00:00'
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

// 获取余额记录
export const getBalanceRecord = async (params: {
  page?: number
  pageSize?: number
  type?: 'recharge' | 'consume' | 'withdraw' | 'refund'
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
              type: 'recharge',
              amount: 500,
              description: '余额充值',
              createdAt: '2024-01-01 12:00:00'
            },
            {
              id: '2',
              userId: '1',
              type: 'consume',
              amount: 199.50,
              description: '订单支付',
              createdAt: '2024-01-02 10:00:00'
            },
            {
              id: '3',
              userId: '1',
              type: 'recharge',
              amount: 1000,
              description: '余额充值',
              createdAt: '2024-01-03 14:00:00'
            },
            {
              id: '4',
              userId: '1',
              type: 'consume',
              amount: 120,
              description: '订单支付',
              createdAt: '2024-01-04 09:00:00'
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

// 余额充值
export const rechargeBalance = async (amount: number, paymentMethod: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          orderId: '1',
          payUrl: 'https://example.com/pay?orderId=1'
        }
      })
    }, 500)
  })
}

// 余额提现
export const withdrawBalance = async (amount: number): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          withdrawId: '1',
          amount,
          status: 'processing'
        }
      })
    }, 500)
  })
}

// 签到
export const checkIn = async (): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          points: 10,
          consecutiveDays: 5,
          totalDays: 30
        }
      })
    }, 500)
  })
}

// 获取用户资产信息
export const getUserAssets = async (): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          points: 1280,
          balance: 1280.50,
          couponCount: 5,
          favoriteCount: 10
        }
      })
    }, 500)
  })
}