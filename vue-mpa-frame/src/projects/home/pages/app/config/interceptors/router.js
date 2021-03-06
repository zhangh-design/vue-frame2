/**
 * @desc 路由拦截器
 */
import NProgress from 'nprogress';
import _has from 'lodash/has';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import store, { sStorageKey } from '../../store/index.js';
import {
  WINDOW_TITLE_UPDATE,
  ROUTER_WHITE_LIST,
  LOGIN_PAGE_NAME,
  ROOT_PAGE_NAME
} from '../index.js';
/**
 * @desc 全局前置守卫
 * @param {*} to
 * @param {*} from
 * @param {*} next
 */
const routerBeforeEachFunc = function(to, from, next) {
  NProgress.start();
  const bEnvNoLogin = process.env['VUE_APP_NO-LOGIN']; // 环境变量
  if (bEnvNoLogin && from.name !== LOGIN_PAGE_NAME) {
    NProgress.done();
    return next(); // 免登逻辑，直接进from的路由，这样只适合调试页面
  }
  if ('title' in to.meta && WINDOW_TITLE_UPDATE) {
    document.title = to.meta.title;
  }
  // 白名单直接跳转
  if (ROUTER_WHITE_LIST.includes(to.name)) {
    NProgress.done();
    return next();
  }
  const loginStatus = store.getters['platform/getLoginStatus'];
  const appStatus = store.getters['platform/getAppStatus'];
  // 未登录状态且要跳转的页面不是登录页
  if (!loginStatus && to.name !== LOGIN_PAGE_NAME) {
    NProgress.done();
    // 这里需要注意：有个name这个的意思是会在进入一次 beforeEach 钩子，如果next()这样则表示放过这个路由直接进入到路由指定的那个component组件
    return next({ name: LOGIN_PAGE_NAME });
  }
  if (appStatus && _isEmpty(from.matched)) {
    // 已登录并且应用已经初始化完成，刷新页面-载入字典数据
    if (_has(window.localStorage, sStorageKey)) {
      const oStorage = JSON.parse(_get(window.localStorage, sStorageKey, '{}'));
      store.dispatch('platform/setApiHeaderParams', {
        token: oStorage.platform.token
      });
    }
  }
  // 已登录未初始化完成，加载菜单
  if (loginStatus && !appStatus && to.name === ROOT_PAGE_NAME) {
    Promise.all([
      store.dispatch('platform/fetchMenus'),
      store.dispatch('platform/getDict')
    ])
      .then(() => {
        next();
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        NProgress.done();
      });
  }
  next();
};

/**
 * @desc 全局后置路由钩子
 * @param {*} to
 * @param {*} from
 * @example window滚动条返回顶部、路由加载完成控制全局进度条
 */
const routerAfterEachFunc = function(to, from) {
  NProgress.done();
  // 路由已经进入删除路由的打开类型
  if (_has(to.meta, 'toType')) {
    delete to.meta.toType;
  }
  if (_has(from.meta, 'toType')) {
    delete from.meta.toType;
  }
  // 进入新路由后，重置滚动条到顶部
  // 如果路由基本配置中已配置 'scrollBehavior' 则可以隐藏下面的代码
  /* if (document.body.scrollHeight > window.innerHeight) {
    window.scrollTo(0, 0)
  } */
};

/**
 * @desc 浏览器刷新
 * @example 在刷新时会执行到 router.onReady 可以处理把数据放入 localStorage 或 cookie 中的操作
 */
const routerOnReady = function() {
  // 判断 token 是否有效，无效直接打开登录页
  // if(){}
  // 刷新页面路由权限 isOpen 判断
  // if(){}
  // 页面刷新重新设置 request.headers
  /* if (_has(window.localStorage, 'appVuex')) {
    const oStorage = JSON.parse(_get(window.localStorage, 'appVuex', '{}'));
    store.dispatch('platform/setApiHeaderParams', {
      token: oStorage.platform.token
    });
  } */
};

export { routerBeforeEachFunc, routerAfterEachFunc, routerOnReady };
