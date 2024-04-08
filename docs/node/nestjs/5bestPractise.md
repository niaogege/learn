---
title: 探讨最佳实践
order: 5
group:
  title: nestjs
  order: 5
  path: /node/nestjs
nav:
  order: 5
  title: 'node'
  path: /node
---

[NestJS 小技巧 24-每个 Nest.js 开发人员都应该知道的 10 件事](https://juejin.cn/post/7264532077575716879?searchId=20240407102607D2C754E842DCD37A5184)

### 用到的内置模块

- @nestjs/jwt：提供了 JWT（JSON Web Tokens）的支持，用于在 NestJS 应用中实现身份验证和授权
- @nestjs/config 用于管理 NestJS 应用的配置信息。它支持环境变量、类型转换等
- @nestjs/common 通用模块，提供了一系列常用的装饰器、助手函数和其他工具。如 Injectable, Module, BadRequestException, Body, Controller, Get, Param, Post, Query 等
- @nestjs/typeorm

### 第三方库

- class-validator 基于装饰器的属性验证库，用于在 TypeScript 和 JavaScript 类中进行数据验证。内部使用 validator.js 进行验证
- class-transformer 用于对象与类实例之间的转换，通常与 class-validator 配合使用。
- rxjs 用于使用可观察对象进行响应式编程的库。
- bcryptjs 加解密文本

## 使用 DTO

DTO(data transfer Object): 数据传输对象,Dto 和接口有些类似，但是它的主要目的是为了转换和验证数据。他们基本上在路由控制中被使用。您可以他们简化您的 API 内容（body）和请求验证逻辑。例如，AuthDto 自动的整合用户的 email 和 password 进一个 dto 对象进行强制验证。

```ts
import { IsEmail, IsString } from 'class-validator';
```
