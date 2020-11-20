<template>
  <a-modal
    :title="showTitle"
    width="80%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-spin :spinning="confirmLoading">
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="详情 1">
          <a-descriptions title="详情信息" bordered size="small">
            <a-descriptions-item label="名称" :span="3">{{ dataItem.name || '' }}</a-descriptions-item>
            <a-descriptions-item label="电源状态" :span="3">{{ dataItem.powerState || '' }}</a-descriptions-item>
            <a-descriptions-item label="所属主机" :span="3">{{ dataItem.vmHostId || '' }}</a-descriptions-item>
            <a-descriptions-item label="版本" :span="3">{{ dataItem.version || '' }}</a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>
        <a-tab-pane key="2" tab="详情 2" force-render>
          <a-descriptions title="详情信息" bordered size="small">
            <a-descriptions-item label="名称" :span="3">{{ dataItem.name }}</a-descriptions-item>
            <a-descriptions-item label="电源状态" :span="3">{{ dataItem.powerState }}</a-descriptions-item>
            <a-descriptions-item label="所属主机" :span="3">{{ dataItem.vmHostId }}</a-descriptions-item>
            <a-descriptions-item label="版本" :span="3">{{ dataItem.version }}</a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </a-modal>
</template>

<script>
import Vue from 'vue'
import { Descriptions } from 'ant-design-vue'
// eslint-disable-next-line no-undef
Vue.use(Descriptions)
export default {

  props: {
    afterSubmit: {
      type: Function,
      default: null
    },
    dataItem: {
      type: Object,
      default: () => { return {} }
    }
  },
  data () {
    return {
      showTitle: '',
      form: this.$form.createForm(this),
      labelCol: { xs: { span: 24 }, sm: { span: 7 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 13 } },
      visible: false,
      loading: false,
      confirmLoading: false,
      isAdd: true,
      formFields: {},
      entity: {},
      value: 1,
      hasValue: 1,
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true
      },
      sorter: { field: 'Id', order: 'ASC' },
      data: [],
      toggle: true
    }
  },
  mounted () {
    const queryJson = {
      pageIndex: this.pagination.current,
      pageSize: this.pagination.pageSize,
      sortField: this.sorter.field,
      sortType: this.sorter.order
    }
    this.$http
      .post('/Info/vm', queryJson)
      .then((resJson) => {
        this.entity = resJson.result.datas
        this.pagination = { ...this.pagination }
      })
      .catch((err) => {
        this.$message.error('加载失败:' + err.response.message)
      })
  },
  methods: {
    add () {
      this.showTitle = '虚拟机详情'
      this.isAdd = true
      this.entity = {}
      this.visible = true
      this.form.resetFields()
    },
    handleSubmit () {
      this.form.validateFields((errors, values) => {
        if (!errors) {
          this.entity = Object.assign(this.entity, this.form.getFieldsValue())
          this.$refs.tableFrom.add()
          console.log(this.entity)
        }
      })
    },
    handleCancel () {
      this.visible = false
    },
    handleSelectChange (value) {
      console.log(`selected ${value}`)
    },
    callback (key) {
      console.log(key)
    }
  }
}
</script>
