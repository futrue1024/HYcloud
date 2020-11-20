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
        <a-form-item label="重命名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            autoSize
            v-decorator="['name', { rules: [{ required: true, message: '请输入新名称' }] }]"
            placeholder="请输入新名称"
          />
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
      entity: {}
    }
  },
  methods: {
    add () {
      this.visible = true
      this.showTitle = '新建集群'
      this.entity = {}
      this.form.resetFields()
    },
    edit (id) {
      this.showTitle = '编辑角色'
      this.isAdd = false
      this.visible = true
      this.$nextTick(() => {
        this.formFields = this.form.getFieldsValue()
        this.$http.get('/role/' + id, {}).then(resJson => {
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
          const postUrl = this.isAdd ? '/role/create' : '/role/edit'
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
<style lang="less" scoped>
.radio {
  text-align: center;
  padding-left: 10px;
  color: #333333;

  span {
    color: inherit;
    margin-right: 240px;
  }
}

</style>
