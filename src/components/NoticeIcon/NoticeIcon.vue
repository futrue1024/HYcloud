<template>
  <a-popover
    v-model="visible"
    trigger="click"
    placement="bottomRight"
    overlayClassName="header-notice-wrapper"
    :getPopupContainer="() => $refs.noticeRef.parentElement"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    :overlayStyle="{ width: '300px', top: '50px' }"
  >
    <template slot="content">
      <a-spin :spinning="loading">
        <a-tabs>
          <a-tab-pane tab="消息" key="1">
            <a-list>
              <a-list-item v-for="msg in myMessages" :key="msg.id">
                <a-list-item-meta :title="msg.title" :description="msg.sendTimeFriend">
                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"/>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-tab-pane>
          <a-tab-pane tab="通知" key="2">
            <a-list>
              <a-list-item v-for="notice in myNotices" :key="notice.id">
                <a-list-item-meta :title="notice.title" :description="notice.createTime">
                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"/>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-tab-pane>
          <a-tab-pane tab="待办" key="3">
            <a-list>
              <a-list-item v-for="task in myTasks" :key="task.id">
                <a-list-item-meta :title="task.title" :description="task.createTime">
                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"/>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </template>
    <span @click="fetchNotice" class="header-notice" ref="noticeRef" style="padding: 0 18px">
      <a-badge :count="unreadNumber">
        <a-icon style="font-size: 16px; padding: 4px" type="bell" />
      </a-badge>
    </span>
  </a-popover>
</template>

<script>
export default {
  name: 'HeaderNotice',
  data () {
    return {
      loading: false,
      visible: false,
      unreadNumber: 0,
      myMessages: [],
      myNotices: [],
      myTasks: []
    }
  },
  mounted () {
    this.getUnreadNumber()
  },
  methods: {
    fetchNotice () {
      if (!this.visible) {
        this.loading = true
        const parmas = {
          pageIndex: 1,
          pageSize: 5,
          queryType: 2, // 我接收到的
          status: 0, // 未读消息
          sortField: 'sendTime',
          sortType: 'desc'
        }
        this.$http.post('/message/search', parmas).then(resJson => {
          this.loading = false
          this.myMessages = resJson.result.datas
        })
        .catch(() => { this.loading = false })
      } else {
        this.loading = false
      }
      this.visible = !this.visible
    },
    getUnreadNumber () {
      this.$http.get('/message/my-unread-message-number', {}).then(resJson => {
        this.loading = false
        this.unreadNumber = resJson.result
      })
      .catch(() => { this.loading = false })
    }
  }
}
</script>

<style lang="css">
  .header-notice-wrapper {
    top: 50px !important;
  }
</style>
<style lang="less" scoped>
  .header-notice{
    display: inline-block;
    transition: all 0.3s;

    span {
      vertical-align: initial;
    }
  }
</style>
