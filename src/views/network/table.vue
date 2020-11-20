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
      <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit">
        完成
      </a-button>
    </template>
    <a-table
      :columns="columns"
      :rowKey="row => row.id"
      :dataSource="[dataSources]"
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
    dataIndex: '虚拟机名称'
  },
  {
    title: '所属分布式交换机',
    dataIndex: '所属分布式交换机'
  },
  {
    title: 'Vlan',
    dataIndex: 'Vlan'
  },
  {
    title: 'Vlan类型',
    dataIndex: 'Vlan类型'
  },
  {
    title: 'VlanId',
    dataIndex: 'VlanId'
  }
]

export default {
  props: {
    afterSubmit: {
      type: Function,
      default: null
    },
    dataSources: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      showTitle: '',
      columns,
      data: [],
      form: this.$form.createForm(this),
      labelCol: { xs: { span: 24 }, sm: { span: 7 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 13 } },
      visible: false,
      loading: false,
      confirmLoading: false,
      isAdd: true,
      formFields: {}
    }
  },
  mounted () {
    this.data.push(this.dataSources)
  },
  methods: {
    add () {
      this.showTitle = '选择创建云虚拟机类型'
      this.visible = true
      this.form.resetFields()
    },
    handleCancel () {
      this.visible = false
    },
    handleSubmit () {
      console.log(this.dataSources)
      this.visible = false
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
