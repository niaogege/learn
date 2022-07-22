---
title: 工具相关
order: 0
group:
  title: 工具
  order: 6
  path: /node/tool
nav:
  order: 1
  title: 'node'
  path: /node
---

## 1.[node 端 debugger 调试技巧](./tool/debugger.md)

## 2.[npm/yarn/pnpm](./tool/yarn%E5%92%8Cnpm.md)

## 3.[monoRepo](./tool/monorepo%E5%AE%9E%E6%88%98.md)

yarn 有一个**workspaces**可以支持 monorepo，使用这个功能需要在 package.json 里面配置 workspaces

```js
"workspaces": {
    "packages": [
      "packages/*"
    ]
  }
```

## 参考

- [现代 Monorepo 工程技术选型，聊聊我的思考](https://mp.weixin.qq.com/s/99nozy-vtFMGcBTxYvumWA)
