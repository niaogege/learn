---
title: Cookie 的 SameSite 属性
order: 4
group:
  order: 10
  title: browser
  path: /interview/browser
nav:
  order: 3
  title: 'interview'
  path: /interview
---

- [预测最近面试会考 Cookie 的 SameSite 属性](https://juejin.cn/post/6844904095711494151)

### SameSite

#### 作用

我们先来看看这个属性的作用：

SameSite 属性可以让 Cookie 在跨站请求时不会被发送，从而可以阻止跨站请求伪造攻击（CSRF）

#### 属性值

SameSite 可以有下面三种值：

- **Strict**： 仅允许一方请求携带 Cookie，即**浏览器将只发送相同站点请求的 Cookie**，即当前网页 URL 与请求目标 URL 完全一致。
- Lax： **允许部分第三方请求携带 Cookie**
- None： **无论是否跨站都会发送 Cookie**

之前默认是 None 的，Chrome80 后默认是 Lax。

### 跨域和跨站

首先要理解的一点就是跨站和跨域是不同的。同站(same-site)/跨站(cross-site)」和第一方(first-party)/第三方(third-party)是等价的。但是与浏览器同源策略（SOP）中的「同源(same-origin)/跨域(cross-origin)」是完全不同的概念。

同源策略的同源是指两个 URL 的 **协议/主机名/端口**一致

同源策略作为浏览器的安全基石，其「同源」判断是比较严格的，相对而言，Cookie 中的「同站」判断就比较宽松：**只要两个 URL 的 eTLD+1 相同即可，不需要考虑协议和端口**。其中，eTLD 表示有效顶级域名，注册于 Mozilla 维护的公共后缀列表（Public Suffix List）中，例如，.com、.co.uk、.github.io 等。eTLD+1 则表示，**有效顶级域名+二级域名**，例如 taobao.com 等

举几个例子，www.taobao.com 和 www.baidu.com 是跨站，www.a.taobao.com 和 www.b.taobao.com 是同站，a.github.io 和 b.github.io 是跨站(注意是跨站)
