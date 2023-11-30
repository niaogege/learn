---
title: Cookie相关
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

## cookie 如何设置只在 https 携带

> 如果带上 Secure，说明只能通过 HTTPS 传输 cookie。

答案：设置 cookie 的 **secure** 属性。

secure 选项用来设置 cookie 只在确保安全的请求中才会发送。当请求是 HTTPS 或者其他安全协议时，包含 secure 选项的 cookie 才能被发送至服务器。

默认情况下，cookie 不会带 secure 选项(即为空)。所以默认情况下，不管是 HTTPS 协议还是 HTTP 协议的请求，cookie 都会被发送至服务端。

但要注意一点，secure 选项只是限定了在安全情况下才可以传输给服务端，但并不代表你不能看到这个 cookie

## cookie 和 session 区别

- Session 是在服务端保存的一个数据结构，用来跟踪用户的状态，这个数据可以保存在集群、数据库、文件中；
- Cookie 是客户端保存用户信息的一种机制，用来记录用户的一些信息，也是实现 Session 的一种方式。
- 思考一下服务端如何识别特定的客户？实际上大多数的应用都是用 Cookie 来实现 Session 跟踪的，第一次创建 Session 的时候，服务端会在 HTTP 协议中告诉客户端，需要在 Cookie 里面记录一个 Session ID，以后每次请求把这个会话 ID 发送到服务器，我就知道你是谁了。

## cookie 缺陷

- 容量缺陷。Cookie 的体积上限只有 4KB，只能用来存储少量的信息。
- 性能缺陷。Cookie 紧跟域名，不管域名下面的某一个地址需不需要这个 Cookie ，请求都会携带上完整的 Cookie，这样随着请求数的增多，其实会造成巨大的性能浪费的，因为请求携带了很多不必要的内容。但可以通过**Domain 和 Path**指定作用域来解决。
- 安全缺陷。由于 Cookie 以纯文本的形式在浏览器和服务器中传递，很容易被非法用户截获，然后进行一系列的篡改，在 Cookie 的有效期内重新发送给服务器，这是相当危险的。另外，在**HttpOnly 为 false** 的情况下，Cookie 信息能直接通过 JS 脚本来读取。

## cookie 中的 SameSite 属性

如果带上 Secure，说明只能通过 HTTPS 传输 cookie。

如果 cookie 字段带上 HttpOnly，那么说明只能通过 HTTP 协议传输，不能通过 JS 访问，这也是预防 XSS 攻击的重要手段。

相应的，对于 CSRF 攻击的预防，也有 SameSite 属性。

SameSite 可以设置为三个值，Strict、Lax 和 None。

在 Strict 模式下，浏览器完全禁止第三方请求携带 Cookie。比如请求 sanyuan.com 网站只能在 sanyuan.com 域名当中请求才能携带 Cookie，在其他网站请求都不能。在 Lax 模式，就宽松一点了，但是只能在 get 方法提交表单况或者 a 标签发送 get 请求的情况下可以携带 Cookie，其他情况均不能。在 None 模式下，也就是默认模式，请求会自动携带上 Cookie。
