<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <rightButton type="primary" icon="plus" :click="addData" code="role-add">添加</rightButton>
    </div>

    <a-timeline>
      <a-timeline-item
        color="green"
        v-for="log in data"
        :key="log.id">
        <p>{{ log.title }} ~ {{ log.upgradeDate }} <a-tag color="#f50">{{ log.version }}</a-tag></p>
        <p v-for="(detail, index) in log.details" :key="log.id + index">{{ detail }}</p>
      </a-timeline-item>
    </a-timeline>

    <edit-form ref="editForm" :afterSubmit="getDataList"></edit-form>
  </a-card>
</template>

<script>
import editForm from './edit'
import rightButton from '@/components/tools/RightButton'

export default {
  components: {
    editForm,
    rightButton
  },
  mounted () {
    this.getDataList()
  },
  data () {
    return {
      data: [],
      loading: false
    }
  },
  methods: {
    // 拉取表格数据
    getDataList () {
      this.loading = true
      this.$http.get('/upgradelog/top-100', {}).then(resJson => {
        this.loading = false
        this.data = resJson.result
      })
      .catch(err => {
        this.$message.error('加载失败:' + err.response.data.message)
        this.loading = false
      })
    },
    // 添加
    addData () {
      this.$refs.editForm.add()
    }
  }
}
</script>
