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
        <a-form-item label="所属部门" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-tree-select
            :treeData="treeData"
            :treeDataSimpleMode="true"
            placeholder="所属部门"
            treeDefaultExpandAll
            v-model="entity.departmentId"
            :loading="confirmLoading">
          </a-tree-select>
        </a-form-item>
        <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input autoSize v-decorator="['name', { rules: [{ required: true, message: '请输入姓名' }] }]" />
        </a-form-item>
        <a-form-item label="登陆账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['loginName', { rules: [{ required: true, message: '请输入登陆账号' }, {validator: rules.loginName, trigger: 'change'}] }]" :disabled="!isAdd" />
        </a-form-item>
        <a-form-item label="登陆密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input type="password" v-decorator="['password', { rules: [{ required: isAdd, message: '请输入登陆密码' }] }]" />
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
      treeData: [],
      rules: validateRules
    }
  },
  methods: {
    add () {
        this.showTitle = '新增用户'
        this.isAdd = true
        this.entity = {}
        this.visible = true
        this.form.resetFields()
        this.getTree()
    },
    edit (id) {
      this.showTitle = '编辑用户'
      this.isAdd = false
      this.visible = true
      this.getTree()
      this.$nextTick(() => {
        this.formFields = this.form.getFieldsValue()
        this.$http.get('/user/' + id, {}).then(resJson => {
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
          const postUrl = this.isAdd ? '/user/create' : '/user/edit'
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
    },
    getTree () {
      this.confirmLoading = true
      this.$http.get('/department/select-tree', {}).then(resJson => {
        this.confirmLoading = false
        this.treeData = resJson.result
      })
      .catch(err => {
        this.$message.error('加载失败:' + err.response.data.message)
        this.confirmLoading = false
      })
    }
  }
}
</script>
