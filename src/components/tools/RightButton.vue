<template>
  <a-button
    :code="code"
    :type="type"
    :loading="loading"
    :disabled="disabled"
    :icon="icon"
    @click="doClick"
    v-show="showButton">
    <slot></slot>
  </a-button>
</template>

<script>

export default {
  name: 'RightButton',
  props: {
    code: {
      type: String,
      default: '',
      required: true
    },
    icon: {
      type: String,
      default: '',
      required: false
    },
    type: {
      type: String,
      default: 'primary',
      required: false
    },
    loading: {
      type: Boolean,
      default: false,
      required: false
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    click: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      showButton: true
    }
  },
  // mounted () {
  //   this.hasPermission()
  // },
  methods: {
    doClick () {
      if (this.click) {
        this.click()
      }
    }
    // 检查后台是否有权限
    // hasPermission () {
    //   if (this.code === '') {
    //     this.showButton = false
    //   } else {
    //     this.$http.get('/user/has/permission/' + this.code, {}).then(resJson => {
    //       this.showButton = resJson.result
    //     })
    //   }
    // }
  }
}
</script>
