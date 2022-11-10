---
title: 控制器controller
order: 11
group:
  title: nestjs
  order: 5
  path: /node/nestjs
nav:
  order: 5
  title: 'node'
  path: /node
---

模块是具有 **@Module**() 装饰器的类。 @Module() 装饰器提供了元数据，Nest 用它来**组织应用程序结构**

### Module

```ts
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
class AppModule {}
// @Module源码
const validate_module_keys_util_1 = require('../../utils/validate-module-keys.util');
function Module(metadata) {
  const propsKeys = Object.keys(metadata);
  (0, validate_module_keys_util_1.validateModuleKeys)(propsKeys);
  return (target) => {
    for (const property in metadata) {
      if (metadata.hasOwnProperty(property)) {
        Reflect.defineMetadata(property, metadata[property], target);
      }
    }
  };
}
exports.Module = Module;
```

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

### Controller 中的@Get 请求

```ts
@Get()
  getHello(): string {
    return this.appService.getHello();
  }
```
