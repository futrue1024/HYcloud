<template>
  <a-modal
    :title="showTitle"
    width="60%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-tabs :defaultActiveKey="tabKey">
          <a-tab-pane tab="基础信息" key="baseinfo">
            <a-form-item label="产品分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-tree-select
                :treeData="treeData"
                :treeDataSimpleMode="true"
                placeholder="产品分类"
                treeDefaultExpandAll
                v-model="entity.categoryId"
                :loading="confirmLoading">
              </a-tree-select>
            </a-form-item>
            <a-form-item label="产品名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input autoSize v-decorator="['productName', { rules: [{ required: true, message: '请输入产品名称' }] }]" placeholder="名称" />
            </a-form-item>
            <a-form-item label="产品编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input autoSize v-decorator="['productCode', { rules: [{ required: true, message: '请输入产品编号' }] }]" placeholder="编号" />
            </a-form-item>
            <a-form-item label="产品描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-textarea v-decorator="['productDescription', { rules: [{ required: true, message: '请输入产品描述' }] }]" placeholder="描述" :autoSize="{ minRows: 2, maxRows: 6 }" />
            </a-form-item>
            <a-form-item label="零售价" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number :min="0" v-decorator="['retailPrice', { rules: [{ required: true, message: '请输入零售价' }] }]" placeholder="零售价格" style="width:100%" />
            </a-form-item>
            <a-form-item label="销售价" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number :min="0" v-decorator="['salePrice', { rules: [{ required: true, message: '请输入销售价' }] }]" placeholder="销售价格" style="width:100%" />
            </a-form-item>
            <a-form-item label="数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number :min="0" v-decorator="['quantity', { rules: [{ required: true, message: '请输入数量' }] }]" placeholder="数量" style="width:100%" />
            </a-form-item>
            <a-form-item label="单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input autoSize v-decorator="['unitName', { rules: [{ required: true, message: '请输入单位' }] }]" placeholder="产品单位名称" />
            </a-form-item>
            <a-form-item label="排序序号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number :min="0" v-decorator="['sort', { initialValue: 0, rules: [{ required: true, message: '请输入排序序号' }] }]" placeholder="序号越大排序越靠前(默认为0)" style="width:100%" />
            </a-form-item>
            <a-form-item label="首页显示" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-checkbox v-decorator="['isShowInHome', { initialValue: true }]" v-model="entity.isShowInHome">首页显示</a-checkbox>
            </a-form-item>
            <a-form-item label="是否发布" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-checkbox v-decorator="['isPublish', { initialValue: true }]" v-model="entity.isPublish">发布</a-checkbox>
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane tab="产品规格" key="spec">
            <a-form-item
              v-for="(k, index) in keys"
              :key="k"
              :label="index === 0 ? '请填写产品规格名称和规格数据' : ''"
              :required="false"
            >
              <a-input
                v-decorator="[
                  `specNames[${k}]`,
                  {
                    validateTrigger: ['change', 'blur'],
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '请输入产品规格，如：产地',
                      },
                    ],
                  },
                ]"
                placeholder="产品规格名称，如：产地"
                style="width: 20%; margin-right: 8px"
              />
              <a-input
                v-decorator="[
                  `specValues[${k}]`,
                  {
                    validateTrigger: ['change', 'blur'],
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '请输入产品规格数据，如：四川',
                      },
                    ],
                  },
                ]"
                placeholder="产品规格数据，如：四川"
                style="width: 40%; margin-right: 8px"
              />
              <a-icon
                v-if="keys.length > 1"
                class="dynamic-delete-button"
                type="minus-circle-o"
                :disabled="keys.length === 1"
                @click="() => removeProductSpec(k)"
              />
            </a-form-item>
            <a-form-item>
              <a-button type="dashed" style="width: 20%" @click="addProductSpec">
                <a-icon type="plus" /> 添加产品规格
              </a-button>
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane tab="产品图片" key="image">
            <div class="clearfix">
              <a-upload
                :action="uploadUrl"
                listType="picture-card"
                :fileList="fileList"
                :customRequest="handleImageRequest"
                @preview="handleImagePreview"
                @change="handleImageChange"
              >
                <div v-if="fileList.length < 8">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传图片</div>
                </div>
              </a-upload>
              <a-modal :visible="previewVisible" :footer="null" @cancel="handleImageCancel">
                <img alt="example" style="width: 100%" :src="previewImage" />
              </a-modal>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  let id = 0
  function getBase64 (file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }
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
      labelCol: { xs: { span: 24 }, sm: { span: 4 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 20 } },
      visible: false,
      confirmLoading: false,
      isAdd: true,
      formFields: {},
      entity: {},
      treeData: [],
      keys: [],
      tabKey: 'baseinfo',
      uploadUrl: 'http://localhost:6206/api/file/upload-image',
      previewVisible: false,
      previewImage: '',
      fileList: []
    }
  },
  mounted () {
    this.uploadUrl = process.env.VUE_APP_API_BASE_URL + '/file/upload-image'
  },
  methods: {
    // 转换到默认的tab标签页
    toDefaultTab () {
      this.tabKey = 'baseinfo'
    },
    // 添加
    add () {
      this.showTitle = '新增产品'
      this.isAdd = true
      this.entity = {
        isPublish: true,
        isShowInHome: false
      }
      this.visible = true
      this.form.resetFields()
      this.getTree()
    },
    // 编辑
    edit (id) {
      this.toDefaultTab()
      this.showTitle = '编辑产品'
      this.isAdd = false
      this.visible = true
      this.$nextTick(() => {
        this.formFields = this.form.getFieldsValue()
        this.keys = []
        this.getTree()
        this.$http.get('/product/' + id, { }).then(resJson => {
          this.entity = resJson.result
          var setData = {}
          Object.keys(this.formFields).forEach(item => {
              setData[item] = this.entity[item]
          })
          if (resJson.result.specs && resJson.result.specs.length > 0) {
            resJson.result.specs.forEach((item, index) => {
              const specNameKey = 'specNames[' + index + ']'
              const specValueKey = 'specValues[' + index + ']'
              this.form.getFieldDecorator(specNameKey, { initialValue: item.specName, preserve: true })
              this.form.getFieldDecorator(specValueKey, { initialValue: item.specValue, preserve: true })
              this.keys.push(index)
            })
          }
          console.log(setData)
          this.form.setFieldsValue(setData)
        })
      })
    },
    // 保存
    handleSubmit () {
      this.form.validateFields((errors, values) => {
        // 校验成功
        if (!errors) {
          const postUrl = this.isAdd ? '/product/create' : '/product/edit'
          this.entity = Object.assign(this.entity, this.form.getFieldsValue())
          const images = []
          this.fileList.forEach(item => {
            images.push({ imageUrl: item.url, imageName: item.name })
          })
          this.entity.images = images
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
    // 取消
    handleCancel () {
      this.visible = false
    },
    // 获取产品分类
    getTree () {
      this.confirmLoading = true
      this.$http.get('/category/tree?loadFirstLevel=false', { }).then(resJson => {
        this.confirmLoading = false
        this.treeData = resJson.result
      })
      .catch(err => {
        this.$message.error('分类加载失败:' + err.response.data.message)
        this.confirmLoading = false
      })
    },
    // 添加产品规格
    addProductSpec () {
      const nextKeys = this.keys.concat(id++)
      this.keys = nextKeys
    },
    // 删除产品规格
    removeProductSpec (k) {
      if (this.keys.length === 0) {
        return
      }
      this.keys = this.keys.filter(key => key !== k)
    },
    // 图片预览取消
    handleImageCancel () {
      this.previewVisible = false
    },
    // 图片预览
    async handleImagePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    // 上传图片选择
    handleImageChange ({ fileList }) {
      this.fileList = fileList
      console.log('fileList')
      console.log(fileList)
    },
    // 自定义上传
    handleImageRequest (option) {
      const file = option.file
      const formData = new FormData()
      formData.append('file', file)
      formData.append('name', file.name)
      this.$http.post(this.uploadUrl, formData).then(resJson => {
        this.loading = false
        const fileJson = resJson.result
        if (fileJson.completed) {
          this.$message.success('图片上传成功')
          this.fileList.push({
            uid: fileJson.fileName,
            name: file.name,
            status: 'done',
            url: fileJson.fileUrl
          })

          option.onSuccess()
        } else {
          this.$message.success('图片上传失败')
        }
      })
      .catch(err => {
        this.$message.error('上传失败:' + err.response.data.message)
        this.loading = false
      })
    }
  }
}
</script>
