<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <rightButton
        type="primary"
        icon="plus"
        :click="addData"
        code="user-add">添加</rightButton>
      <rightButton
        type="default"
        icon="edit"
        :click="editData"
        code="user-edit"
        :loading="loading"
        :disabled="selectedRowKeys.length === 0">编辑</rightButton>
      <rightButton
        type="danger"
        icon="delete"
        :click="deleteData"
        code="user-delete"
        :loading="loading"
        :disabled="selectedRowKeys.length === 0">删除</rightButton>
      <rightButton
        type="default"
        icon="setting"
        :click="setRole"
        code="user-set-role"
        :loading="loading"
        :disabled="selectedRowKeys.length === 0">角色设置</rightButton>
    </div>

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="账号">
              <a-input v-model="queryParam.loginName" placeholder="账号" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="姓名">
              <a-input v-model="queryParam.name" placeholder="姓名" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="用户类型">
              <a-select defaultValue="" style="width: 120px" v-model="queryParam.isAdmin" :allowClear="true">
                <a-select-option value="true">管理员</a-select-option>
                <a-select-option value="false">普通用户</a-select-option>
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
      <template slot="isAdmin" slot-scope="isAdmin">
        <a-tag color="#87d068" v-show="isAdmin">管理员</a-tag>
        <a-tag v-show="!isAdmin">普通用户</a-tag>
      </template>
    </a-table>

    <edit-form ref="editForm" :afterSubmit="getDataList"></edit-form>

    <a-modal
      title="设置角色"
      width="40%"
      :visible="showRoleModal"
      :confirmLoading="loading"
      @ok="saveRole"
      @cancel="showRoleModal = false"
    >
      <a-spin :spinning="loading">
        <a-tree
          checkable
          v-model="userRoles"
          :selectedKeys="userRoles"
          :treeData="allRoles" />
      </a-spin>
    </a-modal>
  </a-card>
</template>

<script>
import editForm from './edit'
import rightButton from '@/components/tools/RightButton'

const columns = [
  { title: '所属公司', dataIndex: 'companyName' },
  { title: '部门', dataIndex: 'departmentName' },
  { title: '登陆账号', dataIndex: 'loginName' },
  { title: '姓名', dataIndex: 'name' },
  { title: '管理员', dataIndex: 'isAdmin', width: '75px', align: 'center', scopedSlots: { customRender: 'isAdmin' } },
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
      selectedRowKeys: [],
      showRoleModal: false,
      userRoles: [],
      allRoles: []
    }
  },
  methods: {
    // 拉取表格数据
    getDataList () {
      this.loading = true
      const queryJson = {
        pageIndex: this.pagination.current,
        pageSize: this.pagination.pageSize,
        sortField: this.sorter.field,
        sortType: this.sorter.order,
        ...this.queryParam,
        ...this.filters
      }
      if (queryJson.isAdmin && queryJson.isAdmin !== '') {
        queryJson.isAdmin = queryJson.isAdmin === 'true'
      }
      this.$http.post('/user/search', queryJson).then(resJson => {
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
          if (item.isAdmin) {
            hasSystem = true
          }
        }
      })
      if (hasSystem) {
        me.$message.error('系统账号不允许删除')
        return
      }
      this.$confirm({
        title: '确认删除吗?',
        onOk () {
          me.loading = true
          me.$http.post('/user/delete', me.selectedRowKeys).then(resJson => {
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
    // 设置角色
    setRole () {
      const length = this.selectedRowKeys.length
      if (length === 0) {
        this.$message.error('请选择一个用户')
        return
      }
      const id = this.selectedRowKeys[length - 1]
      this.$http.get('/role/tree', {}).then(resJson => {
        this.allRoles = resJson.result
        this.$http.get('/user/' + id + '/roleids', { }).then(resJson => {
          this.userRoles = resJson.result
        })
        .catch(err => {
          this.$message.error('加载失败:' + err.response.data.message)
        })
      })
      this.showRoleModal = true
    },
    // 保存角色
    saveRole () {
      this.loading = true
      const length = this.selectedRowKeys.length
      const id = this.selectedRowKeys[length - 1]
      const postData = {
        userId: id,
        roleIds: this.userRoles
      }
      this.$http.post('/user/set/role', postData).then(resJson => {
        this.loading = false
        this.showRoleModal = false
        this.$message.success('设置成功!')
        this.getDataList()
      })
      .catch(err => {
        this.$message.error('设置失败:' + err.response.data.message)
        this.loading = false
      })
    }
  }
}
</script>
