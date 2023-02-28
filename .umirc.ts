/*
 * @Author: Chendapeng
 * @Date: 2022-04-12 22:23:54
 * @LastEditors: Chendapeng
 * @LastEditTime: 2023-02-24 17:49:15
 * @Description:
 */
import { defineConfig } from 'dumi';

// const path = require('path');
// const lastPath = path.resolve(__dirname, 'src')
export default defineConfig({
  title: '@chendapeng',
  favicon: 'https://www.bythewayer.com/img/logo1.webp',
  logo: 'https://www.bythewayer.com/img/logo1.webp',
  outputPath: 'docs-dist',
  locales: [
    ['zh-CN', '中文'],
    ['en-US', 'English'],
  ],
  navs: [
    null,
    {
      title: 'Blog',
      path: 'https://bythewayer.com',
    },
    {
      title: 'Record',
      path: 'https://bythewayer.com/love',
    },
  ],
  mode: 'site',
  base: '/learn/',
  publicPath: '/learn/',
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
