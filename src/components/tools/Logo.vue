<template>
  <div class="logo" style="padding-left: 70px">
    <router-link :to="{name:'switch'}">
      <img src="../../assets/hylogo.png" alt="华云" style="margin-right: 6px">
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
import LogoSvg from '@/assets/logo.svg?inline'

export default {
  name: 'Logo',
  components: {
    LogoSvg
  },
  props: {
    title: {
      type: String,
      default: '华云网络科技',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
