/**
 * @desc 项目配置
 */
import { requestErrorCallback } from './interceptors/api.js';

const WINDOW_TITLE_UPDATE = true; // 是否允许在路由 BeforeEach 钩子中修改标题
const HOST_PLATFORM = 'WEB'; // 当前的宿主平台
// 登陆路由名称
const LOGIN_PAGE_NAME = 'login';
// 根路由名称
const ROOT_PAGE_NAME = 'root';
// 开启Cookie使用，数据在Cookie中存储的天数，默认1天
const cookieExpires = 1;
// CONST 默认参数配置 sep：命名空间分隔符
const CONST_DEFAULT_CONFIG = {
  sep: '/'
};
// basic-layout.vue 配置
const DEFAULT_SETTINGS = {
  title: 'Vue 多页面 app', // 顶部栏目标题文字
  iconfontUrl: () => {
    return require('@assets/images/logo.png');
  }, // 顶部栏目图标
  collapsed: false, // 侧边菜单栏是否收缩
  titleClick(event) {
    // 顶部栏目标题文字-点击事件
    const { path } = this.$route;
    if (path !== '/') {
      this.$router.push({ name: ROOT_PAGE_NAME });
    }
  }
};
// 路由白名单
const ROUTER_WHITE_LIST = ['404', '401', '403', '500', 'helper'];
// 路由默认配置
const ROUTER_DEFAULT_CONFIG = {
  mode: 'history', // 路由模式 hash、history
  base: '/app/', // 注意和文件目录保持一致
  transitionOnLoad: true,
  scrollBehavior: () => ({ y: 0 })
};
// api 接口模型配置参数
const USER_API_CONFIG = {
  mockBasePath: '/', // mock 为 true 时使用的地址，如：https://yapi.tianli.shop/mock/438/
  mock: true, // mock 总开关
  console_request_enable: false,
  console_response_enable: true,
  request_error_callback: requestErrorCallback, // 请求出现后置拦截器错误进入的方法
  api_server_code: {
    WRONG_CODE: ['9999', '-1', '040003', '020000', '020001'], // 异常-会被插件拦截器拦截
    TOKEN_EXPIRE_CODE: '4785848583', // token 过期 `020001`这里的token我是随意写了一个目的是不让进`interceptor/api.js`逻辑，（后端标准版无法提供一个唯一的 code 值，所以`interceptor/api.js`这里不用这个来做判断，先用返回 `mesg` 的`无效token`来做判断）
    AUTH_REFRESH_API: '/api/authentication-server/oauth/token' // 刷新 token 的接口名称 `/mock/user/refresh`
  } // 请求服务码
};
// axios实例配置参数
const USER_AXIOS_CONFIG = {
  baseURL: process.env.BASE_API,
  timeout: 5000
};

export {
  WINDOW_TITLE_UPDATE,
  HOST_PLATFORM,
  LOGIN_PAGE_NAME,
  ROOT_PAGE_NAME,
  cookieExpires,
  CONST_DEFAULT_CONFIG,
  DEFAULT_SETTINGS,
  ROUTER_WHITE_LIST,
  ROUTER_DEFAULT_CONFIG,
  USER_API_CONFIG,
  USER_AXIOS_CONFIG
};
