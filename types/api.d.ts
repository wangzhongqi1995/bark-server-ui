/** 所有 api 接口的响应数据都应该准守该格式 */
interface ApiResponseData<T> {
  code: number
  data: T
  message: string
}

/**
 * 分页格式
 */
interface ApiResponsePage<T> {
  total: number
  rows: T
  code: number
  msg: string
}

/**
 * 分页查询参数
 */
declare interface PageQuery {
  pageNum: number
  pageSize: number
}
