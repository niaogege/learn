---
title: 总览
order: 0
group:
  order: 2
  title: 网络
  path: /interview/network
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## 工程师中的基本功

- [http1.x/http2.x/](./network/http.md)
- [http3.0](./network/http3.md)
- [https](./https.md)
- udp/tcp
- 强缓存/协商缓存
- 代理缓存
- DDOS

## 基础的面试题

- http1.0/http1.1/http2.0 之间的区别
- 如何理解 http2.0 中的多路复用
- http3.0 基于 UDO 协议，如何保证传输可靠性?
- 说说 https 的握手过程
- https 是如何保证安全的，又是如何保证不被中间人攻击的
- 说说你对三次握手和四次挥手的理解
- TCP 和 UDP 区别
- 说说 TCP/IP 协议的了解
- 说下 websocket 原理
- websocket 和 http 区别
- 跨域的时候如何处理 cookie,如何设置 cookie 保证只在 https 时携带
- POST 请求中的 content-type 有哪几种
- cache-control 常见有哪些配置
- 如何理解 HTTP 代理
- DNS 劫持

## 如何理解 HTTP 代理

我们知道在 HTTP 是基于**请求-响应**模型的协议，一般由客户端发请求，服务器来进行响应。

当然，也有特殊情况，就是代理服务器的情况。引入代理之后，作为代理的服务器相当于一个中间人的角色，对于客户端而言，表现为服务器进行响应；而对于源服务器，表现为客户端发起请求，具有双重身份那代理服务器到底是用来做什么的呢？

功能

- 负载均衡。客户端的请求只会先到达代理服务器，后面到底有多少源服务器，IP 都是多少，客户端是不知道的。因此，这个代理服务器可以拿到这个请求之后，可以通过特定的算法分发给不同的源服务器，让各台源服务器的负载尽量平均。当然，这样的算法有很多，包括随机算法、轮询、一致性 hash、LRU``(最近最少使用)等等
- 保障安全。利用心跳机制监控后台的服务器，一旦发现故障机就将其踢出集群。并且对于上下行的数据进行过滤，对非法 IP 限流，这些都是代理服务器的工作。
- 缓存代理。将内容缓存到代理服务器，使得客户端可以直接从代理服务器获得而不用到源服务器那里。

相关头部字段：via/X-Forwarded-For/X-Real-IP

## DNS 劫持

在正常环境下，用户的每一个上网请求会通过 DNS 解析指向到与之相匹配的 IP 地址，从而完成一次上网行为。DNS 作为应用层协议，主要是为其他应用层协议工作的，包括不限于 HTTP、SMTP、FTP，用于将用户提供的主机名解析为 IP 地址

常见 DNS 劫持手段又有哪些？

- 利用 DNS 服务器进行 DDoS 攻击

## 杂谈

- protocol-relative URL，暂且可译做**协议相对** URL，即 '//baidu.com'根据当前的 url 访问看是 https or http
