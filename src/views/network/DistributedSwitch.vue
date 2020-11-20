<template>
  <a-card :bordered="false" class="table-operator-layout">
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
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '版本',
    dataIndex: 'version'
  },
  {
    title: '所属VC',
    dataIndex: '所属VC'
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
      name: [],
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
        .post('/Info/vdswitch', queryJson)
        .then((resJson) => {
          this.loading = false
          this.data = resJson.result.datas
          this.data.map(item => this.name.push(item.name))
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

<style lang='less'>

</style>
