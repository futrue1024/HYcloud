<template>
  <a-modal
    :title="showTitle"
    width="60%"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-table
      ref="table"
      :columns="columns"
      :rowKey="(row) => row.id"
      :dataSource="data"
      :row-selection="rowSelection"
      :bordered="true"
      size="small"
    >
    </a-table>
    <div class="radio">
      <div>选择类型：</div>
      <div>
        <a-radio-group v-model="value" @change="onChange">
          <a-radio :value="1">
            只迁移主机
          </a-radio>
          <a-radio :value="2">
            只迁移存储
          </a-radio>
          <a-radio :value="3">
            迁移主机和存储
          </a-radio>
        </a-radio-group>
      </div>
    </div>
  </a-modal>
</template>

<script>
const columns = [
  {
    title: '虚拟机名称',
    dataIndex: 'name'
  },
  {
    title: '集群',
    dataIndex: '集群'
  },
  {
    title: '主机',
    dataIndex: '主机'
  },
  {
    title: '数据存储',
    dataIndex: '数据存储'
  },
  {
    title: '网络',
    dataIndex: '网络'
  }
]
const rowSelection = {
  onSelect: (record, selected, selectedRows) => {
    console.log(record)
    console.log(selectedRows)
  }
}
export default {
  data () {
    return {
      showTitle: '',
      columns,
      data: [],
      rowSelection,
      visible: false,
      confirmLoading: false,
      value: 1
    }
  },
  methods: {
    migrateData () {
      this.showTitle = '云虚拟机迁移'
      this.visible = true
    },
    showModal () {
      this.visible = true
    },
    handleOk (e) {
      this.ModalText = 'The modal will be closed after two seconds'
      this.confirmLoading = true
      setTimeout(() => {
        this.visible = false
        this.confirmLoading = false
      }, 2000)
    },
    handleCancel (e) {
      console.log('Clicked cancel button')
      this.visible = false
    },
    onChange (e) {
      console.log(e.target.value)
    }
  }
}
</script>

<style lang='less' scoped>
.radio {
  margin: 16px 0 0 0;
  display: flex;
  flex-direction: row;
  justify-content: center;

  span {
    margin-right: 240px;
    white-space: nowrap;
  }
}
</style>
