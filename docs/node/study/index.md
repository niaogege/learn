---
title: nodejs study
order: 0
group:
  title: node
  order: 0
nav:
  order: 5
  title: 'node'
  path: /node
---

nodejs 学习模块，主要是一些笔记汇总，学习网站来源于[跟五月君学习 nodejs](https://www.nodejs.red/#/nodejs/base/what-is-nodejs)

## node 自身架构

[node 架构](https://www.nodejs.red/nodejs/base/img/nodejs_architecture.png)

以上展示了 Node.js 的构成，下面做下简单说明：

- Node Standard Library：Node.js 标准库，对外提供的 JavaScript 接口，例如模块 http、buffer、fs、stream 等

- Node bindings：这里就是 JavaScript 与 C++ 连接的桥梁，对下层模块进行封装，向上层提供基础的 API 接口。

- V8：Google 开源的高性能 JavaScript 引擎，使用 C++ 开发，并且应用于谷歌浏览器。如果您感兴趣想学习更多的 V8 引擎知识，请访问 What is V8?

- Libuv：是一个跨平台的支持事件驱动的 I/O 库。它是使用 C 和 C++ 语言为 Node.js 所开发的，同时也是 I/O 操作的核心部分，例如读取文件和 OS 交互。来自一份 Libuv 的中文教程

- C-ares：C-ares 是一个异步 DNS 解析库

- Low-Level Components：提供了 http 解析、OpenSSL、数据压缩（zlib）等功能。

## node 给 js 带来了什么

- 浏览器通过**事件驱动**来服务界面上的交互
- Node 通过**事件驱动**来服务 I/O

在 Node 中，JavaScript 还被赋予了新的能力：

- 随心所欲地访问本地文件
- 搭建 **WebSocket 服务端**
- 连接**数据库**，进行业务研发
- 像 Web Worker 一样玩转**多进程**

> Node 不处理 UI，但用与浏览器相同的机制和原理运行，打破了 JavaScript 只能在浏览器中运行的局面。前后端编程环境统一，可以大大降低前后端转换所需要的上下文代价。

## Node 特点

### 异步 I/O(非阻塞 I/O)

Node.js 避免了由于需要等待输入或者输出（数据库、文件系统、Web 服务器...）响应而造成的 CPU 时间损失，这得益于 **Libuv** 强大的异步 I/O。

### 事件与回调函数

#### 事件

随着 Web2.0 的到来，JavaScript 在前端担任了更多的职责，时间也得到了广泛的应用。将前端浏览器中广泛应用且成熟的事件与回到函数引入后端，配合异步 I / O ，可以很好地将事件发生的时间点暴露给业务逻辑

- 浏览器例子

```js
request({
  url: 'xx',
  method: 'GET',
  success(data) {
    console.log(data);
    // 处理成功之后的逻辑
  },
});
```

发出请求后，只需关心请求成功时执行相应的业务逻辑即可

- 服务端例子

```js
var http = require('http');
var querystring = require('querystring');
// 侦听服务器的request事件
const app = http.createServer(function (req, res) {
  var postData = '';
  req.setEncoding('utf8');
  // 侦听请求的data事件
  req.on('data', function (trunk) {
    postData += trunk;
  });

  // 侦听请求的end事件
  req.on('end', function () {
    res.end(postData);
  });
});
app.listen(8080);

console.log('服务器启动完成');
```

事件的编程方式具有轻量级、松耦合、只关注事务点等优势，但是在多个异步任务的场景下，事件与事件之间各自独立，如何协作是一个问题，后续也出现了一系列异步编程解决方案:

- 事件发布/订阅模式
- Promise、async / await

#### 回调函数

Node 除了异步和事件外，回调函数也是一大特色纵观下来，回调函数也是最好的**接收异步调用返回数据**的方式

### 单线程

Node 保持了 JavaScript 在浏览器中单线程的特点 JavaScript 与其他线程是无法共享任何状态的，最大的好处是不用像多线程编程那样处处在意状态的同步问题，这里没有死锁的存在，也没有线程上下文交换所带来的性能上的开销

- 单线程的缺点

  1)无法利用多核 CPU

  2)错误会引起整个应用退出，健壮性较差

  3)大量计算占用 CP, 导致无法继续调用异步 I / O 后续也推出了**child_process 和 cluster**模块较好地缓解了以上缺点

## Nodejs 适用场景

### I/O 密集型场景

### RESTFul API

通常我们可以使用 Node.js 来做为中间层，负责组装数据提供 API 接口给到前端调用，这些数据源可能来自第三方接口或者数据库，例如，以前可能我们通过后端 Java、PHP 等其它语言来做，现在我们前端工程师通过 Node.js 即可完成，后端则可以更专注于业务开发。

### RPC 服务

RPC（remote procedure call，远程过程调用），指通过网络从远程计算机上请求服务。是常见的计算机通信方式之一。

RPC 可以理解为一种设计模型，通常包含 传输协议 和 序列化协议 。传输协议通常使用 TCP 传输二进制数据，因为相比 HTTP 和 JSON ，传输效率更高，性能更好。现在出名的 RPC 服务例如，Google 的 _gRPC_、阿里的 _Dubble_。

#### 创建 RPC 的过程

客户端创建过程

- client 创建 socket
- connect 建立链接
- on 监听数据
- write 发送数据

```js
const net = require('net');
const { port, lessonids } = require('./const');
// 创建 socket
const socket = new net.Socket({});
// 连接服务
socket.connect({
  host: '127.0.0.1',
  port: port,
});
fetchData();
// 监听服务端返回数据
socket.on('data', (buffer) => {
  // 半双工通信：接收数据后再次请求
  fetchData();
});

// 序列化方法
function encode(index) {
  let buffer = Buffer.alloc(4);
  buffer.writeInt32BE(lessonids[index]);
  return buffer;
}

// 向服务器传送数据
function fetchData() {
  const index = Math.floor(Math.random() * lessonids.length);
  socket.write(encode(index));
}
```

服务端创建过程

- server 创建 server
- 绑定端口 listen
- on 监听数据
- write 发送数据

```js
const net = require('net');
const { port, lessons } = require('./const');

// 创建 tcp 服务
const server = net.createServer((socket) => {
  // 监听客户端请求
  socket.on('data', (buffer) => {
    const id = buffer.readInt32BE();
    // 向客户端返回数据
    setTimeout(() => {
      socket.write(Buffer.from(lessons[id]));
    }, 1000);
  });
});

// 监听端口，启动服务
server.listen(port);
```

### BFF(backend for frontend)

Backend For Frontend，简称 BFF，**服务于前端的后端**，并非是一种新技术只是一种逻辑上的分层，在这一层我们可以做一些资源的整合，例如：原先前端需要从三个不同的地方来获取资源，那么，有了这一层之后，我们是不是可以做个聚合，统一处理之后返回给前端，同时也不受制于后端系统的变迁，导致也要去更改

### 基础工具

前端领域中的编译器、构建工具、搭建脚手架等。比较出名的例如 Webpack、cli 都是很成功的。

### 参考资料

- [nodejs 学习笔记](https://github.com/chyingp/nodejs-learning-guide)
- [谈谈 node 架构中的线程进程的应用场景、事件循环及任务队列](https://mp.weixin.qq.com/s/huyn95OyOz45J93B3WGXdA)
