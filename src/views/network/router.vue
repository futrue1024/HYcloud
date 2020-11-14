<template>
  <a-card :bordered="false" class="table-operator-layout">
    <div class="table-operator">
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="分布式交换机">
          <DistributedSwitch/>
        </a-tab-pane>
        <a-tab-pane key="2" tab="虚拟端口" force-render>
          <VirtualPort/>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-card>
</template>

<script>
import DistributedSwitch from './DistributedSwitch'
import VirtualPort from './VirtualPort'

export default {
  components: {
    DistributedSwitch,
    VirtualPort
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
