# cpp-ui

生活很快，码代码快乐点！

## 关于路由配置
当前页面为啥放在博客页面的一个子路由， */cpp-ui*，在部署的时候，一开始发现生成的静态资源拿不到，后面看到是相对路径不对，
```ts
import { defineConfig } from 'dumi';
export default defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
})
```
改完之后能访问到静态资源 *umi.js*，但是路径还是不对，然后配置了下*base*,官网描述：设置路由前缀，通常用于部署到非根目录。

```ts
import { defineConfig } from 'dumi';
export default defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  base: '/cpp-ui',
})
```

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
