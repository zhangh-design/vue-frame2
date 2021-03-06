<template>
  <div :class="{'basic-layout2-container': true}">
    <base-border-layout v-bind="layout">
      <template v-slot:north>
        <top-view2 ref="topView2" :title="title"></top-view2>
      </template>
      <template v-slot:west>
        <base-nav-menu
          ref="menu"
          :menus="menus"
          v-bind="menuProps"
          :navTitle="navTitle"
          @select="handleSelect"
        >
        </base-nav-menu>
      </template>
      <template v-slot:center>
        <base-border-layout :class="{'bg-fff': true}" v-bind="innerLayout">
          <template v-slot:north>
            <div class="mt-8">
              <base-bread-crumb
                separator-class="el-icon-arrow-right"
                :options="breadCrumbOptions"
                @bread-click="onBreadClick"
              ></base-bread-crumb>
            </div>
          </template>
          <template v-slot:center>
            <div :class="[{'full-y': true}, {'bg-fff': true}]">
              <base-route-view
                :keep-alive="false"
                :key="$route.fullPath"
              ></base-route-view>
            </div>
          </template>
        </base-border-layout>
      </template>
    </base-border-layout>
  </div>
</template>

<script>
import TopView2 from './components/top-view2.vue';
import {
  DEFAULT_SETTINGS
} from '@config/index.js';
import _last from 'lodash/last';
import _split from 'lodash/split';
import _isEmpty from 'lodash/isEmpty';
import _drop from 'lodash/drop';
import _concat from 'lodash/concat';
import _get from 'lodash/get';
import _map from 'lodash/map';
import _cloneDeep from 'lodash/cloneDeep';

export default {
  name: 'Basic2Layout',
  provide: function () {
    return {
      getBase2Layout: this
    };
  },
  components: { TopView2 },
  props: {
    // 顶部栏目标题文字
    title: {
      type: String,
      default: DEFAULT_SETTINGS.title
    }
  },
  data() {
    return {
      layout: {
        northHeight: '60px',
        westWidth: 'auto',
        eastWidth: '0px',
        southHeight: '0px',
        northCls: 'north-cls'
      },
      innerLayout: {
        northHeight: '30px',
        westWidth: '0px',
        eastWidth: '0px',
        southHeight: '0px',
        northCls: 'border-bottom'
      },
      navTitle: '示例平台',
      menus: [],
      menuProps: {
        collapsed: DEFAULT_SETTINGS.collapsed, // 侧栏收起状态
        defaultActive: '',
        textColor: '#BFCBD9',
        activeTextColor: '#409EFF',
        navIcon: 'el-icon-menu',
        backgroundColor: '#304156',
        collapseText: '收起导航',
        collapsePosition: 'bottom'
      },
      breadCrumbOptions: [],
      buttonGroup: []
    };
  },
  created() {
    // setTimeout(() => {
    // this.menuProps.collapsed = false;
    // }, 3000);
  },
  methods: {
    /**
     * @desc 设置 menus
     */
    setMenus(menus) {
      this.menus = menus;
    },
    /**
     * @desc 获取 menus
     */
    getMenus() {
      return this.menus;
    },
    /**
     * @desc 菜单激活回调
     */
    handleSelect(key, keyPath) {
      // this.checkedFirstMenu2BlockIndex = this.$refs.topView2.buttonGroupOption.defaultActive;
      this.$refs.topView2.setCheckedFirstMenu2BlockIndex(this.$refs.topView2.buttonGroupOption.defaultActive);
      const aKeyPathList = _drop(_split(_last(keyPath), '-'), 1);
      let menu = null;
      const menuList = [];
      for (let i = 0, len = aKeyPathList.length; i < len; i++) {
        if (i === 0) {
          menu = this.menus[aKeyPathList[i]];
        } else {
          menu = menu.children[aKeyPathList[i]];
        }
        menu && menuList.push(menu);
      }
      if (
        this.$route.name !== menu.menuCode &&
        !_isEmpty(menu) &&
        menu.menuCode !== ''
      ) {
        this.menuProps.defaultActive = key; // 设置选中的菜单
        this.breadCrumbOptions = _concat(
          { text: _get(this.$refs.topView2.checkedFirstMenu, 'menuName', '') },
          _map(menuList, menu => ({ text: menu.menuName }))
        ); // 设置面包屑
        // 外部链接
        if (_has(menu, 'target') && menu.target === 'out') {
          const currentRoute = this.$router.resolve({ name: menu.menuCode });
          const target = _get(currentRoute, 'route.meta.target', '_blank');
          const fullPath = _get(currentRoute, 'route.fullPath', '');
          if (fullPath.length > 0) {
            const routeData = this.$router.resolve({
              path: fullPath
            });
            window.open(routeData.href, target);
          }
        } else {
          this.$router.push({ name: menu.menuCode });
        }
      } else {
        // 调用路由对应页面的 routerActivated 方法
        const { matched } = this.$router.currentRoute;
        if (!_isEmpty(matched) && !_isNil(matched[matched.length - 1].instances.default.$options.routerActivated)) {
          const that = matched[matched.length - 1].instances.default;
          that.$options.routerActivated.call(that);
        }
      }
    },
    /**
     * @desc 设置面包屑
     * @param {string[]} options - 面包屑参数
     * this.getBaseLayout().appendBreadCrumbOptions([{text: 'hello'},{text: 'world'}])
     */
    setBreadCrumbOptions(options = []) {
      if (_isArray(options)) {
        this.breadCrumbOptions = options;
      }
    },
    /**
     * @desc 追加面包屑
     * @param {string[]} options - 面包屑参数
     * @example
     * this.getBaseLayout().appendBreadCrumbOptions([{text: 'hello'},{text: 'world'}])
     */
    appendBreadCrumbOptions(options = []) {
      if (_isArray(options)) {
        this.breadCrumbOptions = _concat(this.breadCrumbOptions, options);
      }
    },
    /**
     * @desc 删除面包屑
     * @example
     * @param {array[]} name - 面包屑名字
     * this.getBaseLayout().removeBreadCrumbOptions()
     */
    removeBreadCrumbOptions(name = []) {
      const breadCrumbOptions = [];
      if (name && this.breadCrumbOptions.length > 0) {
        // _drop(this.breadCrumbOptions, this.breadCrumbOptions.length);
        for (const item of this.breadCrumbOptions) {
          if (!name.includes(item.text)) {
            breadCrumbOptions.push(item);
          }
        }
      }
      this.breadCrumbOptions = _cloneDeep(breadCrumbOptions);
    },
    /**
     * @desc 面包屑点击事件
     * @event
     */
    onBreadClick(option, event) {
      const { matched } = this.$router.currentRoute;
      if (!_isEmpty(matched) && !_isNil(matched[matched.length - 1].instances.default)) {
        const that = matched[matched.length - 1].instances.default;
        _has(that, 'breadClickEvent') && that.breadClickEvent(option);
      }
    }
  }
};
</script>
