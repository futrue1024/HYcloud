<template>
  <a-card :bordered="false" class="table-operator-layout">
    <div class="table-operator">
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="2" tab="数据存储" force-render>
          数据存储
        </a-tab-pane>
        <a-tab-pane key="1" tab="存储设备">
          <device/>
        </a-tab-pane>
        <a-tab-pane key="3" tab="虚拟存储策略">
          虚拟存储策略
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-card>
</template>

<script>
import device from './device'

export default {
  components: {
    device
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
