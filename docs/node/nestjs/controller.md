---
title: 控制器controller
order: 1
group:
  title: nestjs
  order: 5
  path: /node/nestjs
nav:
  order: 5
  title: 'node'
  path: /node
---

控制器负责**处理传入的请求**和向客户端**`返回响应`**。

> 完了，对 controller/module/provide/inject 概念不了解

参考文档[中文版 Nestjs](https://docs.nestjs.cn/9/controllers)

### Controller

```ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller({
  path: '/cpp',
  host: '127.0.0.1',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

// @Controller
export declare function Controller(options: ControllerOptions): ClassDecorator;
export interface ControllerOptions extends ScopeOptions, VersionOptions {
  path?: string | string[];
  host?: string | RegExp | Array<string | RegExp>;
}
export interface ScopeOptions {
  scope?: Scope;
  durable?: boolean;
}
export declare enum Scope {
  DEFAULT = 0,
  TRANSIENT = 1,
  REQUEST = 2,
}
export interface VersionOptions {
  version?: string;
}
// source
const constants_1 = require('../../constants');
const shared_utils_1 = require('../../utils/shared.utils');
function Controller(prefixOrOptions) {
  const defaultPath = '/';
  const [path, host, scopeOptions, versionOptions] = (0, shared_utils_1.isUndefined)(
    prefixOrOptions,
  )
    ? [defaultPath, undefined, undefined, undefined]
    : (0, shared_utils_1.isString)(prefixOrOptions) || Array.isArray(prefixOrOptions)
    ? [prefixOrOptions, undefined, undefined, undefined]
    : [
        prefixOrOptions.path || defaultPath,
        prefixOrOptions.host,
        { scope: prefixOrOptions.scope, durable: prefixOrOptions.durable },
        Array.isArray(prefixOrOptions.version)
          ? Array.from(new Set(prefixOrOptions.version))
          : prefixOrOptions.version,
      ];
  return (target) => {
    Reflect.defineMetadata(constants_1.CONTROLLER_WATERMARK, true, target);
    Reflect.defineMetadata(constants_1.PATH_METADATA, path, target);
    Reflect.defineMetadata(constants_1.HOST_METADATA, host, target);
    Reflect.defineMetadata(constants_1.SCOPE_OPTIONS_METADATA, scopeOptions, target);
    Reflect.defineMetadata(constants_1.VERSION_METADATA, versionOptions, target);
  };
}
```
