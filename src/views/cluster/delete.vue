<template>
  <a-modal
    title="Title"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <p>{{ ModalText }}</p>
  </a-modal>
</template>

<script>
export default {
  props: {
    afterSubmit: {
      type: Function,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      ModalText: '删除集群同时从表格中移除主机、虚拟机。是否删除此集群',
      Title: '删除集群'
    }
  },
  methods: {
    showModal () {
      this.visible = true
    },
    handleOk (e) {
      this.ModalText = '两秒后关闭'
      this.confirmLoading = true
      setTimeout(() => {
        this.visible = false
        this.confirmLoading = false
      }, 2000)
      this.afterSubmit()
    },
    handleCancel (e) {
      console.log('Clicked cancel button')
      this.visible = false
    }
  }
}
</script>

<style lang='less' scoped>

</style>
