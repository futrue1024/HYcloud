<template>
  <a-modal
    :title="showTitle"
    width="60%"
    height="60%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <template slot="footer">
      <a-button key="cancel" @click="handleCancel">
        取消
      </a-button>
      <a-button key="back" @click="handleCancel">
        上一步
      </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
        完成
      </a-button>
    </template>
    <a-table
      ref="table"
      :columns="columns"
      :rowKey="row => row.id"
      :dataSource="data"
      :row-selection="rowSelection"
      :bordered="true"
      size="small"
    >
    </a-table>
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
  props: {
    afterSubmit: {
      type: Function,
      default: null
    },
    dataSource: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      showTitle: '',
      columns,
      rowSelection,
      data: [],
      form: this.$form.createForm(this),
      labelCol: { xs: { span: 24 }, sm: { span: 7 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 13 } },
      visible: false,
      loading: false,
      confirmLoading: false,
      isAdd: true,
      formFields: {},
      entity: {},
      value: 1,
      hasValue: 1
    }
  },
  mounted () {
    this.data.push(this.dataSource)
  },
  methods: {
    add () {
      this.showTitle = '选择创建云虚拟机类型'
      this.visible = true
      this.form.resetFields()
    },
    handleOk () {
      this.form.validateFields((errors, values) => {
        // 校验成功
        if (!errors) {
          const postUrl = this.isAdd ? '/role/create' : '/role/edit'
          this.entity = Object.assign(this.entity, this.form.getFieldsValue())
          this.confirmLoading = true
          this.$http.post(postUrl, this.entity).then(resJson => {
            this.confirmLoading = false
            this.$message.success('保存成功!')
            this.afterSubmit()
            this.visible = false
          })
            .catch(err => {
              this.$message.error('保存失败:' + err.response.data.message)
              this.confirmLoading = false
            })
        }
      })
    },
    handleCancel () {
      this.visible = false
    },
    onHaChange (e) {
      console.log(e.target.value)
    },
    onDrsChange (e) {
      console.log(e.target.value)
    }
  }
}
</script>
<style lang="less" scoped>
.radio {
  display: flex;
  flex-direction: row;
  justify-content: center;

  span {
    margin-right: 240px;
    white-space: nowrap;
  }
}
</style>
