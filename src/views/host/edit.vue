<template>
  <a-modal
    :title="showTitle"
    width="60%"
    height="80%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <template slot="footer">
      <a-button key="back" @click="handleCancel">
        取消
      </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit">
        下一步
      </a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item>
          <a-button type="dashed" style="width: 20%" @click="addProductSpec">
            <a-icon type="plus"/>
            添加
          </a-button>
        </a-form-item>
        <a-form-item
          v-for="(k, index) in keys"
          :key="k"
          :label="index === 0 ? '请填写对应数据' : ''"
          :required="false"
        >
          <span style="margin-right: 10px">{{ index + 1 }}.</span>
          <a-input
            v-decorator="[`specIP[${k}]`,{validateTrigger: ['change', 'blur'], rules: [{required: true,whitespace: true,message: '请检查尚有未输入选项！',},],},]"
            placeholder="请输入管理IP地址"
            style="width: 20%; margin-right: 8px"
          />
          <a-input
            v-decorator="[`specAccount[${k}]`,{validateTrigger: ['change', 'blur'],rules: [{ required: true,whitespace: true,message: '请输入账号',},],},]"
            placeholder="请输入账号"
            style="width: 25%; margin-right: 8px"
          />
          <a-input
            type="password"
            v-decorator="[`specPassword[${k}]`,{validateTrigger: ['change', 'blur'],rules: [{required: true,whitespace: true,message: '密码',},],},]"
            placeholder="请输入密码"
            style="width: 25%; margin-right: 8px"
          />
          <a-icon
            v-if="keys.length > 1"
            class="dynamic-delete-button"
            type="minus-circle-o"
            :disabled="keys.length === 1"
            @click="() => removeProductSpec(k)"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
let id = 1
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
      keys: [],
      form: this.$form.createForm(this),
      labelCol: { xs: { span: 24 }, sm: { span: 7 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 13 } },
      visible: false,
      confirmLoading: false,
      isAdd: true,
      formFields: {},
      entity: {},
      value: 1,
      hasValue: 1,
      loading: false
    }
  },
  methods: {
    add () {
      this.showTitle = '添加主机'
      this.visible = true
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
        console.log(values)
        // 校验成功
        if (!errors) {
          this.entity = Object.assign(this.entity, this.form.getFieldsValue())
          const me = this
          this.$confirm({
            title: '将新主机连接到此集群中？',
            onOk () {
              me.loading = true
              console.log(me.selectedRowKeys)
              me.$http.post('/category/delete', me.selectedRowKeys).then(resJson => {
                me.loading = false
                me.$message.success('删除成功!')
                me.getDataList()
              })
                .catch(err => {
                  me.$message.error('删除失败:' + err.response.data.message)
                  me.loading = false
                })
            }
          })
        }
      })
    },
    addProductSpec () {
      const nextKeys = this.keys.concat(id++)
      this.keys = nextKeys
    },
    removeProductSpec (k) {
      if (this.keys.length === 0) {
        return
      }
      this.keys = this.keys.filter(key => key !== k)
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

  span {
    margin-right: 240px;
  }
}

.ha-radio {
  text-align: center;

  span {
    margin-right: 230px;
  }
}
</style>
