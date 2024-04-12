---
title: 以账单项目上手Nestjs全家桶
order: 6
group:
  title: nestjs
  order: 5
  path: /node/nestjs
nav:
  order: 5
  title: 'node'
  path: /node
---

- [NestJS 简单入门（三）用户登录与 JWT](https://juejin.cn/post/7257518510531330106)
- [Nest.js 实战系列二-手把手带你-实现注册、扫码登录、jwt 认证等](https://juejin.cn/post/7044708915438682148?searchId=20240407102607D2C754E842DCD37A5184#heading-4)

### Entity

```js
import { User } from '../user/user.entities';
import {
  Column,
  Entity,
} from 'typeorm';

@Entity({
  name: 'bill-test', // 表名
  comment: 'bill for test', // 表的注解
})
```

### DTO

### 数据库表中的 OneToMany/ManyToOne 关系这么绑定

> [官网案例](https://github.com/typeorm/typeorm/blob/master/docs/many-to-one-one-to-many-relations.md)
