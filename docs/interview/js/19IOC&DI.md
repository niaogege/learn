---
title: 前端设计模式IOC/DI
order: 19
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

感谢阿宝哥提供的技术文章[了不起的 IOC/DI](https://mp.weixin.qq.com/s?__biz=MzI2MjcxNTQ0Nw==&mid=2247485950&idx=1&sn=9bfed7fee2f2a02b5e9994480a66e1e9&scene=21#wechat_redirect)

> 很早的时候就接触这玩意，可惜不知道代表什么意思

- 概念
- 控制反转：什么反转，什么控制，谁是控制者
- 依赖注入： 怎么注入
- 依赖注入解决的问题是什么
- 了解如何使用 TypeScript 实现一个 IoC 容器，并了解 装饰器、反射 的相关知识。

## 面向对象编程中的控制反转 IoC 和依赖注入 DI

控制反转 **Inversion of Control**

依赖注入 **Dependent Inject**

依赖注入是控制反转的实现方式

### 背景

造车只考虑三个部分：发动机、底盘和车身

```ts
export default class Body {} //  车身

export default class Chassis {} // 底座

export default class Engine {
  start() {
    console.log('引擎发动');
  }
} // 发动机

// 定义汽车

import Engine from './engine';
import Chassis from './chassis';
import Body from './body';

export default class Car {
  engine: Engine;
  chassis: Chassis;
  body: Body;

  constructor() {
    this.engine = new Engine();
    this.body = new Body();
    this.chassis = new Chassis();
  }

  run() {
    this.engine.start();
  }
}
```

一切已准备就绪，我们马上来造一辆车：

```ts
const car = new Car();
car.run();
```

现在虽然车已经可以启动了，但却存在以下问题：

问题一：在造车的时候，你不能选择配置。比如你想**更换汽车引擎**的话，按照目前的方案，是实现不了的。

问题二：在汽车类内部，你需要在构造函数中手动去创建汽车的**各个部件**。

为了解决第一个问题，提供更灵活的方案，我们可以重构一下已定义的汽车类，具体如下：

```ts
export default class Car {
  engine: Engine;
  chassis: Chassis;
  body: Body;
  constructor(engine, body, chassis) {
    this.engine = engine;
    this.body = body;
    this.chassis = chassis;
  }
  run() {
    this.engine.start();
  }
}
```

使用的时候

```js
import Engine from './engine';
import Chassis from './chassis';
import Body from './body';
var car = new Car(new Engine(), new Body(), new Chassis());
car.run();
```

此时我们已经解决了上面提到的第一个问题，要解决第二个问题我们要来了解一下 IoC（控制反转）的概念。

### IOC

IoC（Inversion of Control），即 “控制反转”。在开发中， IoC 意味着你设计好的对象交给**容器**控制，而不是使用传统的方式，在对象内部直接控制。

如何理解好 IoC 呢？理解好 IoC 的关键是要明确 “谁控制谁，控制什么，为何是反转，哪些方面反转了”，我们来深入分析一下。

- 谁控制谁，控制什么：在传统的程序设计中，我们直接在对象内部通过 **new** 的方式创建对象，是**程序主动创建依赖对象**；而 IoC 是有专门一个容器来创建这些对象，即由 IoC 容器控制对象的创建；

  > 谁控制谁？当然是 IoC 容器控制了对象；控制什么？主要是控制外部资源（依赖对象）获取。

- 为何是反转了，哪些方面反转了：有反转就有正转，传统应用程序是由我们自己在程序中主动控制去获取依赖对象，也就是正转；而反转则是由容器来帮忙创建及注入依赖对象；
  > 为何是反转？因为由容器帮我们查找及注入依赖对象，对象只是被动的接受依赖对象，所以是反转了；哪些方面反转了？依赖对象的获取被反转了。

### IOC 能带来什么

IoC 不是一种技术，只是一种思想，是面向对象编程中的一种设计原则，可以用来减低计算机代码之间的耦合度。

传统应用程序都是由我们在类内部主动创建依赖对象，从而导致类与类之间高耦合，难于测试；有了 IoC 容器后，把创建和查找依赖对象的控制权交给了容器，**由容器注入组合对象，所以对象之间是松散耦合**。 这样也便于测试，利于功能复用，更重要的是使得程序的整个体系结构变得非常灵活。

其实 IoC 对编程带来的最大改变不是从代码上，而是思想上，发生了 “主从换位” 的变化。应用程序本来是老大，要获取什么资源都是主动出击，但在 IoC 思想中，应用程序就变成被动了，**被动的**等待 IoC 容器来创建并注入它所需的资源了。

### IoC 与 DI 之间的关系

对于控制反转来说，其中最常见的方式叫做 **依赖注入**，简称为 DI（Dependency Injection）。

组件之间的依赖关系**由容器在运行期**决定，形象的说，即由容器动态的将某个依赖关系注入到组件之中。依赖注入的目的并非为软件系统带来更多功能，而是为了提升组件重用的频率，并为系统搭建一个灵活、可扩展的平台。

理解 DI 的关键是 "**谁依赖了谁，为什么需要依赖，谁注入了谁，注入了什么**"

- 谁依赖了谁：当然是应用程序依赖 IoC 容器
- 为什么需要依赖：应用程序需要 IoC 容器来提供对象需要的外部资源（包括对象、资源、常量数据）
- 谁注入谁：很明显是 IoC 容器注入应用程序依赖的对象；
- 注入了什么：注入某个对象所需的外部资源（包括对象、资源、常量数据）

相对 IoC 而言，“依赖注入” 明确描述了被**注入对象依赖 IoC 容器配置依赖对象**

控制反转（Inversion of Control）是说**创建对象的控制权**发生转移，以前创建对象的主动权和创建时机由应用程序把控，而现在这种权利转交给 IoC (Inversion of Control)容器，它就是一个专门用来创建对象的工厂，你需要什么对象，它就给你什么对象

有了 IoC 容器，依赖关系就改变了，原先的依赖关系就没了，它们都依赖 **IoC** 容器了，通过 IoC 容器来建立它们之间的关系。

## 参考

- [Decorator（装饰器模式）](https://github.com/ascoders/weekly/blob/master/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/175.%E7%B2%BE%E8%AF%BB%E3%80%8A%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%20-%20Decorator%20%E8%A3%85%E9%A5%B0%E5%99%A8%E6%A8%A1%E5%BC%8F%E3%80%8B.md)
