import Vue from 'vue';
import Router, { RouterOptions } from 'vue-router';
import { routerItem } from '@/interface';

//const getComponent = require('./import_development');

// 不需要权限判断的路由
export const constantRouterMap: routerItem[] & RouterOptions['routes'] = [
  {
    path: '/dashboard',
    name: '数据看板',
    component: () => import('../views/dashboard/index'),
    meta: { key: 'Dashboard' },
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/dashboard/index'),
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
    path: '/studio',
    name: '画室管理',
    component: () => import('../views/studio/index'),
    meta: { key: 'Studio' },
  },
  {
    path: '/environment',
    name: '画室环境管理',
    component: () => import('../views/environment/index'),
    meta: { key: 'environment' },
  },
  {
    path: '/course',
    name: '课程管理',
    component: () => import('../views/course/index'),
    meta: { key: 'Course' },
  },
  {
    path: '/courseEnroll',
    name: '在线报名',
    component: () => import('../views/courseenroll/index'),
    meta: { key: 'CourseEnroll' },
  },
  {
    path: '/feedback',
    name: '反馈管理',
    component: () => import('../views/feedback/index'),
    meta: { key: 'Feedback' },
  },
  {
    path: '/article',
    name: '文章管理',
    component: () => import('../views/article/index'),
    meta: { key: 'Article' },
  },
  {
    path: '/studentWorks',
    name: '学生作品管理',
    component: () => import('../views/studentWorks/index'),
    meta: { key: 'StudentWorks' },
  },
  {
    path: '/banner',
    name: '轮播图片管理',
    component: () => import('../views/banner/index'),
    meta: { key: 'Banner' },
  },
  {
    path: '/teacherDetail',
    name: '教师管理',
    component: () => import('../views/teacher/index'),
    meta: { key: 'teacherDetail' },
    children: [
      {
        path: '/teacherDetail',
        name: '教师列表',
        component: () => import('../views/teacher/index'),
        meta: { key: 'teacherDetail' },
      },
      {
        path: '/teacherDetail',
        name: '教师评论',
        component: () => import('../views/teacher/index'),
        meta: { key: 'teacherDetail' },
      },
    ],
  },
  {
    path: '/analytics',
    name: '统计分析',
    component: () => import('../views/analytics/index'),
    meta: { key: 'analytic' },
    children: [
      {
        path: '/google',
        name: '谷歌统计',
        component: () => import('../views/analytics/google/index'),
        meta: { key: 'google' },
      },
      {
        path: '/baidu',
        name: '百度统计',
        component: () => import('../views/analytics/baidu/index'),
        meta: { key: 'baidu' },
      },
    ],
  },
  {
    path: '/galleryPictures',
    name: '3D画廊图片',
    component: () => import('../views/galleryPictures/index'),
    meta: { key: 'GalleryPictures' },
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
    path: '/dashboard',
    icon: 'dashboard',
    name: '数据看板',
    component: () => import('../views/dashboard/index'),
    permission: true,
    meta: { key: 'Dashboard' },
  },
  {
    path: '/studio',
    icon: 'home',
    name: '画室管理',
    component: () => import('../views/studio/index'),
    permission: true,
    meta: { key: 'Studio' },
  },
  {
    path: '/user',
    icon: 'user',
    name: '用户管理',
    component: () => import('../views/user/index'),
    permission: true,
    meta: { key: 'User' },
  },
  {
    path: '/course',
    icon: 'book',
    name: '课程管理',
    component: () => import('../views/course/index'),
    permission: true,
    meta: { key: 'Course' },
  },
  {
    path: '/courseEnroll',
    icon: 'pay-circle',
    name: '在线报名',
    component: () => import('../views/courseenroll/index'),
    permission: true,
    meta: { key: 'CourseEnroll' },
  },
  {
    path: '/schedule',
    icon: 'table',
    name: '预约管理',
    component: () => import('../views/teacher/index'),
    permission: true,
    meta: { key: 'teacherDetail' },
    children: [
      {
        path: 'detail',
        name: '课程安排',
        icon: 'table',
        component: () => import('../views/schedule/list/index'),
        meta: { key: 'teacherDetail' },
      },
      {
        path: 'check',
        name: '预约审核',
        icon: 'safety',
        component: () => import('../views/schedule/check/index'),
        meta: { key: 'teacherDetail' },
      },
      {
        path: 'comment',
        name: '预约列表',
        icon: 'unordered-list',
        // @ts-ignore
        component: () => import('../views/schedule/book/index.vue'),
        meta: { key: 'teacherDetail' },
      },
    ],
  },
  {
    path: '/article',
    icon: 'file-text',
    name: '文章管理',
    component: () => import('../views/article/index'),
    permission: true,
    meta: { key: 'Article' },
    children: [
      {
        path: 'list',
        name: '文章列表',
        icon: 'unordered-list',
        component: () => import('../views/article/list/index'),
        meta: { key: 'teacherDetail' },
      },
      {
        path: 'comment',
        name: '评论审核',
        icon: 'safety',
        component: () => import('../views/article/comment/index'),
        meta: { key: 'teacherDetail' },
      },
    ],
  },
  {
    path: '/teacher',
    icon: 'team',
    name: '教师管理',
    component: () => import('../views/teacher/index'),
    permission: true,
    meta: { key: 'teacherDetail' },
    children: [
      {
        path: 'detail',
        name: '教师列表',
        icon: 'unordered-list',
        component: () => import('../views/teacher/detail/index'),
        meta: { key: 'teacherDetail' },
      },
      {
        path: 'comment',
        name: '评论审核',
        icon: 'safety',
        component: () => import('../views/teacher/comment/index'),
        meta: { key: 'teacherDetail' },
      },
    ],
  },
  {
    path: '/feedback',
    icon: 'smile',
    name: '反馈管理',
    component: () => import('../views/feedback/index'),
    permission: true,
    meta: { key: 'Feedback' },
  },
  {
    path: '/galleryPictures',
    icon: 'switcher',
    name: '3D画廊图片',
    component: () => import('../views/galleryPictures/index'),
    permission: true,
    meta: { key: 'GalleryPictures' },
  },
  {
    path: '/studentWorks',
    icon: 'gitlab',
    name: '学生作品管理',
    component: () => import('../views/studentWorks/index'),
    permission: true,
    meta: { key: 'StudentWorks' },
  },
  {
    path: '/banner',
    icon: 'chrome',
    name: '轮播图片管理',
    component: () => import('../views/banner/index'),
    permission: true,
    meta: { key: 'Banner' },
  },
  {
    path: '/environment',
    icon: 'bank',
    name: '画室环境管理',
    component: () => import('../views/environment/index'),
    permission: true,
    meta: { key: 'environment' },
  },
  {
    path: '/analytics',
    name: '统计分析',
    permission: true,
    icon: 'area-chart',
    component: () => import('../views/analytics/index'),
    meta: { key: 'analytic' },
    children: [
      {
        path: 'google',
        name: '谷歌统计',
        icon: 'google',
        component: () => import('../views/analytics/google/index'),
        meta: { key: 'google' },
      },
      {
        path: 'baidu',
        name: '百度统计',
        icon: 'search',
        component: () => import('../views/analytics/baidu/index'),
        meta: { key: 'baidu' },
      },
    ],
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
