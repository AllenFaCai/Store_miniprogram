import request from '@/utils/request'

interface ProductQuery {
  categoryId?: string
  page?: number
  pageSize?: number
  keyword?: string
  sort?: string
}

export const getProducts = async (params: ProductQuery): Promise<any> => {
  return request({
    url: '/products',
    method: 'GET',
    params
  })
}

export const getProductDetail = async (id: string): Promise<any> => {
  return request({
    url: `/products/${id}`,
    method: 'GET'
  })
}

export const searchProducts = async (params: {
  keyword: string
  page?: number
  pageSize?: number
  sort?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
}): Promise<any> => {
  return request({
    url: '/search',
    method: 'GET',
    params
  })
}

export const getHotProducts = async (limit?: number): Promise<any> => {
  return request({
    url: '/products/hot',
    method: 'GET',
    params: { limit }
  })
}

export const getNewProducts = async (limit?: number): Promise<any> => {
  return request({
    url: '/products/new',
    method: 'GET',
    params: { limit }
  })
}

export const getRecommendProducts = async (pageSize?: number): Promise<any> => {
  return request({
    url: '/products',
    method: 'GET',
    params: { pageSize }
  })
}

export const createProduct = async (data: {
  name: string
  categoryId: string
  price: number
  originalPrice?: number
  stock: number
  description?: string
  images: string[]
  spec?: string
  specValue?: string
  status?: number
}): Promise<any> => {
  return request({
    url: '/products',
    method: 'POST',
    data
  })
}

export const updateProduct = async (id: string, data: {
  name?: string
  categoryId?: string
  price?: number
  originalPrice?: number
  stock?: number
  description?: string
  images?: string[]
  spec?: string
  specValue?: string
  status?: number
}): Promise<any> => {
  return request({
    url: `/products/${id}`,
    method: 'PUT',
    data
  })
}

export const updateProductStatus = async (id: string, status: number): Promise<any> => {
  return request({
    url: `/products/${id}/status`,
    method: 'PUT',
    data: { status }
  })
}

export const deleteProduct = async (id: string): Promise<any> => {
  return request({
    url: `/products/${id}`,
    method: 'DELETE'
  })
}

export const productApi = {
  getProducts,
  getProductDetail,
  searchProducts,
  getHotProducts,
  getNewProducts,
  getRecommendProducts,
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct
}