---
title: 模块@Module
order: 4
group:
  title: nestjs
  order: 5
  path: /node/nestjs
nav:
  order: 5
  title: 'node'
  path: /node
---

- 如何使用共享模块
- 如何导出模块
- 全局模块如何定义和使用 Global

模块是具有 **@Module**() 装饰器的类。 @Module() 装饰器提供了元数据，Nest 用它来**组织应用程序结构**

**@module()** 装饰器接受一个描述模块属性的对象：

- providers 由 Nest 注入器实例化的提供者，并且可以至少在整个模块中共享
- controllers 必须创建的一组控制器
- imports 导入模块的列表，这些模块导出了此模块中所需提供者
- exports 由本模块提供并应在其他模块中可用的提供者的子集。

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
