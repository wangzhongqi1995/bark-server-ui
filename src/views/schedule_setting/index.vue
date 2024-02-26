<script lang="ts" setup>
import { nextTick, reactive, ref } from "vue"
import { type ElMessageBoxOptions, ElMessageBox, ElMessage } from "element-plus"
import {
  deleteScheduleSettingApi,
  getScheduleSettingPageApi,
  changesStatusApi,
  updateScheduleSettingApi,
  createScheduleSettingApi
} from "@/api/schedule_setting"
import {
  type VxeGridInstance,
  type VxeGridProps,
  type VxeModalInstance,
  type VxeModalProps,
  type VxeFormInstance,
  type VxeFormProps
} from "vxe-table"
import type * as ScheduleSetting from "@/api/schedule_setting/types/schedule_setting"
import StatusColumnSolts from "@/views/table/vxe-table/tsx/StatusColumnSolts"

defineOptions({
  // 命名当前组件
  name: "ScheduleSetting"
})

const xGridDom = ref<VxeGridInstance>()
const xGridOpt: VxeGridProps = reactive({
  loading: true,
  autoResize: true,
  /** 分页配置项 */
  pagerConfig: {
    align: "right"
  },
  /** 表单配置项 */
  formConfig: {
    items: [
      {
        field: "beanName",
        itemRender: {
          name: "$input",
          props: { placeholder: "实例名称", clearable: true }
        }
      },
      {
        itemRender: {
          name: "$buttons",
          children: [
            {
              props: { type: "submit", content: "查询", status: "primary" }
            },
            {
              props: { type: "reset", content: "重置" }
            }
          ]
        }
      }
    ]
  },
  /** 工具栏配置 */
  toolbarConfig: {
    refresh: true,
    custom: true,
    slots: { buttons: "toolbar-btns" }
  },
  /** 自定义列配置项 */
  customConfig: {
    /** 是否允许列选中  */
    checkMethod: ({ column }) => !["jobId"].includes(column.field)
  },
  /** 列配置 */
  columns: [
    {
      type: "checkbox",
      width: "50px"
    },
    {
      field: "beanName",
      title: "实例名称"
    },
    {
      field: "methodName",
      title: "方法名称"
    },
    {
      field: "methodParams",
      title: "方法参数"
    },
    {
      field: "cronExpression",
      title: "表达式"
    },
    {
      field: "jobStatus",
      title: "状态",
      slots: StatusColumnSolts
    },
    {
      title: "操作",
      width: "300px",
      fixed: "right",
      showOverflow: false,
      slots: { default: "row-operate" }
    }
  ],
  /** 数据代理配置项（基于 Promise API） */
  proxyConfig: {
    /** 启用动态序号代理 */
    seq: true,
    /** 是否代理表单 */
    form: true,
    /** 是否自动加载，默认为 true */
    // autoLoad: false,
    props: {
      total: "total"
    },
    ajax: {
      query: ({ page, form }) => {
        xGridOpt.loading = true
        crudStore.clearTable()
        return new Promise((resolve) => {
          let total = 0
          let result: ScheduleSetting.ScheduleSettingPage[] = []
          /** 加载数据 */
          const callback = (res: ScheduleSetting.ScheduleSettingPageResponse) => {
            if (res?.rows) {
              // 总数
              total = res.total
              // 列表数据
              result = res.rows
            }
            xGridOpt.loading = false
            // 返回值有格式要求，详情见 vxe-table 官方文档
            resolve({ total, result })
          }

          /** 接口需要的参数 */
          const params: ScheduleSetting.ScheduleSettingPageParam = {
            beanName: form.beanName || undefined,
            pageSize: page.pageSize,
            pageNum: page.currentPage
          }
          /** 调用接口 */
          getScheduleSettingPageApi(params).then(callback).catch(callback)
        })
      }
    }
  }
})
//#endregion

//#region vxe-modal
const xModalDom = ref<VxeModalInstance>()
const xModalOpt: VxeModalProps = reactive({
  title: "",
  showClose: true,
  escClosable: true,
  maskClosable: true,
  beforeHideMethod: () => {
    xFormDom.value?.clearValidate()
    return Promise.resolve()
  }
})
//#endregion

