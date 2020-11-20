<template>
  <a-modal
    :title="showTitle"
    width="80%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-steps class="steps" :current="currentTab">
      <a-step title="选择创建类型"/>
      <a-step title="填写虚拟机信息"/>
      <a-step title="确认虚拟机信息"/>
    </a-steps>
    <div class="content">
      <step1 v-if="currentTab === 0" @nextStep="nextStep"/>
      <step2 v-if="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep" @dataSource="dataSource"/>
      <step3 v-if="currentTab === 2" @prevStep="prevStep" @finish="finish" :dataSource="data"/>
    </div>
  </a-modal>
</template>

<script>
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

export default {
  name: 'StepForm',
  components: {
    Step1,
    Step2,
    Step3
  },
  data () {
    return {
      currentTab: 0,
      form: null,
      visible: false,
      showTitle: '',
      confirmLoading: false,
      data: []
    }
  },
  methods: {
    add () {
      this.showTitle = '创建云虚拟机'
      this.visible = true
    },
    // handler
    nextStep () {
      if (this.currentTab < 2) {
        this.currentTab += 1
      }
    },
    prevStep () {
      if (this.currentTab > 0) {
        this.currentTab -= 1
      }
    },
    finish () {
      this.currentTab = 0
    },
    dataSource (data) {
      console.log(data)
      this.data = data
      this.data[0].key = 1
      console.log('2222', this.data)
    },
    handleCancel () {
      this.visible = false
      this.currentTab = 0
    }
  }
}
</script>

<style lang="less" scoped>
.steps {
  max-width: 750px;
  margin: 16px auto;
}
</style>
