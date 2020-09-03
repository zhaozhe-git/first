module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // 全局注入sass变量、函数、混合, 第一个@符号是css关键字, 第二个@符号代表src文件夹, 不可缺少分号(;)
        data: `@import '@/css/_vw_func.scss';`
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use('style-vw-loader')
      .loader('style-vw-loader');
    config.plugin('define').tap(args => {
      args[0]['process.env'].BUILD_ENV = JSON.stringify(process.env.BUILD_ENV);
      console.log(args[0]);
      return args;
    });
  }
};
