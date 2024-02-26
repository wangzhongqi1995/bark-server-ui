import { request } from "@/utils/service"
import type * as ScheduleSetting from "./types/schedule_setting"

export function createScheduleSettingApi(data: ScheduleSetting.CreateOrUpdateScheduleSettingRequestData) {
  return request({
    url: "scheduleSetting/add",
    method: "post",
    data
  })
}

export function updateScheduleSettingApi(data: ScheduleSetting.CreateOrUpdateScheduleSettingRequestData) {
  return request({
    url: "scheduleSetting/update",
    method: "post",
    data
  })
}

export function deleteScheduleSettingApi(jobId: number) {
  return request({
    url: `scheduleSetting/del/${jobId}`,
    method: "delete"
  })
}

export function changesStatusApi(jobId: number, jobStatus: number) {
  return request({
    url: `scheduleSetting/changesStatus/${jobId}/${jobStatus}`,
    method: "get"
  })
}

export function getScheduleSettingPageApi(params: ScheduleSetting.ScheduleSettingPageParam) {
  return request<ScheduleSetting.ScheduleSettingPageResponse>({
    url: "scheduleSetting/page",
    method: "get",
    params
  })
}
