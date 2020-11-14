<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">

        <a-form :form="form" layout="vertical">
          <a-form-item
            label="姓名"
          >
            <a-input autoSize v-decorator="['name', { rules: [{ required: true, message: '请输入姓名' }] }]" placeholder="给自己起个名字" />
          </a-form-item>

          <a-form-item
            label="电子邮件"
            :required="false"
          >
            <a-input autoSize v-decorator="['email', { rules: [{ required: true, message: '请输入邮箱' }, { validator: rules.email, trigger: 'blur' }] }]" placeholder="exp@admin.com" />
          </a-form-item>

          <a-form-item
            label="联系电话"
            :required="false"
          >
            <a-input autoSize v-decorator="['phone', { rules: [{ required: true, message: '请输入联系电话' }, { validator: rules.phone, trigger: 'blur' }] }]" placeholder="手机或者座机" />
          </a-form-item>

          <a-form-item
            label="座右铭"
          >
            <a-textarea rows="4" v-decorator="['motto']" placeholder="You are not alone."/>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" style="margin-left: 8px" :loading="loading" @click="saveProfile">保存</a-button>
          </a-form-item>
        </a-form>

      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" @click="$refs.modal.edit(1)" >
          <a-icon type="cloud-upload-o" class="upload-icon"/>
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="option.img"/>
        </div>
      </a-col>

    </a-row>

    <avatar-modal ref="modal" @ok="setavatar"/>

  </div>
</template>

<script>
import AvatarModal from './AvatarModal'
import validateRules from '@/utils/validate/common.js'

export default {
  components: {
    AvatarModal
  },
  mounted () {
    this.getUserProfile()
  },
  data () {
    return {
      loading: false,
      form: this.$form.createForm(this),
      userProfile: {},
      formFields: {},
      rules: validateRules,
      // cropper
      preview: {},
      option: {
        img: '/avatar2.jpg',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      }
    }
  },
  methods: {
    setavatar (url) {
      this.option.img = url
    },
    getUserProfile () {
      this.formFields = this.form.getFieldsValue()
      this.$http.get('/user/profile', { }).then(resJson => {
        this.userProfile = resJson.result
        var setData = {}
        Object.keys(this.formFields).forEach(fieldKey => {
            setData[fieldKey] = this.userProfile[fieldKey]
        })
        this.form.setFieldsValue(setData)
      })
      .catch(err => {
        this.$message.error('用户数据加载失败:' + err.response.data.message)
      })
    },
    saveProfile () {
      this.form.validateFields(err => {
        if (!err) {
          this.loading = true
          this.userProfile = Object.assign(this.userProfile, this.form.getFieldsValue())
          this.$http.put('/user/profile', this.userProfile).then(resJson => {
            this.loading = false
            this.$message.success('保存成功!')
          })
          .catch(err => {
            this.$message.error('保存失败:' + err.response.data.message)
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
