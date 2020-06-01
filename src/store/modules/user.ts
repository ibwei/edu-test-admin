import axios from 'axios';
import config from '@/utils/config';
import {router, asyncRouterMap, constantRouterMap} from '@/router';
import {routerItem} from '@/interface';

interface UserData {
  username: string;
  userid: string;
  avatarUri: string;
  email: string;
}

function filterAsyncRouter(AsyncRouterMap: routerItem[], permission: string[]): routerItem[] {
  const routerMap = AsyncRouterMap.filter(item => {
    if (typeof item.permission === 'string') {
      return permission.indexOf(item.permission) > -1;
    }
    if (item.permission instanceof Array) {
      const filter = item.permission.filter(items => permission.indexOf(items) > -1);
      if (filter.length && item.children) {
        item.children = filterAsyncRouter(item.children, permission);
      }
      return filter.length;
    }
    return item.permission;
  });
  return routerMap;
}

const hasPermission = (permission: string[]) => {
  // 过滤路由
  const filterRouter = filterAsyncRouter(asyncRouterMap, permission);
  // 添加路由的时候排除掉dashboard
  router.addRoutes(filterRouter);
  return filterRouter;
};

const user = {
  state: {
    user: {
      username: '',
      userid: '',
      avatar_uri: '',
      email: '',
    },
    roles: [],
    permission_routers: [],
    spinning: true,
  },
  mutations: {
    SAVEROLES: (state: any, roles: Array<any>) => {
      state.roles = roles;
    },
    SVAEUSER: (state: any, userData: UserData) => {
      state.user = userData;
    },
    LOADING: (state: any, loading: boolean) => {
      state.spinning = loading;
    },
  },
  actions: {
    getUserInfo: (context: any) =>
      new Promise((resolve, reject) => {
        context.commit('LOADING', false);
        window.api
          .getUserInfo({})
          .then(res => {
            context.commit('LOADING', true);
            const {resultCode, resultMessage, data} = res.data;
            let userData: UserData;
            if (!resultCode) {
              userData = {
                username: data.user.name,
                userid: data.user.id,
                avatarUri: data.user.avatar_uri
                  ? data.user.avatar_uri
                  : 'https://tva3.sinaimg.cn/crop.0.0.158.158.180/005EVJkgjw8fbkfzbat9cj304e04emx7.jpg?KID=imgbed,tva&Expires=1576394014&ssig=neYN0OauDX',
                email: data.user.email,
              };
              context.commit('SVAEUSER', userData);
              context.commit('SAVEROLES', data.permissions);
              const getRouter = hasPermission(data.permissions);
              context.dispatch('GetMenuData', getRouter);
              resolve(data);
            } else {
              reject(resultMessage);
            }
          })
          .catch((error: any) => {
            context.commit('LOADING', true);
            reject(error);
          });
      }),
  },
};

export default user;
