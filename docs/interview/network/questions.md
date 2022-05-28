---
title: 面试中可能会遇到的问题
order: 5
group:
  order: 2
  title: 网络
  path: /interview/network
nav:
  order: 3
  title: 'interview'
  path: /interview
---

- Ddos 攻击
- SYN/TCP 泛洪攻击

典型的场景是 DDOS 攻击，也可以说是 tcp 的 SYN Flood 攻击，又叫洪水攻击；根据上面的分析，我们知道 tcp 的握手环节是比较耗时的，当 client 端发起连接请求的时候，server 端会回应，然后等待 client 的最终确认信息，默认情况下最长是等待 63s 之后才会断开，之前这段时间内属于**半连接**的状态，服务器不会丢弃掉这些连接，而是会等，试想如果有一个人突然向你的 server 瞬间之内发送了几千万个连接请求，但是对服务端的响应不做理睬，这样很容易就导致我们正常的 tcp 连接进不去，从而出现服务拒绝(deny of service)的情况，这种情况就会导致服务器对正常的客户端表现为宕机。此种攻击的成本比较低，但是防护却特别麻烦，因为你必须要保证正常的不能因为访问次数的提高而出现拒绝。

参考三元的[(建议收藏)TCP 协议灵魂之问，巩固你的网路底层基础](https://mp.weixin.qq.com/s/hy-X0sY05_UK8G_SB4jXoQ)
