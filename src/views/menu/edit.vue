<template>
  <a-modal
    :title="showTitle"
    width="40%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="父级菜单" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-tree-select
            :treeData="treeData"
            :treeDataSimpleMode="true"
            placeholder="父级菜单"
            treeDefaultExpandAll
            v-model="entity.parentId"
            :loading="confirmLoading">
          </a-tree-select>
        </a-form-item>
        <a-form-item label="菜单名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input autoSize v-decorator="['name', { rules: [{ required: true, message: '请输入菜单名称' }] }]" />
        </a-form-item>
        <a-form-item label="菜单编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['code', { rules: [{ required: true, message: '请输入菜单编号' }] }]" :disabled="!isAdd" placeholder="编号添加后就不能修改" />
        </a-form-item>
        <a-form-item label="菜单路径" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['url', { initialValue: '#', rules: [{ required: false, message: '请输入菜单路径' }] }]" />
        </a-form-item>
        <a-form-item label="菜单图标" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['icon', { initialValue: 'right', rules: [{ required: false, message: '请输入菜单图标(默认为:right)' }] }]" :showSearch="true" placeholder="请选择菜单。支持关键字搜索">
            <a-select-opt-group>
              <span slot="label">网页类</span>
              <a-select-option v-for="icon in iconList.web" :key="icon.value" :value="icon.value">
                <a-icon :type="icon.value" /> {{ icon.value }}
              </a-select-option>
            </a-select-opt-group>
            <a-select-opt-group>
              <span slot="label">数据类</span>
              <a-select-option v-for="icon in iconList.data" :key="icon.value" :value="icon.value">
                <a-icon :type="icon.value" /> {{ icon.value }}
              </a-select-option>
            </a-select-opt-group>
            <a-select-opt-group>
              <span slot="label">编辑类</span>
              <a-select-option v-for="icon in iconList.edit" :key="icon.value" :value="icon.value">
                <a-icon :type="icon.value" /> {{ icon.value }}
              </a-select-option>
            </a-select-opt-group>
            <a-select-opt-group>
              <span slot="label">提示建议</span>
              <a-select-option v-for="icon in iconList.suggestion" :key="icon.value" :value="icon.value">
                <a-icon :type="icon.value" /> {{ icon.value }}
              </a-select-option>
            </a-select-opt-group>
            <a-select-opt-group>
              <span slot="label">方向类</span>
              <a-select-option v-for="icon in iconList.direction" :key="icon.value" :value="icon.value">
                <a-icon :type="icon.value" /> {{ icon.value }}
              </a-select-option>
            </a-select-opt-group>
          </a-select>
        </a-form-item>
        <a-form-item label="菜单序号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number :min="0" v-decorator="['order', { initialValue: 0, rules: [{ required: true, message: '请输入菜单序号' }] }]" placeholder="序号越大排序越靠后(默认为0)" style="width:100%" />
        </a-form-item>
        <a-form-item label="是否是菜单" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-checkbox v-decorator="['isMenu', { initialValue: true }]" v-model="entity.isMenu">菜单</a-checkbox>
        </a-form-item>
        <a-form-item label="菜单备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea v-decorator="['remark', { rules: [{ required: false, message: '请输入菜单备注' }] }]" :autoSize="{ minRows: 2, maxRows: 6 }" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import iconList from '@/utils/icon/default-list.js'
export default {
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
      confirmLoading: false,
      isAdd: true,
      formFields: {},
      entity: {},
      treeData: [],
      iconList: iconList
    }
  },
  methods: {
    add () {
      this.showTitle = '新增菜单'
      this.isAdd = true
      this.entity = {
        isMenu: true
      }
      this.visible = true
      this.form.resetFields()
      this.getMenuTree()
    },
    edit (id) {
      this.showTitle = '编辑菜单'
      this.isAdd = false
      this.visible = true
      this.$nextTick(() => {
        this.formFields = this.form.getFieldsValue()
        this.getMenuTree()
        this.$http.get('/menu/' + id, { }).then(resJson => {
          this.entity = resJson.result
          var setData = {}
          Object.keys(this.formFields).forEach(item => {
              setData[item] = this.entity[item]
          })
          this.form.setFieldsValue(setData)
        })
        .catch(err => {
          this.$message.error('菜单加载:' + err.response.data.message)
        })
      })
    },
    handleSubmit () {
      this.form.validateFields((errors, values) => {
        // 校验成功
        if (!errors) {
          const postUrl = this.isAdd ? '/menu/create' : '/menu/edit'
          this.entity = Object.assign(this.entity, this.form.getFieldsValue())
          this.confirmLoading = true
          this.$http.post(postUrl, this.entity).then(resJson => {
            this.confirmLoading = false
            this.$message.success('保存成功!')
            this.afterSubmit()
            this.visible = false
          })
          .catch(err => {
            this.$message.error('保存成功:' + err.response.data.message)
            this.confirmLoading = false
          })
        }
      })
    },
    handleCancel () {
      this.visible = false
    },
    getMenuTree () {
      this.confirmLoading = true
      this.$http.get('/menu/tree', { }).then(resJson => {
        this.confirmLoading = false
        this.treeData = resJson.result
      })
      .catch(err => {
        this.$message.error('菜单加载失败:' + err.response.data.message)
        this.confirmLoading = false
      })
    }
  }
}
</script>
