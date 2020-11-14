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
        <a-form-item label="新建名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input autoSize v-decorator="['name', { rules: [{ required: true, message: '请输入名称' }] }]"/>
        </a-form-item>
      </a-form>
    </a-spin>
    <div class="drs-radio">
      <span>vSphere DRS：</span>
      <a-radio-group v-model="value" @change="onDrsChange">
        <a-radio :value="1">
          开启
        </a-radio>
        <a-radio :value="2">
          关闭
        </a-radio>
      </a-radio-group>
    </div>
    <div class="ha-radio">
      <span>vSphere HA：</span>
      <a-radio-group v-model="value" @change="onHaChange">
        <a-radio :value="3">
          开启
        </a-radio>
        <a-radio :value="4">
          关闭
        </a-radio>
      </a-radio-group>
    </div>
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
      value: 1,
      hasValue: 1
    }
  },
  methods: {
    add () {
      this.showTitle = '新建集群'
      this.isAdd = true
      this.entity = {}
      this.visible = true
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
    },
    onHaChange (e) {
      console.log(e.target.value)
    },
    onDrsChange (e) {
      console.log(e.target.value)
    }
  }
}
</script>
<style lang="less" scoped>
.drs-radio {
  text-align: center;
  span{
    margin-right: 240px;
  }
}
.ha-radio {
  text-align: center;
  span{
    margin-right: 230px;
  }
}
</style>
