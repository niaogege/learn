---
title: CI/CD
order: 10
group:
  title: CICD
  order: 2
  path: /server/ci
nav:
  order: 6
  title: 'server'
  path: /server
---

## 学习目标

- 了解 CI/CD 基本概念
- 基于 githubAction 实现前端项目的自动化测试/发布和部署(已完成)
- 基于 githubAction 实现 Nodejs 项目的自动化测试/发布和部署(已完成)
- 基于 githubAction 实现 npm 包自动发布(未完成)
- 发布一个基本的 actions 插件(未完成)
- 搭建基本的 jenkins 环境，(已完成)
- 基于 jenkins 环境，实现前端项目的自动化测试/发布和部署
- 基于 jenkins 环境，实现 Nodejs 项目的自动化测试/发布和部署

> [阮一峰巨佬 太厉害了](ruanyifeng.com)

目标： 合格的 full-stack 搬砖**工程师**

## CI/CD

- [持续集成是什么？](https://www.ruanyifeng.com/blog/2015/09/continuous-integration.html?fileGuid=1PWJAvQBtLA5IGh3)
- [Github Actions 实现 Node.js 项目的 CICD 环境搭建 ](https://developer.aliyun.com/article/992857)

- [使用 Github Actions 实现前端应用部署及 npm 包发布自动化](https://lexmin0412.github.io/blog/%E5%89%8D%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%8C%96/%E4%BD%BF%E7%94%A8Github%20Actions%E8%87%AA%E5%8A%A8%E5%8C%96%E6%9E%84%E5%BB%BA%E9%A1%B9%E7%9B%AE.html)

- [手把手教你用 Github Actions 部署前端项目](https://cloud.tencent.com/developer/article/1816853)

### Github Action

[GitHub Actions 入门教程](http://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html?fileGuid=1PWJAvQBtLA5IGh3)

### actions 插件

常用的几个推荐

- 检出代码的 actions/checkout@v1

- 安装 nodejs 环境的 actions/setup-node@v1

- 传输文件到私服的 peaceiris/actions-gh-pages@v3 [sh-scp-ssh-pipelines](https://github.com/cross-the-world/ssh-scp-ssh-pipelines/blob/master/app.py)

这个竟然是用 py 写的

- 创建 Github Pages 站点 peaceiris/actions-gh-pages@v3

#### 创建 github Pages 站点

这里使用 Actions 市场中的 [GitHub Pages v3](https://github.com/marketplace/actions/github-pages-v3?fileGuid=1PWJAvQBtLA5IGh3) 插件

```yml
name: github pages
 on:
   push:
     branches:
       - master # default branch
 jobs:
   deploy:
     runs-on: ubuntu-18.04
     steps:
       - uses: actions/checkout@v2
       - run: npm install
       - run: npm run docs:build
       - name: Deploy
         uses: peaceiris/actions-gh-pages@v3
         with:
           github_token: ${{ secrets.GITHUB_TOKEN }}
           publish_dir: ./docs-dist
```

## jenkins 环境搭建
