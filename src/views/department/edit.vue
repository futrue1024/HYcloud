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
        <a-form-item label="上级部门" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-tree-select
            :treeData="treeData"
            :treeDataSimpleMode="true"
            placeholder="上级部门"
            treeDefaultExpandAll
            v-model="entity.parentId"
            :loading="confirmLoading">
          </a-tree-select>
        </a-form-item>
        <a-form-item label="部门名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input autoSize v-decorator="['name', { rules: [{ required: true, message: '请输入部门名称' }] }]" />
        </a-form-item>
        <a-form-item label="部门备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea v-decorator="['remark', { rules: [{ required: false, message: '请输入部门备注' }] }]" :autoSize="{ minRows: 2, maxRows: 6 }" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
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
      treeData: []
    }
  },
  methods: {
    add () {
      this.showTitle = '新增部门'
      this.isAdd = true
      this.visible = true
      this.form.resetFields()
      this.getTree()
    },
    edit (id) {
      this.showTitle = '编辑部门'
      this.isAdd = false
      this.visible = true

      this.$nextTick(() => {
        this.formFields = this.form.getFieldsValue()
        this.getTree()
        this.$http.get('/department/' + id, {}).then(resJson => {
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
          const postUrl = '/department/' + (this.isAdd ? 'create' : 'edit')
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
        this.$message.error('父级部门加载失败:' + err.response.data.message)
        this.confirmLoading = false
      })
    }
  }
}
</script>
