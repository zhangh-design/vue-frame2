/**
 * 常量接口配置
 * 常量枚举
 * 入口文件
 * 常量统一管理,防止数据源的到处冗余
 * 动态载入各个api领域模型
 */
import camelCase from 'lodash/camelCase';

const requireModule = require.context('./module', true, /\.js$/);
const modules = {};
requireModule.keys().forEach(fileName => {
  if (fileName === './index.js') return;
  let moduleName = '';
  if (fileName.split('/').length > 2) {
    moduleName = fileName.replace(/(\.\/|\.js)/g, '');
  } else {
    moduleName = camelCase(fileName.replace(/(\.\/|\.js)/g, ''));
  }
  modules[moduleName] = {
    ...requireModule(fileName)
  }.default;
});
export default modules;
