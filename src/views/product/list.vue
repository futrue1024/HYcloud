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
              <a-input v-model="queryParam.keywords" placeholder="名称/编号" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="getDataList" :loading="loading" icon="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetSearch" :loading="loading" icon="reload">重置</a-button>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="48" :sm="48">
            <a-form-item label="">
              <a-alert message="已发布的产品才会在前台展示出来。" type="success" showIcon />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-row :gutter="48">
      <a-col :md="3" :sm="4">
        <a-directory-tree
          multiple
          :loadData="loadCategoryTree"
          :treeData="categoryTreeList"
          :selectedKeys="selectedCategoryIds"
          @select="onCategorySelect"
        >
        </a-directory-tree>
      </a-col>
      <a-col :md="21" :sm="20">
        <a-table
          ref="table"
          :columns="columns"
          :rowKey="row => row.id"
          :dataSource="data"
          :pagination="pagination"
          :loading="loading"
          :bordered="true"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          :scroll="{ x: 1400 }"
          @change="handleTableChange"
          size="small">
          <template slot="showCategory" slot-scope="text, record">
            <a-tag color="#f50" v-show="record.isCategoryPublish">已发布</a-tag>
            <a-tag color="#2db7f5" v-show="!record.isCategoryPublish">未发布</a-tag>
            {{ text }}
          </template>
          <template slot="isShowInHome" slot-scope="isShowInHome">
            <a-tag color="#87d068" v-show="isShowInHome">首页显示</a-tag>
          </template>
          <template slot="isPublish" slot-scope="isPublish">
            <a-tag color="#f50" v-show="isPublish">已发布</a-tag>
            <a-tag color="#2db7f5" v-show="!isPublish">未发布</a-tag>
          </template>
        </a-table>
      </a-col>
    </a-row>

    <edit-form ref="editForm" :afterSubmit="getDataList"></edit-form>
  </a-card>
</template>

<script>
import editForm from './edit'
import rightButton from '@/components/tools/RightButton'

const columns = [
  { title: '名称', dataIndex: 'productName', width: '300px', fixed: 'left' },
  { title: '分类', dataIndex: 'categoryName', width: '200px', scopedSlots: { customRender: 'showCategory' } },
  { title: '编号', dataIndex: 'productCode', width: '100px', sorter: true },
  { title: '零售价', dataIndex: 'retailPrice', width: '100px', sorter: true },
  { title: '销售价', dataIndex: 'salePrice', width: '100px', sorter: true },
  { title: '销售量', dataIndex: 'saleNumber', width: '100px' },
  { title: '单位', dataIndex: 'unitName', width: '80px', sorter: true },
  { title: '数量', dataIndex: 'quantity', width: '150px', sorter: true },
  { title: '首页显示', dataIndex: 'isShowInHome', width: '100px', scopedSlots: { customRender: 'isShowInHome' } },
  { title: '发布', dataIndex: 'isPublish', width: '100px', scopedSlots: { customRender: 'isPublish' } },
  { title: '排序', dataIndex: 'sort', width: '100px', sorter: true },
  { title: '创建时间', dataIndex: 'createTime', width: '150px', sorter: true }
]

export default {
  components: {
    editForm,
    rightButton
  },
  mounted () {
    this.loadCategoryFirstLevelTree()
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
      // 产品分类数据
      categoryTreeList: [],
      // 选中的分类节点
      selectedCategoryIds: []
    }
  },
  methods: {
    // 拉取表格数据
    getDataList () {
      this.loading = true
      this.$http.post('/product/search', {
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
      this.selectedCategoryIds = []
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
          me.$http.post('/product/delete', me.selectedRowKeys).then(resJson => {
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
    // 加载产品一级分类
    loadCategoryFirstLevelTree () {
      this.$http.get('/category/tree-data', {}).then(resJson => {
        this.categoryTreeList = resJson.result
      })
    },
    // 加载分类数据
    loadCategoryTree (treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        this.$http.get('/category/tree-data?parentId=' + treeNode.dataRef.key).then(resJson => {
          treeNode.dataRef.children = resJson.result
          resolve()
        })
        .catch(err => {
          this.$message.error('分类加载失败:' + err.response.data.message)
          resolve()
        })
      })
    },
    // 分类选择
    onCategorySelect (keys, event) {
      this.selectedCategoryIds = keys
      const categoryId = keys[keys.length - 1]
      this.queryParam.categoryId = categoryId
      this.getDataList()
    }
  }
}
</script>
