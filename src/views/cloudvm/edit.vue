<template>
  <a-modal
    :title="showTitle"
    width="40%"
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
    <AddVmEdit ref="AddVmEdit" :afterSubmit="afterSubmit"></AddVmEdit>
    <div class="radio">
      <div>选择类型：</div>
      <div>
        <a-radio-group v-model="value" @change="onDrsChange">
          <a-radio :value="1">
            创建新虚拟机
          </a-radio>
          <a-radio :value="2">
            以模板创建虚拟机
          </a-radio>
        </a-radio-group>
      </div>
    </div>
  </a-modal>
</template>

<script>
import AddVmEdit from './addVmEdit'

export default {
  components: {
    AddVmEdit
  },
  props: {
    afterSubmit: {
      type: Function,
      default: null
    },
    add3: {
      type: Number,
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
      this.showTitle = '选择创建云虚拟机类型'
      this.visible = true
      this.form.resetFields()
    },
    handleCancel () {
      this.visible = false
    },
    handleOk (e) {
      if (this.value === 1) {
        this.loading = true
        this.$refs.AddVmEdit.add()
        this.loading = false
      } else {
        this.loading = true
        this.$refs.AddVmEdit.edit()
        this.loading = false
      }
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
.radio {
  display: flex;
  flex-direction: row;
  justify-content: center;

  span {
    margin-right: 240px;
    white-space: nowrap;
  }
}

</style>
