<template>
  <a-modal
    :title="showTitle"
    width="50%"
    height="60%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <template slot="footer">
      <a-button key="back" @click="handleCancel">
        取消
      </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
        下一步
      </a-button>
    </template>
    <TableForm ref="tableForm" :afterSubmit="afterSubmit" :dataSource="entity"></TableForm>
    <a-spin :spinning="confirmLoading" class="selectTree">
      <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }" style="margin-left: 60px">
        <a-form-item label="集群">
          <a-select
            v-decorator="['集群',{ rules: [{ required: true, message: '请选择集群' }] },]"
            placeholder=" 请选择集群"
            @change="handleSelectChange"
          >
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
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import TableForm from './table'

export default {
  components: {
    TableForm
  },
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
      entity: {}
    }
  },
  methods: {
    add () {
      this.showTitle = '创建新虚拟机'
      this.visible = true
      this.form.resetFields()
    },
    edit () {
      this.showTitle = '以模板创建虚拟机'
      this.visible = true
    },
    handleOk () {
      this.form.validateFields((errors, values) => {
        if (!errors) {
          this.entity = Object.assign(this.entity, this.form.getFieldsValue())
          // eslint-disable-next-line no-undef
          this.entity.key = 1
          console.log(this.entity)
          this.$refs.tableForm.add()
        }
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
    handleSelectChange (value) {
      console.log(`selected ${value}`)
    },
    handleCancel () {
      this.visible = false
    },
    handleChange (value) {
      console.log(`selected ${value}`)
    }
  }
}
</script>
