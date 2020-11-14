<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <rightButton
        type="primary"
        icon="plus"
        :click="addData"
        code="menu-add">添加</rightButton>
      <rightButton
        type="default"
        icon="edit"
        :click="editData"
        code="menu-edit"
        :loading="loading"
        :disabled="selectedRowKeys.length === 0">编辑</rightButton>
      <rightButton
        type="danger"
        icon="delete"
        :click="deleteData"
        code="menu-delete"
        :loading="loading"
        :disabled="selectedRowKeys.length === 0">删除</rightButton>
    </div>

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParam.name" placeholder="名称" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="编号">
              <a-input v-model="queryParam.code" placeholder="编号" />
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
      <template slot="icon" slot-scope="icon">
        <a-icon :type="icon"/>
      </template>
      <template slot="isMenu" slot-scope="isMenu">
        <a-tag color="#87d068" v-show="isMenu">菜单</a-tag>
      </template>
    </a-table>

    <edit-form ref="editForm" :afterSubmit="getDataList"></edit-form>
  </a-card>
</template>

<script>
import editForm from './edit'
import rightButton from '@/components/tools/RightButton'

const columns = [
  { title: '菜单名称', dataIndex: 'name', width: '200px' },
  { title: '菜单编号', dataIndex: 'code' },
  { title: '菜单路径', dataIndex: 'url' },
  { title: '菜单图标', dataIndex: 'icon', scopedSlots: { customRender: 'icon' } },
  { title: '序号', dataIndex: 'order', sorter: true },
  { title: '是否是菜单', dataIndex: 'isMenu', width: '90px', align: 'center', scopedSlots: { customRender: 'isMenu' } },
  { title: '备注', dataIndex: 'remark' },
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
      this.$http.post('/menu/search', {
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
        this.$message.error('数据加载失败:' + err.response.data.message)
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
      var me = this
      this.$confirm({
        title: '确认删除吗?',
        onOk () {
          me.loading = true
          me.$http.post('/menu/delete', me.selectedRowKeys).then(resJson => {
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
