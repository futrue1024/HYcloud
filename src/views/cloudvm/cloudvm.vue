<template>
  <a-card :bordered="false" class="table-operator-layout">
    <div class="table-operator">
      <rightButton
        type="primary"
        icon="plus"
        :click="addData"
        code="role-add">创建云虚拟机
      </rightButton>
      <rightButton
        type="primary"
        icon="plus"
        :click="stepAdd"
        code="role-add">测试
      </rightButton>
      <rightButton
        type="primary"
        icon="setting"
        :click="vmMigrate"
        code="role-add">云虚拟机迁移
      </rightButton>
      <a-dropdown>
        <a-menu slot="overlay" @click="drsHandleMenuClick">
          <a-menu-item key="DRS1">打开电源</a-menu-item>
          <a-menu-item key="DRS2">关闭电源</a-menu-item>
          <a-menu-item key="DRS3">重启云虚拟机</a-menu-item>
          <a-menu-item key="DRS4">重置云虚拟机</a-menu-item>
        </a-menu>
        <a-button type="primary">
          电源管理
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
      <a-dropdown>
        <a-menu slot="overlay" @click="haHandleMenuClick">
          <a-menu-item key="HA1">生成快照</a-menu-item>
          <a-menu-item key="HA2">快照管理</a-menu-item>
          <a-menu-item key="HA3">恢复快照</a-menu-item>
          <a-menu-item key="HA4">删除快照</a-menu-item>
        </a-menu>
        <a-button type="primary">
          快照管理
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
      <rightButton
        type="primary"
        icon="laptop"
        code="role-delete">远程控制台
      </rightButton>
      <a-dropdown>
        <a-menu slot="overlay" @click="moreHandleMenuClick">
          <a-menu-item key="1">云虚拟机克隆</a-menu-item>
          <a-menu-item key="2">转化为模板</a-menu-item>
          <a-menu-item key="3">删除</a-menu-item>
          <a-menu-item key="4">重命名</a-menu-item>
        </a-menu>
        <a-button type="primary">
          更多
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
      <a-button type="primary" :disabled="!hasSelected" @click="start">
        详情
      </a-button>
    </div>
    <edit-form ref="editForm" :afterSubmit="getDataList"></edit-form>
    <step-from ref="stepFrom" :afterSubmit="getDataList"></step-from>
    <edit-table-item ref="editTableItem" :after-submit="getDataList" :dataItem="dataItem"></edit-table-item>
    <vm-migrate ref="vmMigrate" :afterSubmit="getDataList"></vm-migrate>
    <div class="table">
      <a-table
        ref="table"
        :columns="columns"
        :rowKey="(row) => row.id"
        :dataSource="data"
        :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :pagination="pagination"
        :loading="loading"
        :bordered="true"
        @change="handleTableChange"
        size="small"
      >
      </a-table>
    </div>
  </a-card>
</template>

<script>
import editForm from './edit.vue'
import editTableItem from './editTableItem.vue'
import vmMigrate from './vmMigrate.vue'
import stepFrom from './stepfrom/stepfrom.vue'
import rightButton from '@/components/tools/RightButton'

const columns = [
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '状态',
    dataIndex: 'state'
  },
  {
    title: '电源状态',
    dataIndex: 'powerState'
  },
  {
    title: 'IP地址',
    dataIndex: 'IP地址'
  },
  {
    title: '所属集群',
    dataIndex: '所属集群'
  },
  {
    title: '所属主机',
    dataIndex: 'vmHostId'
  }
]

function toPercent (point) {
  let str = Number(point * 100).toFixed(2)
  str += '%'
  return str
}

export default {
  components: { rightButton, editForm, vmMigrate, editTableItem, stepFrom },
  data () {
    return {
      toPercent,
      columns,
      selectedRowKeys: [],
      data: [],
      dataItem: {},
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total, range) => `记录：${total} 条`
      },
      filters: {},
      sorter: { field: 'Id', order: 'ASC' },
      loading: false
    }
  },
  computed: {
    hasSelected () {
      return this.selectedRowKeys.length > 0
    }
  },

  mounted () {
    this.getDataList()
  },
  methods: {
    // 按钮下拉
    drsHandleMenuClick (e) {
      console.log('click', e)
    },
    haHandleMenuClick (e) {
      console.log('click', e)
    },
    moreHandleMenuClick (e) {
      console.log('click', e.key)
    },
    handleChange (value) {
      console.log(value)
    },
    handleTableChange (pagination, filters, sorter) {
      this.pagination = { ...pagination }
      // this.filters = { ...filters }
      this.sorter = { ...sorter }
      this.getDataList()
    },
    getDataList () {
      this.loading = true
      const queryJson = {
        pageIndex: this.pagination.current,
        pageSize: this.pagination.pageSize,
        sortField: this.sorter.field,
        sortType: this.sorter.order
      }
      this.$http
        .post('/Info/vm', queryJson)
        .then((resJson) => {
          this.loading = false
          this.data = resJson.result.datas
          for (let i = 0; i < this.data.length; i++) {
            this.powerStateChange(this.data[i].powerState, i)
          }
          const pagination = { ...this.pagination }
          pagination.total = resJson.result.records
          this.pagination = pagination
        })
        .catch((err) => {
          this.$message.error('加载失败:' + err.response.message)
          this.loading = false
        })
    },
    powerStateChange (powerState, i) {
      if (powerState === 0) {
        this.data[i].powerState = '关机'
      } else if (powerState === 1) {
        this.data[i].powerState = '开机'
      } else if (powerState === 2) {
        this.data.state = '待机'
      } else if (powerState === 3) {
        this.data[i].state = '无连接'
      }
    },
    addData () {
      this.$refs.editForm.add()
    },
    vmMigrate () {
      this.$refs.vmMigrate.migrateData()
    },
    stepAdd () {
      this.$refs.stepFrom.add()
    },
    start () {
      // this.loading = true
      this.$refs.editTableItem.add()
      // ajax request after empty completing
      // setTimeout(() => {
      //   this.loading = false
      //   this.selectedRowKeys = []
      // }, 1000)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
      this.dataItem = selectedRows[0]
      console.log('item', this.dataItem)
    }
  }
}
</script>

<style lang='less' scoped>
</style>
