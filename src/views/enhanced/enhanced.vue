<template>
  <a-card :bordered="false" class="table-operator-layout">
    <div class="table-operator">
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="逻辑交换机">
          <LogicalSwitch/>
        </a-tab-pane>
        <a-tab-pane key="2" tab="虚拟服务网关" force-render>
          <VirtualGateway/>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-card>
</template>

<script>
import LogicalSwitch from './LogicalSwitch.vue'
import VirtualGateway from './VirtualGateway.vue'

export default {
  components: {
    LogicalSwitch,
    VirtualGateway
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
