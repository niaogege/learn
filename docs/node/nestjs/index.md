---
title: 全栈框架学习nestjs学习
order: 0
group:
  title: nestjs
  order: 5
  path: /node/nestjs
nav:
  order: 5
  title: 'node'
  path: /node
---

> 学习之前，先把官网代码 git clone 你会发现很多模板案例

## 核心难点

- 整个 Nestjs 项目的架构 service/controller/module 理解
- 理解依赖注入思想，尝试自定义装饰器
- DTO 和 Entity 理解
- 理解网关 gateway
- 理解 pipe/interceptor
- 理解反射器 Reflector
- 理解守卫 guard 和 使用 JWT（JSON Web Token）进行身份验证
- typeOrm 相关使用，强烈推荐去官网文档查看
- prisma 相关使用，强烈推荐去官网文档查看
- 数据库建表以及 CURD 相关操作,一对多(OneToOne)/多对多(ManyToMany)/多对一
- 学习 rxjs 相关

## 学习资料

- [Nestjs 中文官网](https://docs.nestjs.cn/)
- [typeorm](https://typeorm.bootcss.com/)
- [CRUD](https://typeorm.bootcss.com/repository-api)
- [小册子](https://juejin.cn/book/7065201654273933316/section/7065201654554951718?enter_from=course_center&utm_source=course_center)
- [NestJS 学习之优秀项目分析与最佳实践](https://juejin.cn/post/7281570246111576120?searchId=202404061303234D363E19D3DDF005014F)
- [nestjs](https://juejin.cn/post/7032079740982788132?searchId=202404061303234D363E19D3DDF005014F)
- [nestjs-guide](https://pengtikui.cn/blog/nestjs-guide)
- [nestjs](https://docs.nestjs.cn/9/firststeps)
- [五月君大佬图片压缩](https://github.com/qufei1993/compressor)
  > 发现自己有这么多的缺点和不懂的点，需要主动学习，什么时候才能想五月君大佬，写出这么优雅的代码出来?

## 优秀 Nestjs 仓库

- [typeorm 查询语句](https://github.com/typeorm/typeorm/blob/master/docs/find-options.md)
- [nestjs 官网案例](https://github.com/nestjs/nest/tree/master/sample)
- [nestjs 项目实战](https://github.com/zclzone/isme-nest-serve)
- [nestjs 值得推荐的项目列表](https://github.com/nestjs/awesome-nestjs)

## Nestjs 学习

> postMan 一定要安装起来，不然怎么测试接口

- app.controller.ts 常见功能是用来**处理 http 请求以及调用 service 层的处理方法**
- app.module.ts 根模块用于处理其他类的**引用与共享**。
- app.service.ts **封装通用的业务逻辑、与数据层的交互（例如数据库）、其他额外的一些三方请求**
- main.ts 应用程序入口文件。它使用 NestFactory 用来创建 Nest 应用实例。

- 生成一个模块 (nest g mo) 来组织代码，使其保持清晰的界限（Module）。
- 生成一个控制器 (nest g co) 来定义**CRUD 路径**（Controller）。
- 生成一个服务 (nest g s) 来**表示/隔离业务逻辑**（Service）。
- 生成一个**实体类/接口**来代表资源数据类型（Entity），typeOrm 中概念

### Nestjs 中的 DI

Nest 是建立在强大的设计模式，通常称为**依赖注入**。我们建议在官方的 [Angular](https://angular.cn/guide/dependency-injection-providers)文档中阅读有关此概念的精彩文章。

在 Nest 中，借助 TypeScript 功能，管理依赖项非常容易，因为它们仅按**类型**进行解析。在下面的示例中，Nest 将 catsService 通过创建并返回一个实例来解析 CatsService（或者，在单例的正常情况下，如果现有实例已在其他地方请求，则返回现有实例）。解析此依赖关系并将其传递给控制器的构造函数（或分配给指定的属性）：

```ts
@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}
}
```

#### Controller/Module/Provider

```js
nest g module Cat // 新建模块

nest g service Cats // 服务提供者，查询数据库相关

nest g controller Cats // 创建控制器，控制请求和响应
```

#### Nestjs 中间件

Nest 中间件实际上等价于 express 中间件。 下面是 Express 官方文档中所述的中间件功能：

中间件函数可以执行以下任务:

- 执行任何代码。
- 对请求和响应对象进行更改。
- 结束请求-响应周期。
- 调用堆栈中的下一个中间件函数。
- 如果当前的中间件函数**没有**结束请求-响应周期, 它必须调用 next() 将控制传递给下一个中间件函数。否则, 请求将被挂起。

### 网关系统

> 杂谈，不是主要内容

### 应用场景

以电商服务为例子来说，一个系统可以拆分成**用户、交易、订单、商品、活动**等多个功能模块，如果全部的功能都维护在一个项目里面，某些可以公用的模块（例如用户、权限等）就没办法共享给其他项目，项目的体积与代码复杂度也会逐步上升，导致后期维护与协同的成本会逐步增加。

最主要的问题是所有功能都放在一个系统里面开发部署，其中任意一个模块出现了问题都可能会导致整个系统雪崩。

对于一个应用的稳定性来说，如果没办法对单一的模块做**熔断、升级、回滚**等操作，线上不可控的概率极大，这也是目前主流采用**微服务架构**最大的原因之一。

但是，当一个系统的微服务模块数量非常多的情况下，也经常会出现以下问题

- 通用性的认证、鉴权、限流等功能会导致每个微服务都存在造轮子的行为；

- 业务复杂度上升之后，存在域名分配的问题，没办法对每个服务都分配一个新的域名，同时每一个新的服务上线，运维重复配置的工作量只多不少

- 太多的域名服务对客户端并不友好，特别是请求层没有做 **BFF** 的话，每一次拆分新的微服务出来都可能会引起前端的改造；

- 并非每个服务都是同一种语言或者框架所开发，前面提到的公共的插件并不能满足所有的服务，这个情况可能在 DevOps 系统中比较常见

为了解决上述的问题，网关系统随之诞生。我们可以通过网关的统一入口来**调度各个微服务功能模块**，使得每个微服务可以关注于自身的业务功能开发。

### 网关系统

网关系统根据**请求类型**可以分为：

- 静态资源网关：处理前端资源数据包括 CSR、SSR 等；
- API 网关： 随着微服务架构（MSA）的普及，通过统一的 API 网关可以**聚合所有零散的微服务资源**，保持统一的出入口，降低多项目的接入成本以及其他项目的使用成本。

从**功能属性**上可以分为：

流量网关：无关业务属性，单纯做安全（黑白名单）、分流（负载均衡）等；

业务网关：用户（认证、鉴权）、服务稳定性（降级、容灾）、业务属性灰度、代理（资源代理、缓存）、统一前置（日志、数据校验）等。

所以，市面上常见的网关系统除了提供请求聚合功能之外基本都包含所有通用功能：

认证（验证登录态，一般不做鉴权）

分流

代理（静态资源、API 等）

AB test （流量灰度，一般根据 IP 或者用户信息灰度）

缓存（成本不低，看看就行）

### Nginx

Nginx 作为专业的 WEB 代理服务器，在代理方面能够提供**负载均衡、流量切换**等功能，脚本语言也有 lua 支持。

### Gateway

业务性的 Gateway 需要做点啥：

- 统一鉴权收口，通过统一配置给接口资源添加权限；

- 支持 RPC 微服务调用，减少资源消耗；

- 系统易于监控，同时可以采集收口进来的信息。

通过两者的对比可以看出，Nginx 更关注**负载均衡以及反向代理**，对业务部分的侵入很低，而 Gateway 作为后端应用，可以携带业务属性，两者可以很好的互补。

在系统架构设计上，我们可以使用 Nginx 作为上文所说的流量网关，由 Nginx 做一层流量代理，通过负载均衡到 Gateway 做业务层的转发处理，这样可以减少我们自建网关系统的工作量。

[网关系统架构](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e15b1e4bc0b842a1affeba55594b232d~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

### 网关系统设计

网关系统架构可以分为两大模块，分别是**代理转发的基础模块**以及独立的**用户模块**。

- 网关基础服务因为流量入口已经有 Nginx 作负载均衡，我们网关的基础服务就可以专注于代理模块的开发：

专注于前后端资源分发以及不同类型的项目 API 分发；常用资源缓存模块； AB Test 模块；通用日志模块。

- 用户模块

用户登录、认证等基础功能；权限系统（基于 RBAC 包括角色、系统、资源等权限控制）。

- 物料系统

物料系统主要是针对于**静态资源**的管理，一般物料系统会跟 DevOps 体系关联比较大，毕竟物料会涉及构建部署的过程，但我们的主题并不是 DevOps，所以物料系统在小册的占比不会很高，只是作为一个辅助类型的项目为网关服务提供静态资源路由的配置、资源版本的管理等功能。
