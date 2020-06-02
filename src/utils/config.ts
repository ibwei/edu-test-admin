const Logo = require('../assets/logo.png');

const API = process.env.NODE_ENV === 'production' ? '' : '/api';

const config = {
  name: '拾加拾教育管理平台',
  footerText: '拾加拾教育管理平台  2020 © 拾加拾教育',
  logo: Logo,
  icon: '/favicon.ico',
  API,
  openPages: ['/login', '/404', '/401'], // 全屏页面
  noLoginList: ['#/login'],
};

export const ColorArray = ['pink', 'red', 'orange', 'cyan', 'green', 'blue', 'purple', 'geekblue', 'magenta', 'volcano', 'gold', 'lime'];

export default config;
