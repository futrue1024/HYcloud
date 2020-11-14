<template>
  <div id="userLayout" :class="['user-layout-wrapper', device]">
    <div class="container">
      <div class="top">
        <div class="header">
          <a href="/">
            <img class="logo" src="../assets/hylogo.png" alt="华云" style="width: 3%">
            <span class="title">华云网络</span>
          </a>
        </div>
        <div class="desc"></div>
      </div>

      <route-view></route-view>

      <div class="footer">
        <!-- <div class="links">
          <a href="_self">帮助</a>
          <a href="_self">隐私</a>
          <a href="_self">条款</a>
        </div> -->
        <div class="copyright">
          <p><a href="http://www.beian.miit.gov.cn/" target="_blank"></a> Copyright &copy; 2020 山东华云网络技术有限公司. All Rights
            Reserved</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RouteView from './RouteView'
import { mixinDevice } from '@/utils/mixin'

export default {
  name: 'UserLayout',
  components: { RouteView },
  mixins: [mixinDevice],
  data () {
    return {}
  },
  mounted () {
    document.body.classList.add('userLayout')
  },
  beforeDestroy () {
    document.body.classList.remove('userLayout')
  }
}
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  height: 100%;
  background: #f0f2f5 url(~@/assets/login_bg.jpeg) no-repeat 50%;

  &.mobile {
    .container {
      .main {
        max-width: 368px;
        width: 98%;
      }
    }
  }

  .container {
    width: 100%;
    min-height: 100%;
    background-size: 100%;
    padding: 110px 0 144px;
    position: relative;

    a {
      text-decoration: none;
    }

    .top {
      text-align: center;

      .header {
        height: 44px;
        line-height: 44px;

        .badge {
          position: absolute;
          display: inline-block;
          line-height: 1;
          vertical-align: middle;
          margin-left: -12px;
          margin-top: -10px;
          opacity: 0.8;
        }

        .logo {
          margin-top: -14px;
          margin-right: 10px;
        }

        .title {
          font-size: 36px;
          color: rgba(255, 255, 255, );
          font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }

      .desc {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }

    .main {
      min-width: 260px;
      width: 368px;
      margin: 0 auto;
    }

    .footer {
      position: absolute;
      width: 100%;
      bottom: 0;
      padding: 0 16px;
      margin: 48px 0 24px;
      text-align: center;

      .links {
        margin-bottom: 8px;
        font-size: 14px;

        a {
          color: rgba(0, 0, 0, 0.45);
          transition: all 0.3s;

          &:not(:last-child) {
            margin-right: 40px;
          }
        }
      }

      .copyright {
        color: rgb(255, 255, 255, 1);
        font-size: 14px;
      }
    }
  }
}
</style>

<style scoped>
.main {
  width: 100% !important;
  height: 100% !important;
  max-width: 400px !important;
  padding: 50px 20px !important;
  background-color: rgb(255, 255, 255, 0.3) !important;
  margin: 0 auto !important;
  border-radius: 20px !important;
  z-index: 999 !important;
}
</style>
