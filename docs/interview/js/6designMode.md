---
title: 前端设计模式
order: 6
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## 观察者模式

观察者模式包含两种角色：

观察者（订阅者，我自己）被观察者（发布者，订阅号的主题，比如喜欢看的订阅号 code 秘密花园）

核心思想：订阅者只要订阅了发布者的事件，那么当发布者的状态改变时，发布者会主动去通知观察者，而无需关心订阅者得到事件后要去做什么，实际程序中可能是**执行订阅者中的回调函数**。

### 特点

- 支持简单的广播通信，当对象状态发生改变时，会自动通知已经订阅过的对象。
- 解耦, 发布者与订阅者耦合性降低，发布者只管发布一条消息出去，它不关心这条消息如何被订阅者使用，同时，订阅者只监听发布者的**事件名**，只要发布者的事件名不变，它不管发布者如何改变缺点：创建订阅者本身要**消耗一定的时间和内存**，订阅的处理函数不一定会被执行，驻留内存有性能开销，弱化了对象之间的联系，复杂的情况下可能会导致程序难以跟踪维护和理解(如果过多的使用发布订阅模式, 会增加维护的难度)

### 应用场景

- js 事件就是经典的发布-订阅模式的实现

```js
// 我们向某dom文档订阅了点击事件，当点击发生时，他会执行我们传入的callback
element.addEventListener(‘click’, callback2, false)
element.addEventListener(‘click’, callback2, false)
```

## 订阅发布

## 代理模式

## 单例模式

## 迭代模式

## 工厂模式

## 组合模式

## 装饰者模式

[如何理解装饰器的作用](https://mp.weixin.qq.com/s/FTtobh-wGylG1TQAkng8uw)

## 参考

- [了不起的 IoC 与 DI](https://mp.weixin.qq.com/s/fVwGIP3vJXqoQX9jK6NAVw)
- [黄子毅的技术博客](https://github.com/ascoders/weekly/tree/master/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F)
