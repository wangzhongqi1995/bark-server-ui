export interface CreateOrUpdateScheduleSettingRequestData {
  jobId?: number
  beanName: string
  methodName?: string
  methodParams?: string
  cronExpression?: string
  jobStatus?: number
  remark?: string
}

export interface ScheduleSettingPageParam extends PageQuery {
  /** 查询参数：名称 */
  beanName?: string
}

export interface ScheduleSettingPage {
  jobId: number
  beanName: string
  methodName: string
  methodParams: string
  cronExpression: string
  jobStatus: number
  remark: string
  _VXE_ID?: string
}

export type ScheduleSettingPageResponse = ApiResponsePage<ScheduleSettingPage[]>
