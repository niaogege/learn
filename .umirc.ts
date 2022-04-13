/*
 * @Author: Chendapeng
 * @Date: 2022-04-12 22:23:54
 * @LastEditors: Chendapeng
 * @LastEditTime: 2022-04-13 11:52:56
 * @Description: 
 */
import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'cpp-ui',
  favicon: 'https://s2.loli.net/2022/04/12/5gOhrAGakuTdQXc.jpg',
  logo: 'https://s2.loli.net/2022/04/12/5gOhrAGakuTdQXc.jpg',
  outputPath: 'docs-dist',
  locales: [
    ['zh-CN', '中文'],
    ['en-US', 'English'],
  ],
  navs: [
    null,
    {
      title: 'GitHub',
      path: 'https://github.com/niaogege/cpp-ui',
    },
    {
      title: 'Blog',
      path: 'https://niaogege.cn',
    }
  ],
  mode: 'site',
  // more config: https://d.umijs.org/config
});
