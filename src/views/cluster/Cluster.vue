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
        :click="deleteData"
        code="role-delete">删除
      </rightButton>
      <a-dropdown>
        <a-menu slot="overlay" @click="drsHandleMenuClick">
          <a-menu-item key="DRS1">开启</a-menu-item>
          <a-menu-item key="DRS2">关闭</a-menu-item>
        </a-menu>
        <a-button type="primary">
          vSphere DRS
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
      <a-dropdown>
        <a-menu slot="overlay" @click="haHandleMenuClick">
          <a-menu-item key="HA1">开启</a-menu-item>
          <a-menu-item key="HA2">关闭</a-menu-item>
        </a-menu>
        <a-button type="primary">
          vSphere HA
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
      <a-dropdown>
        <a-menu slot="overlay" @click="moreHandleMenuClick">
          <a-menu-item key="1">重命名</a-menu-item>
        </a-menu>
        <a-button type="primary">
          更多
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
    </div>
    <edit-form ref="editForm" :afterSubmit="getDataList"></edit-form>
    <rename ref="rename" :after-submit="getDataList"></rename>
    <div class="table">
      <a-table
        ref="table"
        :columns="columns"
        :rowKey="(row) => row.id"
        :dataSource="data"
        :row-selection="{selectedRowKeys: selectedRowKeys,onChange:onChange}"
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
import rename from './rename.vue'
import rightButton from '@/components/tools/RightButton.vue'

const columns = [
  {
    title: '集群名称',
    dataIndex: 'name'
  },
  {
    title: '所属数据中心',
    dataIndex: '所属数据中心'
  },
  {
    title: '主机数量',
    dataIndex: '主机数量'
  },
  {
    title: 'DRS开启状态',
    dataIndex: 'drsEnabled'
  },
  {
    title: 'HA开启状态',
    dataIndex: 'haEnabled'
  }
]

export default {
  components: { rightButton, editForm, rename },
  data () {
    return {
      columns,
      selectedRowKeys: [],
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
      console.log(this.selectedRowKeys.length)
      if (this.selectedRowKeys.length > 0) {
        if (e.key === '1') {
          this.$refs.rename.add()
        }
      } else {
        this.$message.error('请选择需要重命名的集群')
      }
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
            switch (this.data[i].drsEnabled) {
              case false:
                this.data[i].drsEnabled = '未开启'
                break
              case true:
                this.data[i].drsEnabled = '已开启'
                break
            }
            switch (this.data[i].haEnabled) {
              case true:
                this.data[i].haEnabled = '已开启'
                break
              case false:
                this.data[i].haEnabled = '未开启'
                break
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
    },
    deleteData () {
      const me = this
      this.$confirm({
        title: '确认删除吗?',
        content: '删除集群并从菜单中删除主机及虚拟机。',
        onOk () {
          me.loading = true
          console.log(me.selectedRowKeys)
          me.$http.post('/category/delete', me.selectedRowKeys).then(resJson => {
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
    onChange (selectedRowKeys, selectedRows) {
      console.log('3', selectedRows)
      console.log('4', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
      console.log('5', this.selectedRowKeys)
    }
  }
}
</script>

<style lang='less' scoped>
</style>
