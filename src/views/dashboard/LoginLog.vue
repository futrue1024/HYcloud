<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" style="margin-bottom:10px;">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="登陆时间：">
              <a-range-picker
                :format="dateFormat"
                :placeholder="['登陆开始日期', '登陆结束日期']"
                v-model="queryParam.loginDateRange"
              />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-button type="primary" @click="getDataList" :loading="loading" icon="search">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-table
      ref="table"
      :columns="columns"
      :rowKey="row => row.id"
      :dataSource="data"
      :pagination="pagination"
      :loading="loading"
      :bordered="true"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      @change="handleTableChange"
      size="small">
    </a-table>
  </a-card>
</template>

<script>
import moment from 'moment'
const columns = [
  { title: '登录结果', dataIndex: 'result' },
  { title: '操作时间', dataIndex: 'createTime', width: '150px' }
]

export default {
  mounted () {
    this.getDataList()
  },
  data () {
    return {
      dateFormat: 'YYYY-MM-DD',
      data: [],
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total, range) => `记录：${total} 条`
      },
      filters: {},
      sorter: { field: 'createTime', order: 'ascend' },
      loading: false,
      columns,
      queryParam: {
        loginDateRange: null
      },
      selectedRowKeys: []
    }
  },
  methods: {
    moment,
    // 拉取表格数据
    getDataList () {
      this.loading = true
      this.$http.post('/log/login/search', {
        pageIndex: this.pagination.current,
        pageSize: this.pagination.pageSize,
        sortField: this.sorter.field,
        sortType: this.sorter.order,
        ...this.queryParam,
        ...this.filters
      }).then(resJson => {
        this.loading = false
        this.data = resJson.result.datas
        const pagination = { ...this.pagination }
        pagination.total = resJson.result.records
        this.pagination = pagination
      })
      .catch(err => {
        this.$message.error('加载失败:' + err.response.data.message)
        this.loading = false
      })
    },
    // 复选框选择事件
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 页码改变事件
    handleTableChange (pagination, filters, sorter) {
      this.pagination = { ...pagination }
      this.filters = { ...filters }
      this.sorter = { ...sorter }
      this.getDataList()
    }
  }
}
</script>
