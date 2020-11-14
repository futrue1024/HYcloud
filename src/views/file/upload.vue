<template>
  <div>
    <a-card :loading="loading" title="说明">
      <p>1.支持自定义上传方式</p>
      <p>2.支持大文件上传, 把一个大文件，分割成若干个小文件，上传到服务</p>
      <p>3.支持显示上传进度</p>
    </a-card>
    <p></p>
    <a-upload-dragger
      name="file"
      :accept="fileTypes.join(',')"
      :multiple="true"
      action="/file/upload"
      @change="handleChange"
      :beforeUpload="beforeUpload"
      :customRequest="customRequest"
    >
      <p class="ant-upload-drag-icon">
        <a-icon type="inbox" />
      </p>
      <p class="ant-upload-text">点击或者拖拽文件到此区域，上传文件</p>
      <p class="ant-upload-hint">
        支持单个文件或批量上传文件。严禁上传公司机密资料 .支持的文件类型：{{ fileTypes.join('|') }}
      </p>
    </a-upload-dragger>
  </div>
</template>
<script>
const rootUrl = () => {
  return process.env.VUE_APP_API_BASE_URL
}
export default {
  data () {
    return {
      // 已上传的文件
      fileList: [],
      loading: true,
      fileTypes: [
        '.mp4',
        '.mkv',
        '.pdf',
        '.rar',
        '.zip',
        '.jpeg',
        '.jpg',
        '.png',
        '.gif'
      ],
      chunkSize: 1024 * 1024, // 文件分片大小1M
      maxSize: 1024 * 1024 * 100 // 最大100M
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    handleChange (info) {
      const me = this
      const status = info.file.status
      if (status !== 'uploading') {
        console.log(status)
      }
      if (status === 'removed') {
        me.fileList.forEach(function (item, index) {
          if (item.uid === info.file.uid) {
            me.fileList.splice(index, 1)
          }
        })
      }
      if (status === 'done') {
        console.log(status)
      } else if (status === 'error') {
        console.log(status)
      }
    },
    beforeUpload (file, fileList) {
      // IE9 不支持该方法
      const extName = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      const exts = this.fileTypes.join('|')
      if (exts.indexOf(extName) === -1) {
        this.$message.error('文件类型必须是:' + exts + ' 中的一种')
        return false
      }
      // 文件大小检查
      const fileSize = file.size
      if (fileSize > this.maxSize) {
        this.$message.error('文件大小不能超过' + (this.maxSize / 1024 / 1024) + 'M')
        return false
      }
      return true
    },
    customRequest (option) {
      const url = rootUrl() + option.action
      const createGuid = function () {
        function S4 () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }
        return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
      }
      this.fileUpload(url, option, 0, createGuid())
    },
    // 上传文件
    fileUpload (uploadUrl, option, chunk, guid) {
      const file = option.file
      const maxChunk = Math.ceil((file.size / this.chunkSize))
      const formData = new FormData()
      // 当前上传进度
      const currentPercent = parseInt((chunk / maxChunk) * 100)
      option.onProgress({ percent: currentPercent })
      // 将文件进行分段
      formData.append('file', file.slice(chunk * this.chunkSize, (chunk + 1) * this.chunkSize))
      formData.append('name', file.name)
      formData.append('chunk', chunk)
      formData.append('maxChunk', maxChunk)
      formData.append('guid', guid)
      this.$http.post(uploadUrl, formData).then(resJson => {
        this.loading = false
        if (!resJson.result.completed) {
          this.fileUpload(uploadUrl, option, ++chunk, guid)
        } else {
          this.$message.success('文件上传成功')
          option.onProgress({ percent: 100 })
          option.onSuccess()
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
