'use strict';
/**
 * webpack 打包自定义扩展配置文件
 */
module.exports = {
  // 网站名称
  sys_app_title: 'vue-mpa-frame', // 网站名称，html 的 title 标签
  prodConsoleType: ['error', 'warn'], // 生产环境，则自动清理掉打印的日志，但保留 error 与 warn
  compact: 'auto', // 可选值 boolean | "auto" 打包构建时是否检测构建文件的体积，体积 max 为 500000 字节，有的 npm 资源包体积较大（如`gojs`）构件时会error报错（go.js as it exceeds the max of 500kb）这时可把这个值改为 false 放弃检测，不会报错了但因为资源包大会导致打包速度变慢
  //  如果需要使用相对单位那么设置为 true（会自动使用 vw+rem+postcss 方案，css中的单位就要使用 pr 而不是 px ），mobile 中的 pages 的 plan 属性如果是 pr2rem 才会启用
  pr2RemRootValue: 750, // 设计图为750px（默认值为750px对应移动端设计图）
  isBundleAnalyzer: false, // 是否使用 webpack-bundle-analyzer 进行打包分析
  removePages: ['futures'], // 剔除某几个 page 不进行打包 ['futures']
  mobile: {
    pages: [
      {
        page: 'futures', // bank 项目使用相对单位
        plan: 'rem' // rem、pr2rem
      }
    ]
  }, // 移动端配置
  pageHtmlOptions: {
    bank: {
      title: '银行端'
    }
  }, // 网页参数配置
  providePlugin: {
    $: 'jquery',
    jQuery: 'jquery',
    Vue: 'vue',
    _get: ['lodash', 'get'],
    _set: ['lodash', 'set'],
    _map: ['lodash', 'map'],
    _has: ['lodash', 'has'],
    _isEmpty: ['lodash', 'isEmpty'],
    _includes: ['lodash', 'includes'],
    _forEach: ['lodash', 'forEach'],
    _findIndex: ['lodash', 'findIndex'],
    _assign: ['lodash', 'assign'],
    _concat: ['lodash', 'concat'],
    _isNil: ['lodash', 'isNil'],
    _omit: ['lodash', 'omit'],
    _pick: ['lodash', 'pick'],
    _findLastIndex: ['lodash', 'findLastIndex'],
    _isArray: ['lodash', 'isArray'],
    _split: ['lodash', 'split'],
    _join: ['lodash', 'join'],
    _last: ['lodash', 'last'],
    _find: ['lodash', 'find'],
    _keys: ['lodash', 'keys'],
    _filter: ['lodash', 'filter'],
    _cloneDeep: ['lodash', 'cloneDeep']
  }, // 提供全局的变量
  // 抽离库不打包到构建文件中减小构建包体积，但要通过 script 标签在外部引入（单页 html-webpack-externals-plugin,多页 html-webpack-tags-plugin）
  externals: {
    echarts: 'echarts',
    axios: 'axios',
    nprogress: 'NProgress',
    jquery: 'jQuery',
    d3: 'd3',
    cloud: 'd3-cloud'
  },
  // 默认后缀
  extensions: ['.js', '.vue'],
  // 自定义 alias 别名
  useAlias: {
    '@': 'src',
    '@public': 'public',
    '@static': 'static',
    '@node_modules': 'node_modules',
    '@assets': 'src/assets',
    '@config': 'src/config',
    '@filters': 'src/filters',
    '@plugins': 'src/plugins',
    '@utils': 'src/utils',
    '@projects': 'src/projects',
    '@packages': 'src/packages',
    '@directives': 'src/directives',
    '@bank': 'src/projects/tdbd/pages/bank',
    '@bank_views': 'src/projects/tdbd/pages/bank/views',
    '@app': 'src/projects/home/pages/app',
    '@app_views': 'src/projects/home/pages/app/views'
  },
  // 指定的依赖库不会被 splitChunks 分割到 otherDependencies 缓存组内
  removeOtherDependenciesCacheGroupsLibs: [
    'vue-router',
    'vue',
    'vuex',
    'core-js',
    'axios',
    'nprogress',
    'echarts',
    'element-ui'
  ],
  // 配置某些包使用 CDN，externals 需要同步配置，版本请注意 package.json
  cdnMap: {
    // 直接放入到 html 文件中，不用和 externals 匹配，开发和生产都会放入
    outsideJs: [
      // 'https://webapi.amap.com/maps?key=f7ac15a8687e70001f0d8f9e65007f09&v=1.4.15&plugin=Map3D,AMap.DistrictSearch,Loca,AMap.DistrictLayer,SimpleMarker,DistrictExplorer,' // 高德地图
      // 'https://cdn.bootcdn.net/ajax/libs/d3/5.16.0/d3.min.js', // d3
      // 'https://cdn.bootcdn.net/ajax/libs/d3-cloud/1.2.5/d3.layout.cloud.min.js'
      {
        path:
          'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.js',
        async: true,
        defer: true
      },
      {
        path: 'https://cdn.bootcdn.net/ajax/libs/jspdf/1.5.3/jspdf.min.js',
        async: true,
        defer: true
      },
      {
        path: 'https://cdn.bootcdn.net/ajax/libs/d3/5.16.0/d3.min.js'
      },
      {
        path:
          'https://cdn.bootcdn.net/ajax/libs/d3-cloud/1.2.5/d3.layout.cloud.min.js'
      }
    ],
    outsideCss: [],
    // 公共的一些js，会注入到所有项目的 html 页面中，externals 需要同步配置，HtmlWebpackTagsPlugin插件
    js: [
      '/static/plugins/axios/0.18.0/axios.min.js',
      '/static/plugins/nprogress/0.2.0/nprogress.min.js'
      // '/static/plugins/echarts/4.7.0/echarts.min.js' // 看项目内是否有使用到 echarts.min.js
    ],
    css: [], // 可以在这里配置，也可以在 public/link.html 中维护，HtmlWebpackTagsPlugin插件
    // css: ['//libs.cdnJs.net/normalize/8.0.1/normalize.min.css']
    /* css: [
      '/static/plugins/css/normalize.min.css',
      '/static/plugins/css/nprogress.min.css'
    ] */
    // 各个项目包需要注入的一些js
    pages: [
      {
        page: 'bank',
        js: ['/static/plugins/echarts/4.7.0/echarts.min.js'],
        css: ['/static/plugins/my-test/a.css']
      },
      {
        page: 'futures',
        js: ['/static/plugins/my-test/a.js']
      }
    ]
  },
  // 需要经过 babel 处理和 webpack 构建的外部 js
  babelCdnMap: {
    pages: [
      {
        page: 'bank',
        // 不要重名
        modules: [{ name: 'aaa', js: '@static/plugins/babel-modules/a.js' }]
      }
    ]
  }
};
