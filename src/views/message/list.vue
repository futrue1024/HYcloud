<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <rightButton
        type="primary"
        icon="plus"
        :click="addData"
        code="message-send">发送站内信</rightButton>
      <rightButton
        type="default"
        icon="edit"
        :click="readData"
        code="message-read"
        :loading="loading"
        :disabled="selectedRowKeys.length === 0 || queryParam.queryType === '1'">标记为已读</rightButton>
    </div>

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="标题">
              <a-input v-model="queryParam.companyName" placeholder="标题" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="类型">
              <a-select style="width: 120px" v-model="queryParam.queryType">
                <a-select-option value="1">我发送的</a-select-option>
                <a-select-option value="2">我接收的</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="getDataList" :loading="loading" icon="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetSearch" :loading="loading" icon="reload">重置</a-button>
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
      <template slot="status" slot-scope="status">
        <a-tag color="#f50" v-if="queryParam.queryType == '2' && status==2">已删除</a-tag>
        <a-tag color="#87d068" v-if="queryParam.queryType == '2' && status==1">已读</a-tag>
        <a-tag color="#2db7f5" v-if="queryParam.queryType == '2' && status==0">未读</a-tag>
      </template>
      <template slot="readDate" slot-scope="text, record">
        <a-tag color="#f50" v-if="queryParam.queryType == '2' && record.readDate != null">{{ record.readDate }}</a-tag>
      </template>
      <a-tag slot="operation" slot-scope="text, record" color="#f50" @click="viewData(record.id)">查看</a-tag>
    </a-table>

    <edit-form ref="editForm" :afterSubmit="getDataList"></edit-form>
  </a-card>
</template>

<script>
import editForm from './edit'
import rightButton from '@/components/tools/RightButton'

const columns = [
  { title: '标题', dataIndex: 'title' },
  { title: '发送人', dataIndex: 'sender', width: '150px' },
  { title: '状态', dataIndex: 'status', width: '90px', align: 'center', scopedSlots: { customRender: 'status' } },
  { title: '查看时间', dataIndex: 'readDate', width: '150px', align: 'center', scopedSlots: { customRender: 'readDate' } },
  { title: '发送对象', dataIndex: 'sendTypeName', width: '150px' },
  { title: '发送时间', dataIndex: 'sendTime', width: '150px', sorter: true },
  { title: '操作', key: 'operation', width: '60px', align: 'center', scopedSlots: { customRender: 'operation' } }
]

export default {
  components: {
    editForm,
    rightButton
  },
  mounted () {
    this.getDataList()
  },
  data () {
    return {
      data: [],
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total, range) => `记录：${total} 条`
      },
      filters: {},
      sorter: { field: 'sendTime', order: 'ascend' },
      loading: false,
      columns,
      queryParam: { queryType: '2' },
      selectedRowKeys: []
    }
  },
  methods: {
    // 拉取表格数据
    getDataList () {
      this.loading = true
      const parmas = {
        pageIndex: this.pagination.current,
        pageSize: this.pagination.pageSize,
        sortField: this.sorter.field,
        sortType: this.sorter.order,
        ...this.queryParam,
        ...this.filters
      }
      parmas.queryType = parseInt(parmas.queryType)
      this.$http.post('/message/search', parmas).then(resJson => {
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
    },
    // 重置搜索条件
    resetSearch () {
      this.queryParam = { queryType: '2' }
      this.getDataList()
    },
    // 添加
    addData () {
      this.$refs.editForm.add()
    },
    // 查看
    viewData (id) {
      this.$refs.editForm.view(id)
    },
    // 标记为已读
    readData () {
      const me = this
      this.$confirm({
        title: '确认标记为已读吗?',
        onOk () {
          me.loading = true
          me.$http.post('/message/read', me.selectedRowKeys).then(resJson => {
            me.loading = false
            me.$message.success('标记成功!')
            me.getDataList()
          })
          .catch(err => {
            me.$message.error('标记失败:' + err.response.data.message)
            me.loading = false
          })
        }
      })
    }
  }
}
</script>
