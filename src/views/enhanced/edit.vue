<template>
  <a-modal
    :title="showTitle"
    width="50%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <template slot="footer">
      <a-button key="back" @click="handleCancel">
        取消
      </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
        添加
      </a-button>
    </template>
    <a-spin :spinning="confirmLoading" class="from">
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" style="margin-left: 60px">
        <a-form-item label="名称">
          <a-input
            v-decorator="['名称', { rules: [{ required: true, message: '请输入名称' }] }]"
          />
        </a-form-item>
        <a-form-item label="描述">
          <a-input
            v-decorator="['描述', { rules: [{ required: true, message: '请输入描述' }] }]"
          />
        </a-form-item>
        <a-form-item label="传输区域">
          <a-select
            v-decorator="['传输区域',{ rules: [{ required: true, message: '请选择传输区域' }] },]"
            placeholder="请选择传输区域"
            @change="handleSelectChange"
          >
            <a-select-option value="区域1">
              区域1
            </a-select-option>
            <a-select-option value="区域2">
              区域2
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="复制模式">
          <a-select
            v-decorator="['复制模式',{ rules: [{ required: true, message: '请选择复制模式' }] },]"
            placeholder="请选择复制模式"
            @change="handleSelectChange"
          >
            <a-select-option value="单播">
              单播
            </a-select-option>
          </a-select>
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
      loading: false,
      confirmLoading: false,
      isAdd: true,
      formFields: {},
      entity: {},
      value: 1,
      hasValue: 1
    }
  },
  methods: {
    add () {
      this.showTitle = '创建逻辑交换机'
      this.isAdd = true
      this.entity = {}
      this.visible = true
      this.form.resetFields()
    },
    handleOk () {
      this.form.validateFields((errors, values) => {
        console.log(values)
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
    },
    handleSelectChange (value) {
      console.log(`selected ${value}`)
    }
  }
}
</script>
<style lang="less" scoped>
.from {

}
</style>
