import Vue from 'vue';
import Router, { RouterOptions } from 'vue-router';
import { routerItem } from '@/interface';

//const getComponent = require('./import_development');

// 不需要权限判断的路由
export const constantRouterMap: routerItem[] & RouterOptions['routes'] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/user/index'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index'),
  },
  {
    path: '/user',
    name: '用户管理',
    component: () => import('../views/user/index'),
  },
  {
    path: '/user/update',
    name: '更改密码',
    component: () => import('../views/user/password'),
  },
  {
    path: '/part',
    name: '题库板块管理',
    component: () => import('../views/part/index'),
  },
  {
    path: '/question',
    name: '题目管理',
    component: () => import('../views/question/index'),
  },
  {
    path: '/test',
    name: '测试管理',
    component: () => import('../views/test/index'),
  },
  {
    path: '/test/detail',
    name: '测试管理',
    component: () => import('../views/test/detail/index'),
  },
  {
    path: '*',
    name: '异常',
    // @ts-ignore
    component: () => import('../views/error/404.vue'),
    meta: { key: '异常' },
  },
];
/**
 * permission 有3种类型： Boolean Array String
 * Boolean值的情况，为true，有权限，为false，没有权限
 * Array值的情况，只要其中一个有，就有权限，
 * String值，会匹配vuex里面的perssions数组，如果有，就有权限
 * meta.key 这个是用来匹配缓存的，请确保key值和对应页面的class名称一致，否则页面无法正常缓存
 */
export const asyncRouterMap: routerItem[] = [
  {
    path: '/user',
    icon: 'user',
    name: '用户管理',
    component: () => import('../views/user/index'),
    permission: true,
    meta: { key: 'User' },
  },
  {
    path: '/part',
    icon: 'appstore',
    name: '板块管理',
    component: () => import('../views/part/index'),
    permission: true,
    meta: { key: 'Part' },
  },
  {
    path: '/question',
    icon: 'question-circle',
    name: '题目管理',
    permission: true,
    component: () => import('../views/question/index'),
    meta: { key: 'Question' },
  },
  {
    path: '/test',
    icon: 'file-text',
    name: '测试管理',
    permission: true,
    component: () => import('../views/test/index'),
    meta: { key: 'Test' },
  },
  {
    path: '*',
    icon: 'bank',
    name: '异常',
    // @ts-ignore
    component: () => import('../views/error/404.vue'),
    permission: false,
    meta: { key: '异常' },
  },
];

Vue.use(Router);

export const router = new Router({
  routes: constantRouterMap,
});
