import { request } from "@/utils/service"
import type * as BarkInfo from "./types/bark-info"

/** 增、改 */
export function createOrUpdateBarkInfoApi(data: BarkInfo.CreateOrUpdateBarkInfoRequestData) {
  return request({
    url: "barkInfo/saveOrUpdate",
    method: "post",
    data
  })
}

/** 删 */
export function deleteBarkInfoApi(id: string) {
  return request({
    url: `barkInfo/${id}`,
    method: "delete"
  })
}

/** 查 */
export function getBarkInfoPageApi(params: BarkInfo.BarkInfoPageParam) {
  return request<BarkInfo.BarkInfoPageResponse>({
    url: "barkInfo/page",
    method: "get",
    params
  })
}
