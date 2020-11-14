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
        <a-form-item label="公司名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input autoSize v-decorator="['companyName', { rules: [{ required: true, message: '请输入公司名称' }] }]" :disabled="!isAdd && entity.isSystem" />
        </a-form-item>
        <a-form-item label="联系人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['contact', { rules: [{ required: true, message: '请输入联系人姓名' }] }]" />
        </a-form-item>
        <a-form-item label="联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['contactPhone', { rules: [{ required: true, message: '请输入联系电话' },{ validator: rules.phone, trigger: 'blur' }] }]" />
        </a-form-item>
        <a-form-item label="联系地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea v-decorator="['address', { rules: [{ required: true, message: '请输入联系地址' }] }]" :autoSize="{ minRows: 2, maxRows: 6 }" />
        </a-form-item>
        <a-form-item label="管理员账号" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="isAdd">
          <a-input v-decorator="['adminAccount', { rules: [{ required: isAdd, message: '请输入管理员账号' }, {validator: rules.loginName, trigger: 'change'}] }]" />
        </a-form-item>
        <a-form-item label="管理员密码" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="isAdd">
          <a-input type="password" v-decorator="['adminPassword', { rules: [{ required: isAdd, message: '请输入管理员密码' }] }]" />
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
      labelCol: { xs: { span: 24 }, sm: { span: 7 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 13 } },
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
      this.showTitle = '新增公司'
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
        this.$http.get('/company/' + id, { }).then(resJson => {
            this.entity = resJson.result
            var setData = {}
            Object.keys(this.formFields).forEach(item => {
                setData[item] = this.entity[item]
            })
            this.form.setFieldsValue(setData)
        })
        .catch(err => {
          this.$message.error('数据加载失败:' + err.response.data.message)
        })
      })
    },
    handleSubmit () {
      this.form.validateFields((errors, values) => {
        // 校验成功
        if (!errors) {
          const postUrl = this.isAdd ? '/company/create' : '/company/edit'
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
