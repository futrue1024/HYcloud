<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">

        <a-form :form="form" layout="vertical">
          <a-form-item
            label="原始密码"
          >
            <a-input autoSize type="password" v-decorator="['oldPassword', { rules: [{ required: true, message: '请输入原始密码' }] }]" placeholder="请输入原始密码" />
          </a-form-item>

          <a-form-item
            label="新密码"
          >
            <a-input autoSize type="password" v-decorator="['newPassword', { rules: [{ required: true, message: '请输入新密码' }] }]" placeholder="请输入新密码" />
          </a-form-item>

          <a-form-item
            label="确认密码"
          >
            <a-input autoSize type="password" v-decorator="['confirmPassword', { rules: [{ required: true, message: '请输入确认密码' }, {validator: compareToFirstPassword, trigger: 'change'}] }]" placeholder="请输入确认密码" />
          </a-form-item>

          <a-form-item>
            <a-button type="primary" style="margin-left: 8px" :loading="loading" @click="changePassword">确认修改</a-button>
          </a-form-item>
        </a-form>

      </a-col>

    </a-row>

  </div>
</template>

<script>
import validateRules from '@/utils/validate/common.js'

export default {
  data () {
    return {
      loading: false,
      form: this.$form.createForm(this),
      entity: {},
      formFields: {},
      rules: validateRules
    }
  },
  methods: {
    compareToFirstPassword (rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('newPassword')) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    },
    changePassword () {
      this.form.validateFields(err => {
        if (!err) {
          this.loading = true
          this.entity = Object.assign(this.entity, this.form.getFieldsValue())
          this.$http.post('/user/changepassword', this.entity).then(resJson => {
            this.loading = false
            this.$message.success('密码修改成功!')
          })
          .catch(err => {
            this.$message.error(err.response.data.message)
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
