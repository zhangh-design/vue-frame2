/**
 * 精简 vuex 的 modules 引入
 * 动态载入各个模型
 */
import _camelCase from 'lodash/camelCase';

const requireModule = require.context('./module', false, /\.js$/);
const modules = {};
requireModule.keys().forEach(fileName => {
  // Don't register this file as a Vuex module
  if (fileName === './index.js') return;
  const moduleName = _camelCase(fileName.replace(/(\.\/|\.js)/g, ''));
  modules[moduleName] = {
    ...requireModule(fileName)
  }.default;
});
export default modules;
