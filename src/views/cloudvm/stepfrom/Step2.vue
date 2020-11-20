<template>
  <div>
    <a-form
      :form="form"
      style="max-width: 500px; margin: 40px auto 0;"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 16 }">
      <a-form-item label="集群">
        <a-select
          v-decorator="['集群',{ rules: [{ required: true, message: '请选择集群' }] },]"
          placeholder=" 请选择集群"
          @change="handleSelectChange">
          <a-select-option value="集群1">
            集群1
          </a-select-option>
          <a-select-option value="集群2">
            集群2
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="主机">
        <a-select
          v-decorator="['主机',{ rules: [{ required: true, message: '请选择主机' }] },]"
          placeholder="请选择主机"
          @change="handleSelectChange"
        >
          <a-select-option value="主机一">
            主机一
          </a-select-option>
          <a-select-option value="主机二">
            主机二
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="数据存储">
        <a-select
          v-decorator="['数据存储',{ rules: [{ required: true, message: '请选择数据存储' }] },]"
          placeholder="请选择数据存储"
          @change="handleSelectChange"
        >
          <a-select-option value="data1">
            data1
          </a-select-option>
          <a-select-option value="data2">
            data2
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="网络">
        <a-select
          v-decorator="['网络',{ rules: [{ required: true, message: '请选择网络' }] },]"
          placeholder="请选择网络"
          @change="handleSelectChange"
        >
          <a-select-option value="网络1">
            网络1
          </a-select-option>
          <a-select-option value="网络2">
            网络2
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 16, offset: 8}">
        <a-button :loading="loading" type="primary" @click="nextStep">确认信息</a-button>
        <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>

export default {
  name: 'Step2',
  data () {
    return {
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      loading: false,
      data: []
    }
  },
  methods: {
    nextStep () {
      const that = this
      const { form: { validateFields } } = this
      that.loading = true
      validateFields((err, values) => {
        if (!err) {
          this.data.push(values)
          console.log(this.data)
          that.$emit('dataSource', this.data)
          that.loading = false
          that.$emit('nextStep')
        } else {
          that.loading = false
        }
      })
    },
    prevStep () {
      this.$emit('prevStep')
    },
    handleSelectChange (value) {
      console.log(`selected ${value}`)
    }
  }
}
</script>

<style lang="less" scoped>
.stepFormText {
  margin-bottom: 24px;

  .ant-form-item-label,
  .ant-form-item-control {
    line-height: 22px;
  }
}

</style>
