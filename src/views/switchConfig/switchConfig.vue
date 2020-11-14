<template>
  <a-card :bordered="false" class="table-operator-layout">
    <div class="table-operator">
      <div class="content">
        <div class="tag">
          <template v-for="tag in tags">
            <a-checkable-tag
              class="tagItem"
              :key="tag.tagName"
              :checked="selectedTags.indexOf(tag.tagName) > -1"
              @change="(checked) => tagHandleChange(tag.tagName, checked)"
              :style="{ fontSize: '14px' }"
            >
              {{ tag.tagName }}
            </a-checkable-tag>
          </template>
        </div>
        <div class="table">
          <a-table
            ref="table"
            :columns="columns[selectedTags[0]]"
            :rowKey="(row) => row.id"
            :dataSource="data"
            :row-selection="rowSelection"
            :pagination="pagination"
            :loading="loading"
            :bordered="true"
            @change="handleTableChange"
            size="small"
          >
          </a-table>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
import { lib, tags } from './lib.js'

const rowSelection = {
  onSelect: (record, selected, selectedRows) => {
    console.log(record)
    console.log(selectedRows[0].numCpu)
  }
}
export default {
  data () {
    return {
      rowSelection,
      expandedKeys: ['1'],
      checkedKeys: ['1-1'],
      selectedKeys: [],
      tags,
      tagApi: [],
      selectedTags: ['datacenter'],
      data: [],
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total, range) => `记录：${total} 条`
      },
      filters: {},
      sorter: { field: 'Id', order: 'ASC' },
      loading: false,
      columns: lib
    }
  },
  watch: {
    checkedKeys (val) {
      console.log('onCheck', val)
    }
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    onCheck (checkedKeys) {
      console.log('onCheck', checkedKeys)
      this.checkedKeys = checkedKeys
    },
    onSelect (selectedKeys, info) {
      console.log('onSelect', info.selectedNodes[0].data.props.title)
      this.selectedKeys = selectedKeys
      console.log('选择的数组' + this.selectedKeys)
    },
    handleChange (checked) {
      console.log(checked)
    },
    callback (val) {
      console.log(val)
    },
    // tag切换拉取数据
    tagHandleChange: function (tag, checked) {
      const { selectedTags } = this
      this.selectedTags = checked ? [tag] : selectedTags.filter((t) => t !== tag)
      for (let i = 0; i < this.tags.length; i++) {
        if (this.tagApi.length === 0 && this.selectedTags[0] === this.tags[i].tagName) {
          this.tagApi.push(this.tags[i].webApi)
          this.getDataList()
        } else if (this.tagApi.length > 0 && this.selectedTags[0] === this.tags[i].tagName) {
          this.tagApi.shift()
          this.tagApi.push(this.tags[i].webApi)
          this.getDataList()
        }
      }
    },
    // 拉取表格数据
    getDataList () {
      this.loading = true
      const queryJson = {
        pageIndex: this.pagination.current,
        pageSize: this.pagination.pageSize,
        sortField: this.sorter.field,
        sortType: this.sorter.order
      }
      this.$http
        .post(this.tagApi[0] || '/Info/datacenter', queryJson)
        .then((resJson) => {
          this.loading = false
          this.data = resJson.result.datas
          const pagination = { ...this.pagination }
          pagination.total = resJson.result.records
          this.pagination = pagination
        })
        .catch((err) => {
          this.$message.error('加载失败:' + err.response.message)
          this.loading = false
        })
    },
    // 页码改变事件
    handleTableChange (pagination, filters, sorter) {
      this.pagination = { ...pagination }
      // this.filters = { ...filters }
      this.sorter = { ...sorter }
      this.getDataList()
    }
  }
}
</script>
<style lang="less" scoped>
@border-color: #9a9a9a;
.table-operator-layout {
  overflow: auto;

  .table-operator {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    @media (max-width: 1200px) {
      .tree {
        margin-top: 24px;
      }
    }
    .content {
      width: 100%;
      //flex-grow: 1;
      border: 1px solid @border-color;
      border-radius: 4px;

      > .tag {
        padding: 8px 8px;
        border-bottom: 1px solid #999999;

        > .tagItem {
          margin: 4px 6px 6px 6px;
        }
      }

      > .table {
      }
    }
  }
}
</style>
