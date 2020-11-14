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
        :click="addData"
        code="role-add">删除
      </rightButton>
      <rightButton
        type="primary"
        icon="edit"
        :click="addData"
        code="role-add">编辑
      </rightButton>
      <rightButton
        type="primary"
        icon="setting"
        :click="addData"
        code="role-add">管理虚拟机
      </rightButton>
    </div>
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
    title: '逻辑交换机ID',
    dataIndex: 'name'
  },
  {
    title: 'VXLAN',
    dataIndex: 'VXLAN'
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '状态',
    dataIndex: '状态'
  },
  {
    title: '传输区域',
    dataIndex: '传输区域'
  },
  {
    title: '已连接虚拟机数',
    dataIndex: '已连接虚拟机数'
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
