/**
 * @desc 路由拦截器
 */
import NProgress from 'nprogress';
import { HOME_ROUTER_NAME } from '@config/index.js';
import { WINDOW_TITLE_UPDATE, ROUTER_WHITE_LIST } from '../index.js';
import store from '../../store/index.js';
import router from '../../router/index.js';
import _isEmpty from 'lodash/isEmpty';
import _has from 'lodash/has';
/**
 * @desc 全局前置守卫
 * @param {*} to
 * @param {*} from
 * @param {*} next
 */
const routerBeforeEachFunc = function(to, from, next) {
  NProgress.start();
  const bEnvNoLogin = process.env['VUE_APP_NO-LOGIN']; // 环境变量
  if (bEnvNoLogin && !store.getters['platform/getLoginStatus']) {
    NProgress.done();
    return next(); // 免登逻辑，直接进from的路由，这样只适合调试页面
  }
  // 没有匹配到路由项则回退到 from 的路由
  if (_isEmpty(to.matched)) {
    NProgress.done();
    next(from);
    return;
  }
  if (_has(to.meta, 'isOpen') && !to.meta.isOpen) {
    NProgress.done();
    next('*'); // 404页面
    return;
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
  // 未登录状态，跳转到登录子项目
  if (!loginStatus) {
    NProgress.done();
    window.location.href = HOME_ROUTER_NAME;
    return;
  }
  // 已登录未初始化完成，加载菜单
  if (loginStatus && !appStatus) {
    Promise.all([
      store.dispatch('platform/fetchMenus'),
      store.dispatch('platform/getDict')
    ])
      .then(() => {
        return store.dispatch('platform/setRouter');
      })
      .then(() => {
        // 判断路由是否有权限访问
        if (_has(to, 'meta.isOpen') && !to.meta.isOpen) {
          router.push({ path: '404' });
        }
      })
      .finally(() => {
        next();
        NProgress.done();
      });
    return;
  }
  if (appStatus && _isEmpty(from.matched)) {
    // 已登录并且应用已经初始化完成，刷新页面-载入字典数据
    // 页面刷新重新设置 request.headers
    store.dispatch('platform/setApiHeaderParams', {
      token: store.getters['platform/getToken']
    });
    Promise.all([
      store.dispatch('platform/getDict'),
      store.dispatch('platform/setRouter')
    ])
      .then(() => {
        if (_has(to, 'meta.isOpen') && !to.meta.isOpen) {
          router.push({ name: '404' });
        }
      })
      .finally(() => {
        next();
        NProgress.done();
      });
    return;
  }
  // 已登录并且初始化完成，组装路由参数
  /* if (loginStatus && appStatus) {
    store.dispatch('platform/setRouter').then(() => {
      if (_has(to, 'meta.isOpen') && !to.meta.isOpen) {
        next({ path: '404' });
      } else {
        next();
      }
    }).finally(() => {
      NProgress.done();
    });
    return;
  } */
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
const routerOnReady = function(to) {
  // 判断 token 是否有效，无效直接打开登录页
  // if(){}
  // 刷新页面检测当前路由权限
  /* const loginStatus = store.getters['platform/getLoginStatus'];
  if (loginStatus) {
    // 载入字典数据
    store.dispatch('platform/getDict');
    store.dispatch('platform/setRouter').then(() => {
      if (_has(to, 'meta.isOpen') && !to.meta.isOpen) {
        router.push({ name: '404' });
      }
    });
  }
  // 页面刷新重新设置 request.headers
  store.dispatch('platform/setApiHeaderParams', {
    token: store.getters['platform/getToken']
  }); */
};

export { routerBeforeEachFunc, routerAfterEachFunc, routerOnReady };
