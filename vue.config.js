const Mock = require('./src/mock/index');

module.exports = {
  chainWebpack: config => {
    config.module
      .rule('tsx')
      .test(/\.tsx$/)
      .use('vue-jsx-hot-loader')
      .before('babel-loader')
      .loader('vue-jsx-hot-loader');
    config.plugin('html').tap(args => {
      args[0].chunksSortMode = 'none';
      return args;
    });
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'primary-color': '#727CF5',
          'link-color': '#727CF5',
          'success-color': '#0ACF97',
          'warning-color': '#FFBC00',
          'error-color': '#FA5C7C',
          'border-radius-base': '3px',
          'border-radius-sm': '2px',
          'shadow-color': 'rgba(0,0,0,0.05)',
          'shadow-1-down': '4px 4px 40px @shadow-color',
          'border-color-split': '#f4f4f4',
          'border-color-base': '#e5e5e5',
          'font-size-base': '13px',
          'text-color': '#666',
        },
      },
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1/api', // 开发环境地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/',
        },
      },
    },
    /* before(app) {
      Mock(app);
    }, */
  },
};
