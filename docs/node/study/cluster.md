---
title: nodejs cluster
order: 1
group:
  title: node
  order: 2
nav:
  order: 5
  title: 'node'
  path: /node
---

问题来源：

- Pm2 中的 cluster 模式和 fork 模式区别
- child_process 模块提供的 4 种新建子进程 API: spawn、execFile、exec 和 fork
- Nodejs 的 Cluster 模块采用了哪种集群模式？
- 多个进程为什么可以监听同一个端口？
- 多个进程之间如何通信？
- 如何对多个 Worker 进行请求分发？（负载均衡策略）

### Pm2 中的 cluster 模式和 fork 模式区别

fork 模式，**单实例多进程**，常用于多语言混编，比如 php、python 等，不支持端口复用，需要自己做应用的端口分配和负载均衡的子进程业务代码。缺点就是单服务器实例容易由于异常会导致服务器实例崩溃。

cluster 模式，**多实例多进程**，但是只支持 node，端口可以复用，不需要额外的端口配置，0 代码实现负载均衡。优点就是由于多实例机制，可以保证服务器的容错性，就算出现异常也不会使多个服务器实例同时崩溃。

### 参考

- [Nodejs 进阶：解答 Cluster 模块的几个疑问](https://juejin.cn/post/6844904087771693070)
