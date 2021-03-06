<template>
  <div :class="[$style.container, ctCls.box]">
    <base-border-layout v-bind="layout">
      <template v-slot:north>
        <top-view
          ref="topView"
          :title="title"
          :subtitle="subtitle"
          :iconfontUrl="iconfontUrl"
          :collapsed="collapsed"
          :titleClick="titleClick"
          :renderDropColumnDown="renderDropColumnDown"
          :renderDropDown="renderDropDown"
          :renderLoginOut="renderLoginOut"
          :ctCls="{
            left: 'my-top-view1'
          }"
          v-if="renderTopView"
        ></top-view>
      </template>
      <template v-slot:west>
        <base-nav-menu
          ref="menu"
          :menus="menus"
          v-bind="menuProps"
          @select="handleSelect"
          :svgIcons="svgIcons"
          navTitle="导航标题"
          @collapse="onMenuCollapse"
        >
        </base-nav-menu>
      </template>
      <template v-slot:center>
        <base-border-layout v-bind="innerLayout">
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
            <div :class="[$style.fullY, $style.bgFff]">
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
// import aplusMixin from '@plugins/aplus/mixin.js'; // 阿里巴巴 aplus.js 埋点
import { ROUTER_OPEN_TYPE, ROOT_PAGE_NAME } from '@config/index.js';
import svgIcons from '@/plugins/icons.js';
import _last from 'lodash/last';
import _split from 'lodash/split';
import _isEmpty from 'lodash/isEmpty';
import _findIndex from 'lodash/findIndex';
import _join from 'lodash/join';
import _find from 'lodash/find';
import _isNil from 'lodash/isNil';
import _get from 'lodash/get';
import _isArray from 'lodash/isArray';
import _concat from 'lodash/concat';
import _has from 'lodash/has';
import _cloneDeep from 'lodash/cloneDeep';
import TopView from './components/top-view.vue';

