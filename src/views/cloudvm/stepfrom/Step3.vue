<template>
  <div>
    <a-form style="max-width: 90%; margin: 40px auto 0;">
      <a-alert
        :closable="true"
        message="请在提交前确认信息是否正确。"
        style="max-width: 300px;margin: 24px auto;"
      />
      <a-table
        ref="table"
        :columns="columns"
        :rowKey="row => row.id"
        :dataSource="dataSource"
        :row-selection="rowSelection"
        :bordered="true"
        size="small"
      >
      </a-table>
      <div style="text-align:center;">
        <a-button @click="prevStep">上一步</a-button>
        <a-button style="margin-left: 8px" type="primary" @click="finish">确认信息</a-button>
      </div>
    </a-form>
  </div>
</template>

<script>
import { Result } from '@/components'

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
  name: 'Step3',
  props: {
    dataSource: {
      type: Array,
      default: null
    }
  },
  components: {
    Result
  },
  data () {
    return {
      loading: false,
      rowSelection,
      columns
    }
  },
  methods: {
    finish () {
      this.$emit('finish')
    },
    toOrderList () {
      this.$router.push('/list/table-list')
    },
    prevStep () {
      this.$emit('prevStep')
    }
  }
}
</script>
<style lang="less" scoped>
.information {
  line-height: 22px;

  .ant-row:not(:last-child) {
    margin-bottom: 24px;
  }
}

.money {
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 14px;
}
</style>
