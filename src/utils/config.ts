const Logo = require('../assets/logo.png');

const API = process.env.NODE_ENV === 'production' ? '' : '/api';

const config = {
  name: '品贤画室管理平台',
  footerText: '品贤画室管理平台  2018 - 2019 © 品贤画室',
  logo: Logo,
  icon: '/favicon.ico',
  API,
  openPages: ['/login', '/404', '/401'], // 全屏页面
  noLoginList: ['#/login'],
};

export default config;
