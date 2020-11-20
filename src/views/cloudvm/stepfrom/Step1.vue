<template>
  <div>
    <a-form :form="form" style="max-width: 500px; margin: 40px auto 0;">
      <a-form-item :wrapperCol="{span: 16, offset: 5}">
        <div class="radio">
          <div style="font-size: 20px;white-space: nowrap;margin-right: 20px">选择类型：</div>
          <div class="select">
            <a-radio-group
              v-model="value"
              @change="onDrsChange"
              :options="options"
              style="white-space: nowrap;transform: scale(1.2);">
            </a-radio-group>
          </div>
        </div>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 20, offset: 10}">
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
const options = [
  { label: '创建新虚拟机', value: 1 },
  { label: '以模板创建虚拟机', value: 2 }
]
export default {
  name: 'Step1',
  data () {
    return {
      options,
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      value: 1
    }
  },
  methods: {
    nextStep () {
      const { form: { validateFields } } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          this.$emit('nextStep')
        }
      })
    },
    onDrsChange (e) {
      console.log(e.target.value)
    }
  }
}
</script>

<style lang="less" scoped>
.radio {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.step-form-style-desc {
  padding: 0 56px;
  color: rgba(0, 0, 0, .45);

  h3 {
    margin: 0 0 12px;
    color: rgba(0, 0, 0, .45);
    font-size: 16px;
    line-height: 32px;
  }

  h4 {
    margin: 0 0 4px;
    color: rgba(0, 0, 0, .45);
    font-size: 14px;
    line-height: 22px;
  }

  p {
    margin-top: 0;
    margin-bottom: 12px;
    line-height: 22px;
  }
}
</style>