export default {
  name: 'BasicLayout',
  // mixins: [aplusMixin],
  components: { TopView },
  provide() {
    return {
      getBaseLayout: () => {
        return this;
      }
    };
  },
  // title 顶部栏目标题文字，iconfontUrl 图标，collapsed 侧栏收起状态
  props: {
    // 菜单id，传递值则值显示这个值对应的菜单数据
    menuId: {
      type: [String, Number]
    },
    // 顶部栏目标题文字-副标题
    title: {
      type: String,
      default: '项目名称'
    },
    // 主标题
    subtitle: {
      type: String,
      default: ''
    },
    iconfontUrl: {
      type: Function,
      default: function() {
        return require('@assets/images/logo.png');
      }
    },
    collapsed: {
      type: Boolean,
      default: false
    },
    titleClick: {
      type: Function,
      default: () => {}
    },
    // 渲染 top-view.vue
    renderTopView: {
      type: Boolean,
      default: true
    },
    // 渲染 base-nav-menu 菜单组件
    renderNavMenu: {
      type: Boolean,
      default: true
    },
    // 是否渲染 当前应用 下拉面板
    renderDropColumnDown: {
      type: Boolean,
      default: true
    },
    // 是否渲染 消息 图标和下拉面板
    renderDropDown: {
      type: Boolean,
      default: true
    },
    // 是否渲染 登出 图标
    renderLoginOut: {
      type: Boolean,
      default: true
    },
    // 自定义样式
    ctCls: {
      type: Object,
      default() {
        return {
          box: '',
          north: '',
          west: this.$style.westBox,
          center: _get(this.$style, 'innerCenterCls', ''),
          south: '',
          east: '',
          inner: {
            north: this.$style.innerNorthBox,
            west: '',
            center: this.$style.innerCenterBox,
            south: '',
            east: ''
          }
        };
      }
    },
    // 外围 border 布局的边距
    isPadding: {
      type: Boolean,
      default: false
    },
    // 内部 border 布局的边距
    innerIsPadding: {
      type: Boolean,
      default: true
    }
  },
  data() {
    this.ROOT_PAGE_NAME = ROOT_PAGE_NAME; // 根路由名称
    this.svgIcons = svgIcons;
    return {
      menus: [],
      navTitle: '',
      layout: {
        northHeight: this.renderTopView ? '64px' : '0px',
        westWidth: this.renderNavMenu ? 'auto' : '0px', // 设置为定值时，配合 nav-menu 导航菜单收缩菜单面板之后的宽度还是定值所以这里推荐自动
        eastWidth: '0px',
        southHeight: '0px',
        northCls: `${this.$style.northCls} ${this.ctCls.north}`,
        westCls: `${this.ctCls.west}`,
        eastCls: `${this.ctCls.east}`,
        southCls: `${this.ctCls.south}`,
        centerCls: `${this.ctCls.center}`,
        isPadding: this.isPadding
      },
      innerLayout: {
        northHeight: '30px',
        westWidth: '0px',
        eastWidth: '0px',
        southHeight: '0px',
        northCls: `${this.$style.borderBottom} ${this.ctCls.inner.north}`,
        westCls: `${this.ctCls.inner.west}`,
        eastCls: `${this.ctCls.inner.east}`,
        southCls: `${this.ctCls.inner.south}`,
        centerCls: `${this.ctCls.inner.center}`,
        isPadding: this.innerIsPadding
      },
      menuProps: {
        collapsed: this.collapsed, // 侧栏收起状态
        defaultActive: '',
        textColor: '#BFCBD9',
        navIcon: 'el-icon-menu',
        activeTextColor: '#409EFF',
        backgroundColor: '#304156',
        collapseText: '收起导航',
        collapsePosition: 'bottom',
        disabledKeys: [1, 12] // 禁用的节点
      },
      breadCrumbOptions: []
    };
  },
  watch: {
    // 监听路由改变-路由动态改变
    $route: {
      handler(to, from) {
        if (!_isEmpty(to.matched)) {
          const rootPageName = to.matched[0].name; // 匹配到的路由路径列表，第一个是匹配到的根路由
          if (rootPageName !== this.ROOT_PAGE_NAME) {
            this.ROOT_PAGE_NAME = rootPageName;
          }
          this.setCheckedMenu(to, from);
          this.navTitle = this.getNavTitle();
        }
      },
      immediate: true
    }
  },
  created() {
    setTimeout(() => {
      // this.menuProps.collapsed = true;
      this.menuProps.disabledKeys = []; // 取消禁用的导航菜单节点
    }, 1500);
  },
  methods: {
    getMenus(to, from) {
      if (this.ROOT_PAGE_NAME !== ROOT_PAGE_NAME) {
        let menus = this.$store.getters.getMenus;
        if (!_isNil(this.menuId)) {
          const menuList = [];
          const doWhileFn = children => {
            for (let n = 0, len1 = children.length; n < len1; n++) {
              if (
                children[n].id === this.menuId ||
                `${children[n].id}` === this.menuId
              ) {
                menuList.push(children[n]);
                break;
              }
              if (
                _has(children[n], 'children') &&
                !_isEmpty(children[n].children)
              ) {
                doWhileFn(children[n].children);
              }
            }
          };
          for (
            let i = 0, len = this.$store.getters.getMenus.length;
            i < len;
            i++
          ) {
            const menu = this.$store.getters.getMenus[i];
            if (menu.id === this.menuId || `${menu.id}` === this.menuId) {
              menuList.push(_get(menu, 'children', []));
              break;
            } else {
              if (_has(menu, 'children') && !_isEmpty(menu.children)) {
                doWhileFn(menu.children);
                if (!_isEmpty(menuList)) {
                  break;
                }
              }
            }
          }
          menus = menuList[0];
        } else {
          const getMatchedMenu = function(menus, code) {
            return _find(menus, menu => menu.menuCode === code);
          };
          menus = getMatchedMenu(menus, this.ROOT_PAGE_NAME);
        }
        if (_isNil(menus)) {
          return [];
        }
        this.menus = _has(menus, 'children')
          ? _get(menus, 'children', [])
          : menus;
        return this.menus;
      }
      this.menus = this.$store.getters.getMenus;
      return this.menus;
    },
    /**
     * @desc 设置默认选中项
     */
    setCheckedMenu(to, from) {
      let navMenus = this.getMenus(to, from);
      const aPathKeyList = [];
      for (const value of Object.values(to.matched)) {
        if (value.name !== this.ROOT_PAGE_NAME) {
          const index = _findIndex(
            navMenus,
            menu => menu.menuCode === value.name
          );
          if (index !== -1) {
            navMenus = navMenus[index].children;
            aPathKeyList.push(index);
          }
        }
      }
      if (to.name === this.ROOT_PAGE_NAME) {
        setTimeout(() => {
          this.menuProps.defaultActive = this.$refs.menu.getFirstElMenuItem();
          const index2LastMenu = this.$refs.menu.getLastMenu(
            this.menuProps.defaultActive
          );
          if (!_isNil(index2LastMenu) && !_isEmpty(index2LastMenu.menuCode)) {
            this.$router.push({ name: index2LastMenu.menuCode });
          }
          /* this.$router.push({
            path: `/${this.$refs.menu.getRouterPath(
              this.menuProps.defaultActive
            )}`
          }); */
        }, 0);
      }
      if (to.name !== this.ROOT_PAGE_NAME && !_isEmpty(aPathKeyList)) {
        const sPathKey = _join(aPathKeyList, '-'); // 0-0-1
        setTimeout(() => {
          this.menuProps.defaultActive = sPathKey;
          this.breadCrumbOptions = this.$refs.menu.getKeyPath2BreadCrumbPath(
            sPathKey
          ); // 设置面包屑
        }, 0);
      }
    },
    /**
     * @desc 菜单激活回调
     */
    handleSelect(key, keyPath) {
      const aKeyPathList = _split(_last(keyPath), '-');
      let menu = null;
      for (let i = 0, len = aKeyPathList.length; i < len; i++) {
        if (i === 0) {
          menu = this.menus[aKeyPathList[i]];
        } else {
          menu = menu.children[aKeyPathList[i]];
        }
      }
      if (
        this.$route.name !== menu.menuCode &&
        !_isEmpty(menu) &&
        menu.menuCode !== ''
      ) {
        // 外部链接
        if (_has(menu, 'target') && menu.target === 'out') {
          const currentRoute = this.$router.resolve({ name: menu.menuCode });
          const target = _get(currentRoute, 'route.meta.target', '_blank');
          if (_includes(menu.menuCode, 'http')) {
            window.open(menu.menuCode, target);
          } else {
            const fullPath = _get(currentRoute, 'route.fullPath', '');
            if (fullPath.length > 0) {
              const routeData = this.$router.resolve({
                path: fullPath
              });
              window.open(routeData.href, target);
            }
          }
        } else {
          const currentRoute = this.$router.resolve({ name: menu.menuCode });
          _set(currentRoute, 'resolved.meta.toType', ROUTER_OPEN_TYPE.menu); // 标识路由是从菜单点击打开的
          this.$router.push({ name: menu.menuCode });
        }
      } else {
        // 调用路由对应页面的 routerActivated 方法
        const { matched } = this.$router.currentRoute;
        if (
          !_isEmpty(matched) &&
          !_isNil(
            matched[matched.length - 1].instances.default.$options
              .routerActivated
          )
        ) {
          const that = matched[matched.length - 1].instances.default;
          that.$options.routerActivated.call(that);
        }
      }
    },
    getNavTitle() {
      if (this.ROOT_PAGE_NAME !== ROOT_PAGE_NAME) {
        const menus = _find(
          this.$store.getters.getMenus,
          menu => menu.menuCode === this.ROOT_PAGE_NAME
        );
        if (_isNil(menus)) {
          return '';
        }
        return menus.menuName;
      }
      return this.title;
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
      if (
        !_isEmpty(matched) &&
        !_isNil(matched[matched.length - 1].instances.default)
      ) {
        const that = matched[matched.length - 1].instances.default;
        _has(that, 'breadClickEvent') && that.breadClickEvent(option);
      }
    },
    /**
     * @desc 导航栏面板收缩事件
     */
    onMenuCollapse(val) {
      console.log('导航栏面板收缩事件', val);
    }
  }
};
</script>
<style lang="less" module>
@import './basic-layout.less';
.container {
}
</style>
