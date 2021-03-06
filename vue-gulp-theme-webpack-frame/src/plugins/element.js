/**
 * @desc 公共引入
 */
// ElementUI组件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import Vue from 'vue';

Vue.use(ElementUI, {
  size: 'small'
});
Vue.use(ElementUI);
Vue.prototype.$message = ElementUI.Message;
function messageFun(message, type = 'success') { // type success/warning/info/error
  ElementUI.Message({
    type,
    message,
    customClass: 'global-message-cls'
  });
}
function success(message) {
  messageFun(message);
}
function fail(message) {
  messageFun(message, 'error');
}
function info(message) {
  messageFun(message, 'info');
}
function warn(message) {
  messageFun(message, 'warn');
}
Vue.prototype.$successMsg = success;
Vue.prototype.$errorMsg = fail;
Vue.prototype.$infoMsg = info;
Vue.prototype.$warnMsg = warn;
