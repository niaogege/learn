---
title: handwritingTsMiddle.md
order: 11
group:
  order: 0
  title: TS
  path: /interview/ts
nav:
  order: 3
  title: 'interview'
  path: /interview
---

中等难度的类型体操

```ts
type R1 = GetChars<'abc', never>; // 'a' | 'b' | 'c'
type GetChars<T extends string, R> = T extends `${infer F}${infer L}` ? GetChars<L, F | R> : R;
```

## 参考文档

- [接近天花板的 TS 类型体操，看懂你就能玩转 TS 了](https://mp.weixin.qq.com/s/CweuipYoHwOL2tpQpKlYLg)
