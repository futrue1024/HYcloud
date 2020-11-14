<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <rightButton
        type="primary"
        icon="plus"
        :click="addData"
        code="company-add">添加</rightButton>
      <rightButton
        type="default"
        icon="edit"
        :click="editData"
        code="company-edit"
        :loading="loading"
        :disabled="selectedRowKeys.length === 0">编辑</rightButton>
      <rightButton
        type="danger"
        icon="delete"
        :click="deleteData"
        code="company-delete"
        :loading="loading"
        :disabled="selectedRowKeys.length === 0">删除</rightButton>
    </div>

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParam.companyName" placeholder="名称" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="联系人">
              <a-input v-model="queryParam.contact" placeholder="联系人" />
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
      <template slot="isSystem" slot-scope="isSystem">
        <a-tag color="#87d068" v-show="isSystem">系统账号</a-tag>
        <a-tag v-show="!isSystem">普通账号</a-tag>
      </template>
    </a-table>

    <edit-form ref="editForm" :afterSubmit="getDataList"></edit-form>
  </a-card>
</template>

<script>
import editForm from './edit'
import rightButton from '@/components/tools/RightButton'

const columns = [
  { title: '公司名称', dataIndex: 'companyName', width: '30%' },
  { title: '联系人', dataIndex: 'contact', width: '100px' },
  { title: '联系电话', dataIndex: 'contactPhone', width: '150px' },
  { title: '地址', dataIndex: 'address' },
  { title: '系统公司', dataIndex: 'isSystem', width: '90px', align: 'center', scopedSlots: { customRender: 'isSystem' } },
  { title: '创建时间', dataIndex: 'createTime', width: '150px', sorter: true }
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
      sorter: { field: 'createTime', order: 'ascend' },
      loading: false,
      columns,
      queryParam: {},
      selectedRowKeys: []
    }
  },
  methods: {
    // 拉取表格数据
    getDataList () {
      this.loading = true
      this.$http.post('/company/search', {
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
    },
    // 重置搜索条件
    resetSearch () {
      this.queryParam = {}
      this.getDataList()
    },
    // 添加
    addData () {
      this.$refs.editForm.add()
    },
    // 编辑
    editData () {
      const length = this.selectedRowKeys.length
      if (length === 0) {
        this.$message.error('请选择要编辑的数据')
        return
      }
      const id = this.selectedRowKeys[length - 1]
      this.$refs.editForm.edit(id)
    },
    // 删除
    deleteData () {
      const me = this
      let hasSystem = false
      me.data.forEach(function (item, index) {
        if (me.selectedRowKeys.indexOf(item.id) !== -1) {
          if (item.isSystem) {
            hasSystem = true
          }
        }
      })
      if (hasSystem) {
        me.$message.error('系统公司不允许删除')
        return
      }
      this.$confirm({
        title: '确认删除吗?',
        onOk () {
          me.loading = true
          me.$http.post('/company/delete', me.selectedRowKeys).then(resJson => {
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