//#region vxe-form
const xFormDom = ref<VxeFormInstance>()
const xFormOpt: VxeFormProps = reactive({
  span: 24,
  titleAlign: "right",
  titleWidth: "100px",
  loading: false,
  /** 是否显示标题冒号 */
  titleColon: false,
  /** 表单数据 */
  data: {
    jobId: "",
    beanName: "",
    methodName: "",
    methodParams: "",
    cronExpression: "",
    jobStatus: 1,
    remark: ""
  },
  /** 项列表 */
  items: [
    {
      field: "beanName",
      title: "实例名称",
      itemRender: { name: "$input", props: { placeholder: "请输入" } }
    },
    {
      field: "methodName",
      title: "方法名称",
      itemRender: { name: "$input", props: { placeholder: "请输入" } }
    },
    {
      field: "methodParams",
      title: "方法参数",
      itemRender: { name: "$input", props: { placeholder: "请输入" } }
    },
    {
      field: "cronExpression",
      title: "表达式",
      itemRender: { name: "$input", props: { placeholder: "请输入" } }
    },
    {
      field: "jobStatus",
      title: "状态",
      itemRender: {
        name: "$select",
        options: [
          { label: "启用", value: 1 },
          { label: "禁用", value: 0 }
        ],
        props: { placeholder: "请输入" }
      }
    },
    {
      field: "remark",
      title: "备注",
      itemRender: { name: "$input", props: { placeholder: "请输入" } }
    },
    {
      align: "right",
      itemRender: {
        name: "$buttons",
        children: [
          { props: { content: "取消" }, events: { click: () => xModalDom.value?.close() } },
          {
            props: { type: "submit", content: "确定", status: "primary" },
            events: { click: () => crudStore.onSubmitForm() }
          }
        ]
      }
    }
  ],
  /** 校验规则 */
  rules: {
    beanName: [
      {
        required: true,
        validator: ({ itemValue }) => {
          switch (true) {
            case !itemValue:
              return new Error("请输入")
            case !itemValue.trim():
              return new Error("空格无效")
          }
        }
      }
    ],
    methodName: [
      {
        required: true,
        validator: ({ itemValue }) => {
          switch (true) {
            case !itemValue:
              return new Error("请输入")
            case !itemValue.trim():
              return new Error("空格无效")
          }
        }
      }
    ],
    cronExpression: [
      {
        required: true,
        validator: ({ itemValue }) => {
          switch (true) {
            case !itemValue:
              return new Error("请输入")
            case !itemValue.trim():
              return new Error("空格无效")
          }
        }
      }
    ]
  }
})
//#endregion

