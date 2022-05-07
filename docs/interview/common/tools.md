---
title: 工具函数
group:
  order: 2
  title: 通用业务
  path: /interview/common
nav:
  order: 3
  title: 'interview'
  path: /interview
---

工具函数介绍

### 工具函数

- debounce
- throttle
- loadResource(动态加载 js/css 文件)
- observe (使用 IntersectionObserver 监视 dom 元素在文档视口的可见性)
- unobserve (取消 observe 监控)
- 埋点函数
- 16 进制和 rgb 颜色互转

### 常量

- isBrowser (是否是浏览器)
- isMobile (是否是移动端)
- isWeixin

## 16 进制和 rgb 颜色互转

### rgb 转 16 进制

```js
// rgb(255,255, 255) => #ffffff
function rgbToHex(rgb) {
  const [a, r, g, b] = rgb.split(/[^\d]+/);
  const toHex = (num) => {
    const hex = (+num).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
var tt = rgbToHex('rgb(255, 255, 255)');
console.log(tt);
```

### 16 进制转 rgb

```js
// #ffffff => rgb(255, 255, 255)
function hexToRgb(str) {
  const rgb = str.replace('#', '0x');
  const r = rgb >> 16;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  return `rgb(${r},${g},${b})`;
}
var tt = hexToRgb('#ffffff');
console.log(tt);
```
