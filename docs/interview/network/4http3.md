---
title: HTTP3.0
order: 4
group:
  order: 2
  title: 网络
  path: /interview/network
nav:
  order: 3
  title: 'interview'
  path: /interview
---

重复，循环，重复

## RTT 往返时间

如何定义建立连接时间？这里引入一个概念：RTT（Round-Trip Time），往返时间，表示从发送端发送数据开始，到发送端收到来自接收端的确认（接收端收到数据后便立即发送确认，不包含数据传输时间）总共经历的时间，即通信一来一回的时间

## Http2

2015 年，HTTP/2 发布。HTTP/2 是现行 HTTP 协议（HTTP/1.x）的替代，但它不是重写，HTTP 方法/状态码/语义都与 HTTP/1.x 一样。HTTP/2 基于 SPDY，专注于性能，最大的一个目标是在用户和网站间**只用一个连接（connection）**。从目前的情况来看，国内外一些排名靠前的站点基本都实现了 HTTP/2 的部署，使用 HTTP/2 能带来 20%~60%的效率提升。

### Http/2 的缺点

主要是底层支撑的 TCP 协议造成的。HTTP/2 的缺点主要有以下几点：

- TCP 以及 TCP+TLS 建立连接的延时在传输数据之前，我们需要花掉 3 ～ 4 个 RTT

- TCP 的队头阻塞并没有彻底解决上文我们提到在 HTTP/2 中，多个请求是跑在一个 TCP 管道中的。但当出现了丢包时，HTTP/2 的表现反倒不如 HTTP/1 了。因为 TCP 为了保证可靠传输，有个特别的“丢包重传”机制，丢失的包必须要等待重新传输确认，HTTP/2 出现丢包时，整个 TCP 都要开始等待重传，那么就会阻塞该 TCP 连接中的所有请求（如下图）。而对于 HTTP/1.1 来说，可以开启多个 TCP 连接，出现这种情况反到只会影响其中一个连接，剩余的 TCP 连接还可以正常传输数据。 ![TCP的队头阻塞并没有彻底解决](https://s2.loli.net/2022/04/30/KRndli9OLp72WEH.jpg)

## Http3.0

Google 在推 SPDY 的时候就已经意识到了这些问题，于是就另起炉灶搞了一个基于 UDP 协议的“QUIC”协议，让 HTTP 跑在 QUIC 上而不是 TCP 上。而这个“HTTP over QUIC”就是 HTTP 协议的下一个大版本，HTTP/3。它在 HTTP/2 的基础上又实现了质的飞跃，真正“完美”地解决了“队头阻塞”问题。

- **实现了类似 TCP 的流量控制、传输可靠性的功能**。虽然 UDP 不提供可靠性的传输，但 QUIC 在 UDP 的基础之上增加了一层来保证数据可靠性传输。它提供了数据包重传、拥塞控制以及其他一些 TCP 中存在的特性。

- **实现了快速握手功能**, 0/1RTT 由于 QUIC 是基于 UDP 的，所以 QUIC 可以实现使用 0-RTT 或者 1-RTT 来建立连接，这意味着 QUIC 可以用最快的速度来发送和接收数据，这样可以大大提升首次打开页面的速度。0RTT 建连可以说是 QUIC 相比 HTTP2 最大的性能优势。

- **集成了 TLS 加密功能**。目前 QUIC 使用的是 TLS1.3，相较于早期版本 TLS1.3 有更多的优点，其中最重要的一点是减少了握手所花费的 RTT 个数。

- **多路复用**，彻底解决 TCP 中队头阻塞的问题和 TCP 不同，QUIC 实现了在**同一物理连接上可以有多个独立的逻辑数据流**（如下图）。实现了数据流的单独传输，就解决了 TCP 中队头阻塞的问题。

![http3.jpg](https://s2.loli.net/2022/04/30/w6N1BrVSMLR8nof.jpg)

## 参考

- [解读 HTTP/2 与 HTTP/3 的新特性](https://mp.weixin.qq.com/s/Zt8ljlUa2uZ_Wvez8H4rOQ)
- [说一下 HTTP/3 新特性，为什么选择使用 UDP 协议？](https://mp.weixin.qq.com/s/WbNwnlW0C9SAYbn4Yedqnw)