//#region 增删改查
const crudStore = reactive({
  /** 表单类型，true 表示修改，false 表示新增 */
  isUpdate: true,
  /** 加载表格数据 */
  commitQuery: () => xGridDom.value?.commitProxy("query"),
  /** 清空表格数据 */
  clearTable: () => xGridDom.value?.reloadData([]),
  /** 点击显示弹窗 */
  onShowModal: (row?: ScheduleSetting.ScheduleSettingPage) => {
    if (row) {
      crudStore.isUpdate = true
      xModalOpt.title = "修改"
      // 赋值
      xFormOpt.data.beanName = row.beanName
      xFormOpt.data.jobId = row.jobId
      xFormOpt.data.methodName = row.methodName
      xFormOpt.data.methodParams = row.methodParams
      xFormOpt.data.cronExpression = row.cronExpression
      xFormOpt.data.jobStatus = row.jobStatus
      xFormOpt.data.remark = row.remark
    } else {
      xFormOpt.data.jobId = ""
      crudStore.isUpdate = false
      xModalOpt.title = "新增"
    }
    // 禁用表单项
    // const props = xFormOpt.items?.[0]?.itemRender?.props
    // props && (props.disabled = crudStore.isUpdate)
    xModalDom.value?.open()
    nextTick(() => {
      !crudStore.isUpdate && xFormDom.value?.reset()
      xFormDom.value?.clearValidate()
    })
  },
  /** 确定并保存 */
  onSubmitForm: () => {
    if (xFormOpt.loading) return
    xFormDom.value?.validate((errMap) => {
      if (errMap) return
      xFormOpt.loading = true
      const callback = () => {
        xFormOpt.loading = false
        xModalDom.value?.close()
        ElMessage.success("操作成功")
        !crudStore.isUpdate && crudStore.afterInsert()
        crudStore.commitQuery()
      }
      if (crudStore.isUpdate) {
        // 模拟调用修改接口成功
        updateScheduleSettingApi(xFormOpt.data)
          .then(() => callback())
          .catch(() => {
            xFormOpt.loading = true
          })
      } else {
        createScheduleSettingApi(xFormOpt.data)
          .then(() => callback())
          .catch(() => {
            xFormOpt.loading = true
          })
      }
    })
  },
  /** 新增后是否跳入最后一页 */
  afterInsert: () => {
    const pager = xGridDom.value?.getProxyInfo()?.pager
    if (pager) {
      const currentTotal = pager.currentPage * pager.pageSize
      if (currentTotal === pager.total) {
        ++pager.currentPage
      }
    }
  },
  /** 更新状态 */
  onUpdateJobStatus: (row: ScheduleSetting.ScheduleSettingPage) => {
    const tip = `确定 <strong style="color: red"> ${row.jobStatus === 1 ? "禁用" : "启用"} </strong> 实例名称 <strong style="color: #409eff"> ${row.beanName} </strong> ？`
    const config: ElMessageBoxOptions = {
      type: "warning",
      showClose: true,
      closeOnClickModal: true,
      closeOnPressEscape: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    }
    ElMessageBox.confirm(tip, "提示", config).then(() => {
      changesStatusApi(row.jobId, row.jobStatus === 1 ? 0 : 1).then(() => {
        ElMessage.success(`${row.jobStatus === 1 ? "禁用" : "启用"}成功`)
        crudStore.afterUpdateJobStatus()
        crudStore.commitQuery()
      })
    })
  },
  /** 删除后是否返回上一页 */
  afterUpdateJobStatus: () => {
    const tableData: ScheduleSetting.ScheduleSettingPage[] = xGridDom.value!.getData()
    const pager = xGridDom.value?.getProxyInfo()?.pager
    if (pager && pager.currentPage > 1 && tableData.length === 1) {
      --pager.currentPage
    }
  },
  /** 删除 */
  onDelete: (row: ScheduleSetting.ScheduleSettingPage) => {
    const tip = `确定 <strong style="color: red"> 删除 </strong> 实例名称 <strong style="color: #409eff"> ${row.beanName} </strong> ？`
    const config: ElMessageBoxOptions = {
      type: "warning",
      showClose: true,
      closeOnClickModal: true,
      closeOnPressEscape: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    }
    ElMessageBox.confirm(tip, "提示", config).then(() => {
      deleteScheduleSettingApi(row.jobId).then(() => {
        ElMessage.success("删除成功")
        crudStore.afterDelete()
        crudStore.commitQuery()
      })
    })
  },
  /** 删除后是否返回上一页 */
  afterDelete: () => {
    const tableData: ScheduleSetting.ScheduleSettingPage[] = xGridDom.value!.getData()
    const pager = xGridDom.value?.getProxyInfo()?.pager
    if (pager && pager.currentPage > 1 && tableData.length === 1) {
      --pager.currentPage
    }
  },
  /** 更多自定义方法 */
  moreFn: () => {}
})
//#endregion
</script>

<template>
  <div class="app-container">
    <!-- 表格 -->
    <vxe-grid ref="xGridDom" v-bind="xGridOpt">
      <!-- 左侧按钮列表 -->
      <template #toolbar-btns>
        <vxe-button status="primary" icon="vxe-icon-add" @click="crudStore.onShowModal()">新增</vxe-button>
      </template>
      <!-- 操作 -->
      <template #row-operate="{ row }">
        <el-button link type="primary" @click="crudStore.onShowModal(row)">修改</el-button>
        <el-button link type="primary" @click="crudStore.onUpdateJobStatus(row)">{{
          row.jobStatus === 1 ? "禁用" : "启用"
        }}</el-button>
        <el-button link type="danger" @click="crudStore.onDelete(row)">删除</el-button>
      </template>
    </vxe-grid>
    <!-- 弹窗 -->
    <vxe-modal ref="xModalDom" v-bind="xModalOpt">
      <!-- 表单 -->
      <vxe-form ref="xFormDom" v-bind="xFormOpt" />
    </vxe-modal>
  </div>
</template>
