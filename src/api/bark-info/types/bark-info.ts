export interface CreateOrUpdateBarkInfoRequestData {
  id?: string
  url: string
  remark?: string
}

export interface BarkInfoPageParam extends PageQuery {
  /** 查询参数：地址 */
  url?: string
  /** 查询参数：备注 */
  remark?: string
}

export interface BarkInfoPage {
  id: number
  url: string
  remark: string
}

export type BarkInfoPageResponse = ApiResponsePage<BarkInfoPage[]>
