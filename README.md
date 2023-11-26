# @cpp/learn

[![wakatime](https://wakatime.com/badge/github/niaogege/learn.svg)](https://wakatime.com/badge/github/niaogege/learn)

生活很快，码代码快乐点！为啥选择 dumi?

- 组件显示的属性通过 ts 配置能自动帮你生成表格类型的 md 文档，这样写完组件和组件 demo，组件的使用方式也基本搞定了
- 部署发布很便捷，内部集成了*gh-pages*以及配置了 github 单页服务
- 组件调试很方便，省去了以前的*npm link & unlink*方式

## 踩坑记录

采用 cdn 域名加速之后，每次资源更新都需要收到刷新缓存，要命了

### 关于路由配置

当前页面为啥放在博客页面的一个子路由， **/learn**，在部署的时候，一开始发现生成的静态资源拿不到，后面看到是相对路径不对，

```ts
import { defineConfig } from 'dumi';
export default defineConfig({
  publicPath: '/learn/',
});
```

改完之后能访问到静态资源 _umi.js_，但是路径还是不对，然后配置了下*base*,官网描述：设置路由前缀，通常用于部署到非根目录。

```ts
import { defineConfig } from 'dumi';
export default defineConfig({
  publicPath: '/learn/',
  base: '/learn',
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

### 发布到个人一级站点 bytheway.com

阿里云和腾讯云部署

切记需要切换到 bytheway 分支，然后手动上次静态资源，如何做到，如果是打包能自动部署，也就是自动把打包后的资源上传到服务器的指定路径就好了？ ———————— 已解决，通过 githubAction 进行自动化部署,请看 **/.github/workflows/deploy.yml**文件

```js
name: Deploy

on:
  push:
    branches:
      - main

env:
  TARGET_DIR: /www/web/learn

jobs:
  deploy:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16.x]
    steps:
      - name: Checkout # 步骤1
        uses: actions/checkout@v1 # 使用的动作。格式：userName/repoName。作用：检出仓库，获取源码。 官方actions库：https://github.com/actions

      - name: Use Node.js # 步骤2
        uses: actions/setup-node@v1 # 作用：安装nodejs
        with:
          node-version: ${{ matrix.node-version }} # 版本

      - run: npm install --frozen-lockfile
      - name: Build
        run: npm run docs:build

      - name: Deploy Server
        uses: cross-the-world/ssh-scp-ssh-pipelines@latest
        env:
          WELCOME: 'ssh scp ssh pipelines CPP server'
          LASTSSH: 'after copying success'
        with:
          host: '111.230.199.157'
          user: 'root'
          pass: ${{ secrets.FTP_PASSWORD }}
          connect_timeout: 20s
          first_ssh: |-
            rm -rf $TARGET_DIR
            echo $WELCOME
            mkdir -p $TARGET_DIR
          scp: |-
            './docs-dist/*' => $TARGET_DIR/
          last_ssh: |-
            echo $LASTSSH

```
