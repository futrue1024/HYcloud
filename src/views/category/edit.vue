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
        <a-form-item label="父级分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-tree-select
            :treeData="treeData"
            :treeDataSimpleMode="true"
            placeholder="父级分类"
            treeDefaultExpandAll
            v-model="entity.parentId"
            :loading="confirmLoading">
          </a-tree-select>
        </a-form-item>
        <a-form-item label="分类名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input autoSize v-decorator="['categoryName', { rules: [{ required: true, message: '请输入分类名称' }] }]" />
        </a-form-item>
        <a-form-item label="分类序号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number :min="0" v-decorator="['sort', { initialValue: 0, rules: [{ required: true, message: '请输入分类序号' }] }]" placeholder="序号越大排序越靠前(默认为0)" style="width:100%" />
        </a-form-item>
        <a-form-item label="分类大图" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            class="avatar-uploader"
            :accept="fileTypes.join(',')"
            :showUploadList="false"
            :action="uploadUrl"
            :customRequest="uploadImageBig"
            @change="handleImageChange"
          >
            <div>
              <a-button> <a-icon :type="confirmLoading ? 'loading' : 'plus'" /> 分类大图 </a-button>
              <a-avatar v-if="entity.imageUrlBig" size="large" icon="user" :src="entity.imageUrlBig" style="margin-left:10px" />
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="分类小图" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            class="avatar-uploader"
            :accept="fileTypes.join(',')"
            :showUploadList="false"
            :action="uploadUrl"
            :customRequest="uploadImageSmall"
            @change="handleImageChange"
          >
            <div>
              <a-button> <a-icon :type="confirmLoading ? 'loading' : 'plus'" /> 分类小图 </a-button>
              <a-avatar v-if="entity.imageUrlSmall" size="large" icon="user" :src="entity.imageUrlSmall" style="margin-left:10px" />
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="首页显示" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-checkbox v-decorator="['isShowInHome', { initialValue: true }]" v-model="entity.isShowInHome">首页显示</a-checkbox>
        </a-form-item>
        <a-form-item label="是否发布" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-checkbox v-decorator="['isPublish', { initialValue: true }]" v-model="entity.isPublish">发布</a-checkbox>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  props: {
    afterSubmit: {
      type: Function,
      default: null
    }
  },
  mounted () {
    this.uploadUrl = process.env.VUE_APP_API_BASE_URL + '/file/upload-image'
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
      // 上传地址
      uploadUrl: '',
      // 上传图片类型
      fileTypes: [ '.jpeg', '.jpg', '.png', '.gif' ]
    }
  },
  methods: {
    add () {
      this.showTitle = '新增分类'
      this.isAdd = true
      this.entity = {
        isPublish: true,
        isShowInHome: false
      }
      this.visible = true
      this.form.resetFields()
      this.getTree()
    },
    edit (id) {
      this.showTitle = '编辑分类'
      this.isAdd = false
      this.visible = true
      this.$nextTick(() => {
        this.formFields = this.form.getFieldsValue()
        this.getTree()
        this.$http.get('/category/' + id, { }).then(resJson => {
          this.entity = resJson.result
          var setData = {}
          Object.keys(this.formFields).forEach(item => {
              setData[item] = this.entity[item]
          })
          this.form.setFieldsValue(setData)
        })
        .catch(err => {
          this.$message.error('分类加载:' + err.response.data.message)
        })
      })
    },
    handleSubmit () {
      this.form.validateFields((errors, values) => {
        // 校验成功
        if (!errors) {
          const postUrl = this.isAdd ? '/category/create' : '/category/edit'
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
    getTree () {
      this.confirmLoading = true
      this.$http.get('/category/tree?loadFirstLevel=true', { }).then(resJson => {
        this.confirmLoading = false
        this.treeData = resJson.result
      })
      .catch(err => {
        this.$message.error('父级分类加载失败:' + err.response.data.message)
        this.confirmLoading = false
      })
    },
    // 上传图片选择
    handleImageChange ({ file, fileList, event }) {
      if (file.status === 'removed') {
        this.fileList = fileList
      }
    },
    uploadImageBig (option) {
      this.handleImageRequest(option, 'big')
    },
    uploadImageSmall (option) {
      this.handleImageRequest(option, 'small')
    },
    // 自定义上传图片
    handleImageRequest (option, type) {
      const file = option.file
      const formData = new FormData()
      formData.append('file', file)
      formData.append('name', file.name)
      this.confirmLoading = true
      this.$http.post(this.uploadUrl, formData).then(resJson => {
        this.confirmLoading = false
        const fileJson = resJson.result
        if (fileJson.completed) {
          this.$message.success('图片上传成功')
          option.onSuccess()
          if (type === 'big') {
            this.entity.imageUrlBig = fileJson.fileUrl
          } else {
            this.entity.imageUrlSmall = fileJson.fileUrl
          }
        } else {
          this.$message.success('图片上传失败')
        }
      })
      .catch(err => {
        this.$message.error('上传失败:' + err.response.data.message)
        this.confirmLoading = false
      })
    }
  }
}
</script>
