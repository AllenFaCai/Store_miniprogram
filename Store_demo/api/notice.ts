import request from '@/utils/request'
import { Notice } from '@/types'

// 获取公告列表
export const getNoticeList = async (params?: {
  type?: 'announcement' | 'activity' | 'system'
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
              title: '系统维护通知',
              content: '为了提供更好的服务，我们将于2024年1月15日凌晨2:00-4:00进行系统维护，期间部分功能可能无法使用，敬请谅解。',
              type: 'system',
              status: 'active',
              createdAt: '2024-01-10'
            },
            {
              id: '2',
              title: '新年促销活动',
              content: '新年大促销，全场商品8折起，更有优惠券等你来领！活动时间：2024年1月1日-1月31日。',
              type: 'activity',
              status: 'active',
              createdAt: '2024-01-01'
            },
            {
              id: '3',
              title: '新功能上线通知',
              content: '我们新增了积分兑换功能，现在可以使用积分兑换商品啦！',
              type: 'announcement',
              status: 'active',
              createdAt: '2024-01-05'
            }
          ],
          total: 3,
          page: params?.page || 1,
          pageSize: params?.pageSize || 10
        }
      })
    }, 500)
  })
}

// 获取公告详情
export const getNoticeDetail = async (id: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          id,
          title: '新年促销活动',
          content: '新年大促销，全场商品8折起，更有优惠券等你来领！活动时间：2024年1月1日-1月31日。',
          type: 'activity',
          status: 'active',
          createdAt: '2024-01-01'
        }
      })
    }, 500)
  })
}

// 标记公告已读
export const markNoticeRead = async (id: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          noticeId: id
        }
      })
    }, 300)
  })
}

// 获取未读公告数量
export const getUnreadNoticeCount = async (): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          count: 2
        }
      })
    }, 300)
  })
}