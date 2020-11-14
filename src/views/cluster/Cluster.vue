<template>
  <a-card :bordered="false" class="table-operator-layout">
    <div class="table-operator">
      <rightButton
        type="primary"
        icon="plus"
        :click="addData"
        code="role-add">创建
      </rightButton>
      <rightButton
        type="danger"
        icon="delete"
        code="role-delete">删除
      </rightButton>
      <a-dropdown>
        <a-menu slot="overlay" @click="drsHandleMenuClick">
          <a-menu-item key="DRS1">开启</a-menu-item>
          <a-menu-item key="DRS2">关闭</a-menu-item>
        </a-menu>
        <a-button type="primary">
          vSphere DRS
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
      <a-dropdown>
        <a-menu slot="overlay" @click="haHandleMenuClick">
          <a-menu-item key="HA1">开启</a-menu-item>
          <a-menu-item key="HA2">关闭</a-menu-item>
        </a-menu>
        <a-button type="primary">
          vSphere HA
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
      <a-dropdown>
        <a-menu slot="overlay" @click="moreHandleMenuClick">
          <a-menu-item key="1">重命名</a-menu-item>
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
    title: '集群名称',
    dataIndex: 'name'
  },
  {
    title: '所属数据中心',
    dataIndex: '所属数据中心'
  },
  {
    title: '主机数量',
    dataIndex: '主机数量'
  },
  {
    title: 'DRS开启状态',
    dataIndex: 'drsEnabled'
  },
  {
    title: 'HA开启状态',
    dataIndex: 'haEnabled'
  }
]
const rowSelection = {
  onSelect: (record, selected, selectedRows) => {
    console.log(record)
    console.log(selectedRows)
  }
}
export default {
  components: { rightButton, editForm },
  data () {
    return {
      columns,
      rowSelection,
      data: [],
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
        .post('/Info/cluster', queryJson)
        .then((resJson) => {
          this.loading = false
          this.data = resJson.result.datas
          for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].drsEnabled === false) {
              this.data[i].drsEnabled = '未开启'
            } else if (this.data[i].drsEnabled === true) {
              this.data[i].drsEnabled = '已开启'
            }
            if (this.data[i].haEnabled === true) {
              this.data[i].haEnabled = '已开启'
            } else if (this.data[i].haEnabled === false) {
              this.data[i].haEnabled = '未开启'
            }
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
    addData () {
      this.$refs.editForm.add()
    }
  }
}
</script>

<style lang='less' scoped>
</style>
