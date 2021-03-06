/**
 * @desc 个人中心
 */
const index = [
  {
    path: '/personal',
    name: 'personal',
    meta: { title: '个人中心' },
    component: () =>
      import(
        /* webpackChunkName:"bank/views/personal" */ '@bank_views/personal/index.vue'
      ),
    children: [
      {
        path: 'detail',
        name: 'detail',
        meta: { title: '详情', approve: true }, // approve 用于设置详情页等不在菜单中的路由
        component: () =>
          import(
            /* webpackChunkName:"bank/views/personal/detail" */ '@bank_views/personal/detail/index.vue'
          )
      }
    ]
  }
];

export default index;
