# cpp-ui

生活很快，码代码快乐点！

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

两步即可，赶紧去抢自己的专属 scope 吧

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
