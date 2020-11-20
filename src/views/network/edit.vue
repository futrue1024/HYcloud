<template>
  <a-modal
    :title="showTitle"
    width="50%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <template slot="footer">
      <a-button key="back" @click="handleCancel">
        取消
      </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
        下一步
      </a-button>
    </template>
    <TableFrom ref="tableFrom" :after-submit="afterSubmit" :data-sources="entity"></TableFrom>
    <a-spin :spinning="confirmLoading" class="from">
      <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }" style="margin-left: 60px">
        <a-form-item label="虚拟机名称">
          <a-input
            v-decorator="['虚拟机名称', { rules: [{ required: true, message: '请输入虚拟机名称' }] }]"
            placeholder="请输入虚拟机名称"
          />
        </a-form-item>
        <a-form-item label="所属分布式交换机">
          <a-select
            v-decorator="['所属分布式交换机',{ rules: [{ required: true, message: '所属分布式交换机' }] },]"
            placeholder="所属分布式交换机"
            @change="handleSelectChange"
          >
            <a-select-option v-for="(k,index) in name" :value="k" :key="index">
              {{ k }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Vlan">
          <a-select
            v-decorator="['Vlan',{ rules: [{ required: true, message: '请选择Vlan' }] },]"
            placeholder="请选择Vlan"
            @change="handleSelectChange"
          >
            <a-select-option value="Vlan1">
              Vlan1
            </a-select-option>
            <a-select-option value="Vlan2">
              Vlan2
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Vlan类型">
          <a-select
            v-decorator="['Vlan类型',{ rules: [{ required: true, message: '请选择Vlan类型' }] },]"
            placeholder="请选择Vlan类型"
            @change="handleSelectChange"
          >
            <a-select-option value="类型一">
              类型一
            </a-select-option>
            <a-select-option value="类型二">
              类型二
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="VlanId">
          <a-input
            v-decorator="['VlanId', { rules: [{ required: true, message: '请输入描述' }] }]"
            placeholder="请输入虚拟机名称"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import TableFrom from './table.vue'

export default {
  components: { TableFrom },
  props: {
    afterSubmit: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      showTitle: '',
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
      hasValue: 1,
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true
      },
      sorter: { field: 'Id', order: 'ASC' },
      name: []
    }
  },
  mounted () {
    const queryJson = {
      pageIndex: this.pagination.current,
      pageSize: this.pagination.pageSize,
      sortField: this.sorter.field,
      sortType: this.sorter.order
    }
    this.$http
      .post('/Info/vdswitch', queryJson)
      .then((resJson) => {
        resJson.result.datas.map(item => this.name.push(item.name))
        this.pagination = { ...this.pagination }
      })
      .catch((err) => {
        this.$message.error('加载失败:' + err.response.message)
      })
  },
  methods: {
    add () {
      this.showTitle = '创建逻辑交换机'
      this.isAdd = true
      this.entity = {}
      this.visible = true
      this.form.resetFields()
    },
    handleOk () {
      this.form.validateFields((errors, values) => {
        if (!errors) {
          this.entity = Object.assign(this.entity, this.form.getFieldsValue())
          this.$refs.tableFrom.add()
          console.log(this.entity)
        }
      })
    },
    handleCancel () {
      this.visible = false
    },
    handleSelectChange (value) {
      console.log(`selected ${value}`)
    }
  }
}
</script>
