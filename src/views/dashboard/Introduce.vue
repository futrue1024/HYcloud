<template>
  <div></div>
  <!--  <a-row :gutter="24">-->
  <!--    <a-col :span="24">-->
  <!--      <div style="background-color:#FFFFFF;margin-bottom: 10px;">-->
  <!--        <div style="background-color:#FFFFFF;">-->
  <!--          <a-list itemLayout="vertical" size="large" style="margin:0 12px;">-->
  <!--            <a-list-item>-->
  <!--              <a-list-item-meta description="搬砖专家 - 某某某事业部 - 某某技术部 - 专家">-->
  <!--                <a slot="title">您好，JuCheap，祝你开心每一天</a>-->
  <!--                <a-avatar slot="avatar" src="/img/avatar.png" :size="72" />-->
  <!--              </a-list-item-meta>-->
  <!--            </a-list-item>-->
  <!--          </a-list>-->
  <!--        </div>-->
  <!--      </div>-->

  <!--      <div style="margin:10px 0 10px 0;">-->
  <!--        <a-row style="margin: 0 -12px">-->
  <!--          <a-col-->
  <!--            style="padding: 0 12px"-->
  <!--            :xl="24"-->
  <!--            :lg="24"-->
  <!--            :md="24"-->
  <!--            :sm="24"-->
  <!--            :xs="24">-->
  <!--            <a-card class="project-list" style="margin-bottom: 24px;" :bordered="false" title="JuCheap资料" :body-style="{padding: 0}">-->
  <!--              <a slot="extra">more>></a>-->
  <!--              <div>-->
  <!--                <a-card-grid>-->
  <!--                  <a-card :bordered="false" :body-style="{padding: 0}">-->
  <!--                    <a-card-meta description="JuCheap支持多租户">-->
  <!--                      <div slot="title" class="card-title">-->
  <!--                        <a-avatar size="small" src="/img/avatar.png" />-->
  <!--                        <a>多租户系统</a>-->
  <!--                      </div>-->
  <!--                    </a-card-meta>-->
  <!--                  </a-card>-->
  <!--                </a-card-grid>-->
  <!--                <a-card-grid>-->
  <!--                  <a-card :bordered="false" :body-style="{padding: 0}">-->
  <!--                    <a-card-meta description="使用Net Core 3.0开发">-->
  <!--                      <div slot="title" class="card-title">-->
  <!--                        <a-avatar size="small" src="/img/avatar.png" />-->
  <!--                        <a>Net Core 3.0</a>-->
  <!--                      </div>-->
  <!--                    </a-card-meta>-->
  <!--                  </a-card>-->
  <!--                </a-card-grid>-->
  <!--                <a-card-grid>-->
  <!--                  <a-card :bordered="false" :body-style="{padding: 0}">-->
  <!--                    <a-card-meta description="NetCore + Vue-Antd-Pro">-->
  <!--                      <div slot="title" class="card-title">-->
  <!--                        <a-avatar size="small" src="/img/avatar.png" />-->
  <!--                        <a>前后端分离</a>-->
  <!--                      </div>-->
  <!--                    </a-card-meta>-->
  <!--                  </a-card>-->
  <!--                </a-card-grid>-->
  <!--                <a-card-grid>-->
  <!--                  <a-card :bordered="false" :body-style="{padding: 0}">-->
  <!--                    <a-card-meta description="IdentityServer4做身份认证，支持Jwt认证">-->
  <!--                      <div slot="title" class="card-title">-->
  <!--                        <a-avatar size="small" src="/img/avatar.png" />-->
  <!--                        <a>身份认证</a>-->
  <!--                      </div>-->
  <!--                    </a-card-meta>-->
  <!--                  </a-card>-->
  <!--                </a-card-grid>-->
  <!--                <a-card-grid>-->
  <!--                  <a-card :bordered="false" :body-style="{padding: 0}">-->
  <!--                    <a-card-meta description="项目使用EF Database First模式">-->
  <!--                      <div slot="title" class="card-title">-->
  <!--                        <a-avatar size="small" src="/img/avatar.png" />-->
  <!--                        <a>EntityFrameworkCore</a>-->
  <!--                      </div>-->
  <!--                    </a-card-meta>-->
  <!--                  </a-card>-->
  <!--                </a-card-grid>-->
  <!--                <a-card-grid>-->
  <!--                  <a-card :bordered="false" :body-style="{padding: 0}">-->
  <!--                    <a-card-meta description="Api帮助文档使用Swagger Api">-->
  <!--                      <div slot="title" class="card-title">-->
  <!--                        <a-avatar size="small" src="/img/avatar.png" />-->
  <!--                        <a>Api Swagger</a>-->
  <!--                      </div>-->
  <!--                    </a-card-meta>-->
  <!--                  </a-card>-->
  <!--                </a-card-grid>-->
  <!--                <a-card-grid>-->
  <!--                  <a-card :bordered="false" :body-style="{padding: 0}">-->
  <!--                    <a-card-meta description="使用T4模板批量一键生成代码">-->
  <!--                      <div slot="title" class="card-title">-->
  <!--                        <a-avatar size="small" src="/img/avatar.png" />-->
  <!--                        <a>代码生成</a>-->
  <!--                      </div>-->
  <!--                    </a-card-meta>-->
  <!--                  </a-card>-->
  <!--                </a-card-grid>-->
  <!--                <a-card-grid>-->
  <!--                  <a-card :bordered="false" :body-style="{padding: 0}">-->
  <!--                    <a-card-meta description="前台基于vue-antd-pro开源框架">-->
  <!--                      <div slot="title" class="card-title">-->
  <!--                        <a-avatar size="small" src="/img/avatar.png" />-->
  <!--                        <a>Vue-Antd-Pro</a>-->
  <!--                      </div>-->
  <!--                    </a-card-meta>-->
  <!--                  </a-card>-->
  <!--                </a-card-grid>-->
  <!--                <a-card-grid>-->
  <!--                  <a-card :bordered="false" :body-style="{padding: 0}">-->
  <!--                    <a-card-meta description="更好的支持移动设备,响应式布局">-->
  <!--                      <div slot="title" class="card-title">-->
  <!--                        <a-avatar size="small" src="/img/avatar.png" />-->
  <!--                        <a>移动设备支持</a>-->
  <!--                      </div>-->
  <!--                    </a-card-meta>-->
  <!--                  </a-card>-->
  <!--                </a-card-grid>-->
  <!--              </div>-->
  <!--            </a-card>-->
  <!--          </a-col>-->
  <!--        </a-row>-->
  <!--      </div>-->
  <!--    </a-col>-->

  <!--    <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">-->
  <!--      <a-card title="JuCheap前台项目">-->

  <!--        <h2>## 前台项目是基于Ant Design Pro Vue来设计的</h2>-->

  <!--        <p>基于 <a href="https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn/" target="_blank">[Ant Design of Vue]</a> 作为前台开发框架 </p>-->

  <!--        <p>-->
  <!--          <img src="/img/20190224163345.jpg" title="工作台" style="width:100%"/>-->
  <!--        </p>-->
  <!--        <p>-->
  <!--          <img src="/img/20181126112124.png" title="工作台+设置菜单" style="width:100%"/>-->
  <!--        </p>-->
  <!--        <p>-->
  <!--          <img src="/img/20180916-134251.png" title="个人设置" style="width:100%"/>-->
  <!--        </p>-->

  <!--        <br/>-->

  <!--        <h2>环境和依赖</h2><br/>-->

  <!--        - node<br/>-->
  <!--        - yarn<br/>-->
  <!--        - webpack<br/>-->
  <!--        - eslint<br/>-->
  <!--        - @vue/cli ~3<br/>-->
  <!--        - <a href="https://github.com/vueComponent/ant-design-vue" target="_blank">[ant-design-vue]</a> - Ant Design Of Vue 实现<br/>-->
  <!--        - <a href="https://github.com/xyxiao001/vue-cropper" target="_blank">头像裁剪组件</a><br/>-->
  <!--        - <a href="https://antv.alipay.com/zh-cn/index.html" target="_blank">[@antv/g2]</a> - Alipay AntV 数据可视化图表<br/>-->
  <!--        - <a href="https://viserjs.github.io/docs.html#/viser/guide/installation" target="_blank"> [Viser-vue]</a>  - antv/g2 封装实现<br/>-->

  <!--        > 请注意，我们强烈建议本项目使用 <a href="https://yarnpkg.com/" target="_blank">[Yarn]</a> 包管理工具，这样可以与本项目演示站所加载完全相同的依赖版本 (yarn.lock) 。由于我们没有对依赖进行强制的版本控制，采用非 yarn 包管理进行引入时，可能由于 Pro 所依赖的库已经升级版本而引入了新版本所导致的问题。作者可能会由于时间问题无法及时排查而导致您采用本项目作为基项目而出现问题。<br/>-->

  <!--        <br/>-->

  <!--        <h2>项目下载和运行</h2><br/>-->
  <!--        <a-alert message="安装node.js" type="info" />-->
  <!--        <br/>-->
  <!--        <a-alert message="然后使用npm命令，安装yarn命令包" type="info" />-->
  <!--        <br/>-->
  <!--        <a-alert message="安装依赖: yarn install" type="info" />-->
  <!--        <br/>-->
  <!--        <a-alert message="开发模式运行: yarn run serve" type="info" />-->
  <!--        <br/>-->
  <!--        <a-alert message="编译项目: yarn run build" type="info" />-->
  <!--        <br/>-->
  <!--        <a-alert message="Lints and fixes files: yarn run lint" type="info" />-->

  <!--      </a-card>-->
  <!--    </a-col>-->

  <!--    <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">-->
  <!--      <a-card title="JuCheap后台项目">-->
  <!--        <h2>## JuCheap Core 4.0 后台项目介绍</h2><br/>-->
  <!--        - 后台使用Net Core 3.0 开发，代码一键批量生成(每一个项目文件下都有一个.tt的模板文件，右键->运行自定义工具,就可以生成代码)。<br/><br/>-->
  <!--        - 后端项目采用net core web api来给前端提供api接口，有2个api项目。<br/><br/>-->
  <!--        - 一个是JuCheap.Core.IdentityWeb，用来给api站点提供身份认证的（使用的IdentityServer4做身份认证）。<br/><br/>-->
  <!--        - 另外一个是JuCheap.Core.WebApi接口项目，给前端提供api接口。<br/>-->

  <!--        <br/>-->
  <!--        <h2>## 安装使用</h2><br/>-->

  <!--        - 0 首先找到源代码根目录下面的documents文件夹，里面有数据库初始化脚本(1_db_script_sqlserver.sql和1_db_script_mysqlsql)，分别对应sqlserver和mysql数据库<br/><br/>-->

  <!--        - 1 新建数据库(JuCheapCore4，名字可以随便起，但是连接字符串中需要和这个名字一样)<br/><br/>-->
  <!--        - 2.1 执行上面找到的初始化脚本文件(1_db_script_sqlserver.sql),不同版本的数据，对应不同的脚本文件，暂时支持mysql和sql server<br/><br/>-->
  <!--        - 2.2 项目中需要配置数据库连接的地方有4个地方:<br/><br/>-->
  <!--        分别是JuCheap.Core.IdentityServerWeb/appsettings.json和JuCheap.Core.WebApi/appsettings.json<br/>-->
  <!--        T4模板分别位与JuCheap.Core.Infrastructure/Template/DbHelper.MySql.ttinclude和DbHelper.ttinclude两个文件里面<br/>-->
  <!--        - 3 分别配置2个api项目的连接字符串，都在appsettings.json文件的ConnectionStrings节点中配置<br/><br/>-->
  <!--        - Connection_SqlServer是SqlServer版本的连接字符串<br/><br/>-->
  <!--        - Connection_MySql是MySql版本的连接字符串<br/><br/>-->
  <!--        - DbType是数据库类型，后台会根据这个类型来映射不同的数据库<br/><br/>-->
  <!--        - 分别启动运行两个api项目<br/><br/>-->
  <!--        - 1 用Visual Studio打开JuCheap.Core.sln<br/><br/>-->
  <!--        - 2 在解决方案文件上，右键->属性->启动项目<br/><br/>-->
  <!--        - 3 找到JuCheap.Core.IdentityServerWeb和JuCheap.Core.WebApi两个项目，将操作，都改为“启动”<br/><br/>-->
  <!--        - 4 F5调试项目<br/><br/>-->

  <!--        <br/>-->

  <!--        <h2>## 代码目录结构</h2><br/>-->
  <!--        - 01_Infrastructure 基础<br/><br/>-->
  <!--        - JuCheap.Core.Infrastructure 基础设施<br/><br/>-->
  <!--        - 02_Data 数据访问<br/><br/>-->
  <!--        - JuCheap.Core.Data 数据访问层，包含实体和DbContext文件<br/><br/>-->
  <!--        - 03_Repository 仓储项目相关<br/><br/>-->
  <!--        - JuCheap.Core.IRepository 仓储接口<br/><br/>-->
  <!--        - JuCheap.Core.Repository 仓储接口实现<br/><br/>-->
  <!--        - 04_Service 服务<br/><br/>-->
  <!--        - JuCheap.Core.Model 数据模型<br/><br/>-->
  <!--        - JuCheap.Core.IService 服务接口<br/><br/>-->
  <!--        - JuCheap.Core.Service 服务实现<br/><br/>-->
  <!--        - 05_Application 应用项目(api)<br/><br/>-->
  <!--        - JuCheap.Core.IdentityServerWeb 身份认证api项目<br/><br/>-->
  <!--        - JuCheap.Core.WebApi 业务数据api项目<br/><br/>-->
  <!--        - 99_Test 测试<br/><br/>-->
  <!--        - JuCheap.Core.Test 单元测试项目<br/>-->
  <!--        <br/>-->
  <!--        <h2>## T4代码模板生成</h2><br/>-->
  <!--        - 每个项目文件里面都有一个.tt的T4模板，右击该tt文件，运行该自定义文件，可以根据数据库里面表，来生成对应的实体类、仓储接口/实现、数据模型Dto类型 和 服务接口/服务实现<br/><br/>-->

  <!--        - **注意：T4模板的数据库访问帮助类，放在JuCheap.Core.Infrastructure/Template下面**<br/><br/>-->
  <!--        - DbHelper.ttinclude对应SqlServer的配置，连接字符串在文件里面开头配置<br/><br/>-->
  <!--        - DbHelper.MySql.ttinclude对应Mysql的配置，连接字符串在文件里面开头配置<br/><br/>-->
  <!--        - **T4模板生成的代码文件，不要手动修改，否则下次运行T4模板后，修改的内容会被覆盖。如果要修改文件，请复制一份到对应项目的BaseExt文件夹下面，做扩展。**<br/><br/>-->

  <!--        <br/>-->
  <!--        <h2>## 关于依赖注入</h2><br/>-->
  <!--        - 依赖注入的接口文件在JuCheap.Core.Service/JuCheapModuleInitializer.cs文件里面，包含了数据库上下文的注册，以及仓储/服务接口/AutoMapper的配置注册，都在这里面，默认是不需要做任何改动的，如果需要修改注册方式，都统一在此文件中做变更。<br/>-->

  <!--        <br/>-->

  <!--        <h2>## 技术栈</h2><br/>-->
  <!--        - EntityFrameworkCore (ORM)<br/>-->
  <!--        - 仓储模式<br/>-->
  <!--        - 工作单元<br/>-->
  <!--        - net core 3.0<br/>-->
  <!--        - T4模板 (代码一键生成)<br/>-->
  <!--        - IdentityServer4 统一身份认证<br/>-->
  <!--        - NLog 日志记录<br/>-->
  <!--      </a-card>-->

  <!--      <br/>-->

  <!--      <a-card title="支持项目">-->
  <!--        <img src="/img/pay.jpg" style="width:100%"/>-->
  <!--        <a-alert message="联系方式QQ：359484089" banner />-->
  <!--        <a-alert message="由于越来越多的人购买JuCheap, 之前是提供免费的服务支持，作者已不堪重负，所以从此版本后，198的价格只包含代码费用，不包含服务支持费用，如需服务支持，请购买（198元/个月，600元/年，支持按月购买服务支持）。" banner />-->
  <!--      </a-card>-->
  <!--    </a-col>-->
  <!--  </a-row>-->
</template>
