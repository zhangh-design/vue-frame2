/**
 * @desc 需要挂载(注入)到根实例的都放在这里
 */
import axios from '@plugins/axios/axios.js';
import DataDictFilter from '@plugins/data-dict-filter/index.js';
import vBus from '@plugins/v-bus.js';
import log from '@plugins/log.js'; // 彩色 log
import ApiConfig from '../service/api/index.js';
import { USER_API_CONFIG, USER_AXIOS_CONFIG } from '../config/index.js';
import {
  apiRequestStartHandler,
  apiRequestEndHandler,
  apiRequestInterceptErrorHandler
} from '../config/interceptors/api.js';
import moduleConst from './constant.js';
import ApiFilterExpand from './axios/filter.js';
import LoaderApiLibrary from './axios/api.js';

export default {
  install: (Vue, options = {}) => {
    const Loader = new LoaderApiLibrary(
      ApiConfig,
      USER_API_CONFIG,
      USER_AXIOS_CONFIG,
      ApiFilterExpand // 设置自定义扩展拦截器类
    );
    window.apiRequestStartHandler = apiRequestStartHandler;
    window.apiRequestEndHandler = apiRequestEndHandler;
    window.apiRequestInterceptErrorHandler = apiRequestInterceptErrorHandler;

    const dictInstance = new DataDictFilter({ label: 'name', code: 'id' });

    // 载入本包中的字典
    dictInstance.import(import('../service/data-dict/index.js'));

    Object.defineProperty(Vue.prototype, '$loaderApiLibrary', {
      value: Loader
    });
    Object.defineProperty(Vue.prototype, '$api', { value: Loader.api });
    Object.defineProperty(Vue.prototype, '$axios', { value: axios });
    Object.defineProperty(Vue.prototype, '$dict', { value: dictInstance });
    Object.defineProperty(Vue.prototype, '$vBus', { value: vBus });
    Object.defineProperty(Vue.prototype, '$constant', { value: moduleConst });
    Object.defineProperty(window, '$log', { value: log });
  }
};
