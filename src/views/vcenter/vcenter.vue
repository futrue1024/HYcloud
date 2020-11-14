<template>
  <a-card :bordered="false" class="table-operator-layout">
    <div class="table-operator">
      <rightButton
        type="primary"
        icon="plus"
        :click="addData"
        code="role-add">添加
      </rightButton>
      <rightButton
        type="danger"
        icon="delete"
        code="role-delete">删除
      </rightButton>
      <rightButton
        type="danger"
        icon="delete"
        code="role-delete">编辑
      </rightButton>
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
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: 'IP地址',
    dataIndex: 'IP地址'
  },
  {
    title: '版本',
    dataIndex: '版本'
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
