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
        <a-form-item v-if="isAdd">
          <a-select
            mode="multiple"
            labelInValue
            :value="selectedUserList"
            placeholder="输入关键字查询用户，然后选择要发送的用户"
            style="width: 100%"
            :filterOption="false"
            @search="fetchUser"
            @change="userChange"
            v-decorator="[
              'receiverIds',
              {
                rules: [
                  { required: true, message: '请选择至少一个用户!', type: 'array' },
                ],
              },
            ]"
          >
            <a-select-option v-for="d in userList" :key="d.value">{{ d.text }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input
            :disabled="!isAdd"
            v-decorator="[
              'title',
              { rules: [{ required: true, message: '请输入标题!' }] },
            ]"
            placeholder="站内信标题"
          >
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-textarea
            :disabled="!isAdd"
            v-decorator="[
              'contents',
              { rules: [{ required: true, message: '请输入内容!' }] },
            ]"
            placeholder="站内信内容"
            :rows="8"
          >
          </a-textarea>
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
      rules: validateRules,
      // 用户列表
      userList: [],
      // 选择的用户列表
      selectedUserList: []
    }
  },
  methods: {
    add () {
      this.showTitle = '发送站内信'
      this.isAdd = true
      this.entity = {}
      this.visible = true
      this.form.resetFields()
    },
    view (id) {
      this.showTitle = '详情'
      this.isAdd = false
      this.visible = true
      this.$nextTick(() => {
        this.formFields = this.form.getFieldsValue()
        this.$http.get('/message/' + id, { }).then(resJson => {
          this.entity = resJson.result
          var setData = {}
          Object.keys(this.formFields).forEach(item => {
              setData[item] = this.entity[item]
          })
          this.form.setFieldsValue(setData)
          this.readMessage(id)
        })
        .catch(err => {
          this.$message.error('加载失败:' + err.response.data.message)
        })
      })
    },
    handleSubmit () {
      if (!this.isAdd) {
        this.handleCancel()
        return
      }
      this.form.validateFields((errors, values) => {
        // 校验成功
        if (!errors) {
          const postUrl = this.isAdd ? '/message/create' : '/message/edit'
          this.entity = Object.assign(this.entity, this.form.getFieldsValue())
          this.entity.receiverIds = this.entity.receiverIds.map(user => user.key)
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
    // 搜索用户
    fetchUser (value) {
      this.confirmLoading = true
      this.$http.post('/user/search', {
        pageIndex: 1,
        pageSize: 10,
        name: value
      }).then(resJson => {
        this.confirmLoading = false
        const list = resJson.result.datas.map(user => ({
          text: user.companyName + '-' + user.name,
          value: user.id
        }))
        this.userList = [{ text: '所有人', value: '-1' }, ...list]
      })
      .catch(err => {
        this.$message.error('用户加载失败:' + err.response.data.message)
        this.confirmLoading = false
      })
    },
    // 选中用户改变
    userChange (value) {
      Object.assign(this, {
        selectedUserList: value,
        userList: []
      })
    },
    // 阅读
    readMessage (id) {
      this.$http.post('/message/read', [id]).then(resJson => {})
    }
  }
}
</script>
