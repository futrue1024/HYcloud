<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <rightButton
        type="primary"
        icon="plus"
        :click="addData"
        code="role-add">添加</rightButton>
      <rightButton
        type="default"
        icon="edit"
        :click="editData"
        code="role-edit"
        :loading="loading"
        :disabled="selectedRowKeys.length === 0">编辑</rightButton>
      <rightButton
        type="danger"
        icon="delete"
        :click="deleteData"
        code="role-delete"
        :loading="loading"
        :disabled="selectedRowKeys.length === 0">删除</rightButton>
      <rightButton
        type="default"
        icon="setting"
        :click="setRoleMenu"
        code="role-set-menu"
        :loading="loading"
        :disabled="selectedRowKeys.length === 0">权限分配</rightButton>
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
    </a-table>

    <edit-form ref="editForm" :afterSubmit="getDataList"></edit-form>

    <a-modal
      title="设置角色菜单权限"
      width="40%"
      :visible="showMenuModal"
      :confirmLoading="loading"
      @ok="saveRoleMenu"
      @cancel="showMenuModal = false"
    >
      <a-spin :spinning="loading">
        <a-tree
          checkable
          v-model="userMenuList"
          :treeData="menuList"
          :defaultExpandAll="true"
          checkStrictly />
      </a-spin>
    </a-modal>
  </a-card>
</template>

<script>
import editForm from './edit'
import rightButton from '@/components/tools/RightButton'

const columns = [
  { title: '所属公司', dataIndex: 'companyName' },
  { title: '角色名称', dataIndex: 'name' },
  { title: '编号', dataIndex: 'code' },
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
      selectedRowKeys: [], // Check here to configure the default column
      showMenuModal: false, // 显示权限设置弹框
      menuList: [],
      userMenuList: [],
      isRelated: false
    }
  },
  methods: {
    // 拉取表格数据
    getDataList () {
      this.loading = true
      this.$http.post('/role/search', {
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
      this.$confirm({
        title: '确认删除吗?',
        onOk () {
          me.loading = true
          me.$http.post('/role/delete', me.selectedRowKeys).then(resJson => {
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
    },
    // 设置角色的菜单
    setRoleMenu () {
      const length = this.selectedRowKeys.length
      if (length === 0) {
        this.$message.error('请选择一个角色')
        return
      }
      const id = this.selectedRowKeys[length - 1]
      this.$http.get('/menu/user-tree', { }).then(resJson => {
        this.menuList = resJson.result
        this.$http.get('/role/' + id + '/menuids', { }).then(roleJson => {
          this.userMenuList = roleJson.result
        })
        .catch(err => {
          this.$message.error('加载失败:' + err.response.data.message)
        })
      })
      this.showMenuModal = true
    },
    // 保存角色的菜单
    saveRoleMenu () {
      this.loading = true
      const length = this.selectedRowKeys.length
      const id = this.selectedRowKeys[length - 1]
      const postData = {
        roleId: id,
        menuIds: this.userMenuList.checked
      }
      this.$http.post('/role/set/menu', postData).then(resJson => {
        this.loading = false
        this.showMenuModal = false
        this.$message.success('设置成功!')
        this.getDataList()
      })
      .catch(err => {
        this.$message.error('保存失败:' + err.response.data.message)
        this.loading = false
      })
    }
  }
}
</script>
