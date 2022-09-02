/*
 * @Author: Chendapeng
 * @Date: 2022-04-12 22:23:54
 * @LastEditors: Chendapeng
 * @LastEditTime: 2022-09-02 10:47:28
 * @Description:
 */
import { defineConfig } from 'dumi';

// const path = require('path');
// const lastPath = path.resolve(__dirname, 'src')
export default defineConfig({
  title: '@chendapeng',
  favicon: 'https://pica.zhimg.com/v2-5cc11a3ba02cd7827cda429546f7bacf_xl.jpg?source=32738c0c',
  logo: 'https://pica.zhimg.com/v2-5cc11a3ba02cd7827cda429546f7bacf_xl.jpg?source=32738c0c',
  outputPath: 'docs-dist',
  locales: [
    ['zh-CN', '中文'],
    ['en-US', 'English'],
  ],
  navs: [
    null,
    {
      title: 'Blog',
      path: 'https://niaogege.cn',
    },
  ],
  mode: 'site',
  // base: '/cpp-ui',
  // publicPath: '/cpp-ui/',
  // exportStatic: { htmlSuffix: process.env.NODE_ENV === 'production' ? true : false },
  // more config: https://d.umijs.org/config
  // chainWebpack(memo, { env, webpack, createCSSRule }) {
  //    // 设置 alias
  //    memo.resolve.alias.set('cpp_ui', lastPath);

  //   //  memo.resolve.alias.set('cpp_ui', '/tmp/a/b/foo');
  // },
  nodeModulesTransform: {
    type: 'none',
  },
  sass: {},
  // dynamicImport: {
  //   loading: '@/Loading',
  // },
});
