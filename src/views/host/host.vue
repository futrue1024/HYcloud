<template>
  <a-card :bordered="false" class="table-operator-layout">
    <div class="table-operator">
      <rightButton
        type="primary"
        icon="plus"
        :click="addData"
        code="role-add">添加主机
      </rightButton>
      <rightButton
        type="danger"
        icon="delete"
        :click="deleteData"
        code="role-delete">移除主机
      </rightButton>
      <rightButton
        type="primary"
        icon="tool"
        code="role-add">维护
      </rightButton>
      <rightButton
        type="primary"
        icon="key"
        code="1">解除维护
      </rightButton>
      <a-dropdown>
        <a-menu slot="overlay" @click="moreHandleMenuClick">
          <a-menu-item key="1">打开电源</a-menu-item>
          <a-menu-item key="2">重启</a-menu-item>
          <a-menu-item key="3">关机</a-menu-item>
        </a-menu>
        <a-button type="primary">
          更多
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
    </div>
    <edit-form ref="editForm" :afterSubmit="getDataList"></edit-form>
    <div class="table">
      <a-table
        ref="table"
        :columns="columns"
        :rowKey="(row) => row.id"
        :dataSource="data"
        :row-selection="rowSelection"
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
import rightButton from '@/components/tools/RightButton'

const columns = [
  {
    title: '主机名称',
    dataIndex: 'name'
  },
  {
    title: '所属集群',
    dataIndex: 'parentId'
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
    title: 'CPU利用率',
    dataIndex: 'cpuUsageMhz'
  },
  {
    title: '内存使用率',
    dataIndex: 'memoryUsageGB'
  },
  {
    title: '版本',
    dataIndex: 'version'
  }

]
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log('3', selectedRows)
    console.log('4', selectedRowKeys)
  }
}

function toPercent (point) {
  let str = Number(point * 100).toFixed(2)
  str += '%'
  return str
}

export default {
  components: { rightButton, editForm },
  data () {
    return {
      toPercent,
      columns,
      rowSelection,
      data: [],
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `记录：${total} 条`
      },
      filters: {},
      sorter: { field: 'Id', order: 'ASC' },
      loading: false
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
      console.log('click', e)
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
        .post('/Info/host', queryJson)
        .then((resJson) => {
          this.loading = false
          this.data = resJson.result.datas
          for (let i = 0; i < this.data.length; i++) {
            const numCpu = resJson.result.datas[i].cpuUsageMhz / resJson.result.datas[i].cpuTotalMhz
            const numMemory = resJson.result.datas[i].memoryUsageGB / resJson.result.datas[i].memoryTotalGB
            this.data[i].cpuUsageMhz = this.toPercent(numCpu)
            this.data[i].memoryUsageGB = this.toPercent(numMemory)
            this.stateChange(this.data[i].state, i)
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
    stateChange (state, i) {
      if (state === 0) {
        this.data[i].state = '连接'
      } else if (state === 1) {
        this.data[i].state = '断开'
      } else if (state === 2) {
        this.data.state = '无响应'
      } else if (state === 3) {
        this.data[i].state = '维护'
      }
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
    deleteData () {
      const me = this
      this.$confirm({
        title: '确认要删除选中的主机吗?',
        onOk () {
          me.loading = true
          console.log(me.selectedRowKeys)
          me.$http.post('/category/delete', me.selectedRowKeys).then(resJson => {
            me.loading = false
            me.$message.success('删除成功!')
            me.getDataList()
          })
            .catch(err => {
              me.$message.error('删除失败:' + err.response.data.message)
              me.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
</style>
