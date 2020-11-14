<template>
  <a-modal
    :title="showTitle"
    width="40%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="升级标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input autoSize v-decorator="['title', { rules: [{ required: true, message: '请输入升级标题' }] }]" />
        </a-form-item>
        <a-form-item label="版本号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['version', { rules: [{ required: true, message: '请输入版本号' }] }]" />
        </a-form-item>
        <a-form-item label="升级日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker format="YYYY-MM-DD" v-decorator="['upgradeDate', { rules: [{ type: 'object', required: true, message: '请输入升级日期' }] }]" />
        </a-form-item>
        <a-form-item label="详细信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea v-decorator="['details']" placeholder="多条请用回车换行" :rows="6" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import validateRules from '@/utils/validate/common.js'
export default {
  props: {
    afterSubmit: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      showTitle: '',
      form: this.$form.createForm(this),
      labelCol: { xs: { span: 24 }, sm: { span: 4 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 20 } },
      visible: false,
      confirmLoading: false,
      isAdd: true,
      formFields: {},
      entity: {},
      rules: validateRules
    }
  },
  methods: {
    add () {
      this.showTitle = '新增升级日志'
      this.isAdd = true
      this.entity = {}
      this.visible = true
      this.form.resetFields()
    },
    edit (id) {
      this.showTitle = '编辑公司'
      this.isAdd = false
      this.visible = true
      this.$nextTick(() => {
        this.formFields = this.form.getFieldsValue()
        this.$http.get('/upgradelog/' + id, { }).then(resJson => {
          this.entity = resJson.result
          var setData = {}
          Object.keys(this.formFields).forEach(item => {
              setData[item] = this.entity[item]
          })
          this.form.setFieldsValue(setData)
        })
        .catch(err => {
          this.$message.error('加载失败:' + err.response.data.message)
        })
      })
    },
    handleSubmit () {
      this.form.validateFields((errors, values) => {
        // 校验成功
        if (!errors) {
          const postUrl = this.isAdd ? '/upgradelog/create' : '/upgradelog/edit'
          this.entity = Object.assign(this.entity, this.form.getFieldsValue())
          this.confirmLoading = true
          this.$http.post(postUrl, this.entity).then(resJson => {
            this.confirmLoading = false
            this.$message.success('保存成功!')
            this.afterSubmit()
            this.visible = false
          })
          .catch(err => {
            this.$message.error('保存失败:' + err.response.data.message)
            this.confirmLoading = false
          })
        }
      })
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>
