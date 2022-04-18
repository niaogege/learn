# @cpp/ui

生活很快，码代码快乐点！为啥选择 dumi?

- 组件显示的属性通过 ts 配置能自动帮你生成表格类型的 md 文档，这样写完组件和组件 demo，组件的使用方式也基本搞定了
- 部署发布很便捷，内部集成了*gh-pages*以及配置了 github 单页服务
- 组件调试很方便，省去了以前的*npm link & unlink*方式

## 踩坑记录

### 关于路由配置

当前页面为啥放在博客页面的一个子路由， _/cpp-ui_，在部署的时候，一开始发现生成的静态资源拿不到，后面看到是相对路径不对，

```ts
import { defineConfig } from 'dumi';
export default defineConfig({
  publicPath: '/cpp-ui/',
});
```

改完之后能访问到静态资源 _umi.js_，但是路径还是不对，然后配置了下*base*,官网描述：设置路由前缀，通常用于部署到非根目录。

```ts
import { defineConfig } from 'dumi';
export default defineConfig({
  publicPath: '/cpp-ui/',
  base: '/cpp-ui',
});
```

### 配置 scss

参考这篇[踩坑：如何在 Umi 中配置使用 Sass?](https://www.yuque.com/cherishtheyouth/kw0nhk/oudd6p)

```ts
import { defineConfig } from 'dumi';
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  sass: {},
});
```

### 发布 npm 包

这次我把自己相关的包都发到了专属的 scope-**niaogege**下里，我一开始以为要花钱，发布试了下参数，**npm publish --access=public**

- npm login
- npm publish --access=public

两步即可，赶紧去抢自己的专属 scope 吧,目前专属的 scope 一共有两种方式，一自己新建一个组织，二就是自己的用户名，我为啥能发布 **@niaogege/cpp-ui** 就是这个原因

> npm --force unpublish @niaogege/cpp-ui

### ts 相关报错

- error TS2307: Cannot find module '*.svg' or its corresponding type declarations. 解决之道: 主要原因是因为在 ts 里，svg 格式采用了<code>img</code>标签包裹了，执行*tsc\*命令的时候会出现，换了一种方式，每个 svg 都放到一个组件里，然后在导出即可

## Getting Started

Install dependencies,

```bash
$ npm i
```

Start the dev server,

```bash
$ npm start
```

Build documentation,

```bash
$ npm run docs:build
```

Run test,

```bash
$ npm test
```

Build library via `father-build`,

```bash
$ npm run build
```
