---
title: 提供者Providers
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

### Injectable

```js
import { Injectable } from '@nestjs/common';

@Injectable({
  scope: 1,
  durable: true,
})
export class AppService {
  getHello(): string {
    return 'Hello World! CPP';
  }
}

// interface
export declare function Injectable(options?: InjectableOptions): ClassDecorator;
export declare function mixin<T>(mixinClass: Type<T>): Type<T>;
export declare type InjectableOptions = ScopeOptions;
// source
function Injectable(options) {
  return (target) => {
    Reflect.defineMetadata(constants_1.INJECTABLE_WATERMARK, true, target);
    Reflect.defineMetadata(constants_1.SCOPE_OPTIONS_METADATA, options, target);
  };
}
exports.Injectable = Injectable;
function mixin(mixinClass) {
  Object.defineProperty(mixinClass, 'name', {
    value: (0, uuid_1.v4)(),
  });
  Injectable()(mixinClass);
  return mixinClass;
}
exports.mixin = mixin;
```
