import Vue from 'vue';
import { message } from 'ant-design-vue';
// 自定义全局组件
//@ts-ignore
import FilterTable from '@/components/FilterTable/index.vue';

import App from '@/App';
import { router } from '@/router';
import { store } from '@/store';
import config from '@/utils/config';
import Api from '@/api/api';

import i18n from './locales/index';

import './styles/global.less';

const Apis = new Api({
  baseUrl:
    process.env.NODE_ENV === 'production'
      ? 'http://www.paintingapi.pinxianhs.com/api'
      : '/api',
});
// 全局api
// 配置接口

//拦截路由

window.api = Apis.api;
// 第三方接口
window.ajax = Apis;

// Vue.use(VueInsProgressBar, options);
Vue.prototype.$message = message;
Vue.component('filter-table', FilterTable);

Vue.config.productionTip = false;

// Vue.mixin({
//   beforeRouteLeave(to, from, next) {
//     const vnode = (this as any).$vnode;
//     if (from && from.meta.rank && to.meta.rank && from.meta.rank > to.meta.rank) {
//       if (vnode && vnode.data.keepAlive) {
//         if (vnode.parent && vnode.parent.componentInstance
//            && vnode.parent.componentInstance.cache) {
//           if (vnode.componentOptions) {
//             const key = vnode.key == null
//               ? vnode.componentOptions.Ctor.cid +
// (vnode.componentOptions.tag ? `::${vnode.componentOptions.tag}` : '')
//               : vnode.key;
//             const cache = vnode.parent.componentInstance.cache;
//             const keys = vnode.parent.componentInstance.keys;
//             if (cache[key]) {
//               if (keys.length) {
//                 const index = keys.indexOf(key);
//                 if (index > -1) {
//                   keys.splice(index, 1);
//                 }
//               }
//               delete cache[key];
//             }
//           }
//         }
//       }
//       this.$destroy();
//     }
//     next();
//   },
// });

let flag: boolean = true;
// 路由拦截，权限验证和菜单生成
router.beforeEach((to, from, next) => {
  if (!store.state.app.menuData.length && flag) {
    // 判断是否获取到菜单数据,并且只执行一次
    flag = false;
    store
      .dispatch('getUserInfo')
      .then(() => {
        const toPath = config.noLoginList.indexOf(`#${to.path}`) > -1 ? '/user' : to.path;
        store.dispatch('AddTabPane', toPath).then(() => {
          next({
            path: toPath,
            query: to.query,
            params: to.params,
            replace: true,
          });
        });
      })
      .catch((err: any) => {
        console.log(err);
        if (config.noLoginList.indexOf(to.path) < 0) {
          next({ name: 'login', replace: true });
        }
        next();
      });
  }
  next();
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
