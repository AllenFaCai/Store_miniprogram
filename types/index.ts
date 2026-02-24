export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  stock: number
  images: string[]
  category: string
  categoryId: string
  sales: number
  rating: number
  tags?: string[]
  specs?: ProductSpec[]
  createdAt: string
  updatedAt: string
}

export interface ProductSpec {
  id: string
  name: string
  options: SpecOption[]
}

export interface SpecOption {
  id: string
  name: string
  value: string
  stock?: number
  price?: number
}

export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  selected: boolean
  spec?: string
}

export interface Order {
  id: string
  orderNo: string
  userId: string
  items: OrderItem[]
  totalAmount: number
  discountAmount: number
  payAmount: number
  status: OrderStatus
  paymentMethod?: string
  paymentTime?: string
  deliveryAddress: Address
  deliveryTime?: string
  remark?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  spec?: string
  price: number
  quantity: number
}

export type OrderStatus = 
  | 'pending' 
  | 'paid' 
  | 'shipped' 
  | 'delivered' 
  | 'completed' 
  | 'cancelled' 
  | 'refunded'

export interface Address {
  id: string
  userId: string
  receiverName: string
  receiverPhone: string
  province: string
  city: string
  district: string
  detailAddress: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  icon?: string
  parentId?: string
  level: number
  sort: number
  children?: Category[]
}

export interface User {
  id: string
  openid: string
  nickname: string
  avatar: string
  phone?: string
  gender: 0 | 1 | 2
  points: number
  balance: number
  createdAt: string
}

export interface Coupon {
  id: string
  name: string
  type: 'discount' | 'reduction'
  value: number
  minAmount: number
  startTime: string
  endTime: string
  total: number
  used: number
  status: 'active' | 'inactive'
}

export interface UserCoupon {
  id: string
  userId: string
  couponId: string
  coupon: Coupon
  status: 'unused' | 'used' | 'expired'
  orderId?: string
  usedAt?: string
  expireAt: string
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface PageParams {
  page: number
  pageSize: number
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface Favorite {
  id: string
  userId: string
  productId: string
  product: Product
  createdAt: string
}

export interface Comment {
  id: string
  userId: string
  productId: string
  orderId: string
  rating: number
  content: string
  images: string[]
  anonymous: boolean
  reply?: string
  replyTime?: string
  createdAt: string
}

export interface PointsRecord {
  id: string
  userId: string
  type: 'earn' | 'spend'
  amount: number
  description: string
  createdAt: string
}

export interface BalanceRecord {
  id: string
  userId: string
  type: 'recharge' | 'consume' | 'withdraw' | 'refund'
  amount: number
  description: string
  createdAt: string
}

export interface AfterSales {
  id: string
  userId: string
  orderId: string
  type: 'refund' | 'return' | 'exchange' | 'repair'
  reason: string
  images: string[]
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'cancelled'
  refundAmount?: number
  reply?: string
  createdAt: string
  updatedAt: string
}

export interface Banner {
  id: string
  title: string
  image: string
  link: string
  linkType: 'product' | 'category' | 'url' | 'none'
  sort: number
  status: 'active' | 'inactive'
  createdAt: string
}

export interface Notice {
  id: string
  title: string
  content: string
  type: 'announcement' | 'activity' | 'system'
  status: 'active' | 'inactive'
  createdAt: string
}

export interface SearchSuggestion {
  keyword: string
  count: number
}

export interface SearchHistory {
  id: string
  userId: string
  keyword: string
  createdAt: string
}