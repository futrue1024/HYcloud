<template>
  <a-card :bordered="false" class="table-operator-layout">
    <div class="table-operator">
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="镜像仓库">
          <mirror/>
        </a-tab-pane>
        <a-tab-pane key="2" tab="虚拟机模板" force-render>
          <vm-template/>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-card>
</template>

<script>
import Mirror from './mirror.vue'
import vmTemplate from './vmTemplate.vue'

export default {
  components: {
    Mirror,
    vmTemplate
  },
  data () {
    return {}
  },
  methods: {
    callback (key) {
      console.log(key)
    }
  }
}
</script>

<style lang='less' scoped>
</style>
