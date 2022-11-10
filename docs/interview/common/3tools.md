---
title: 工具函数
group:
  order: 3
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

```js
const loadJS = async (url, fn) => {
	const resolvedUrl = typeof url === 'function' ? await url() : url;
	const script = document.createElement('script')
	script.type = 'text/javascript';
	script.onload = fn;
	script.src = resolvedUrl;
	document.getElementsByTagName('head')[0].appendChild(script);
}
// 实际应用
function(remote) {
  return new Promise(resolve => {
    const callback = () => {
      if (!remote.inited) {
        remote.lib = window[remoteId];
        remote.lib.init(wrapShareScope(remote.from))
        remote.inited = true;
      }
      resolve(remote.lib);
    }
    return loadJS(remote.url, callback);
  });
}
```

动态加载 css

```js
// 加载 css
const dynamicLoadingCss = (cssFilePath) => {
  const metaUrl = import.meta.url;
  const curUrl = metaUrl.substring(0, metaUrl.lastIndexOf('remoteEntry.js'));
  const element = document.head.appendChild(document.createElement('link'));
  element.href = curUrl + cssFilePath;
  element.rel = 'stylesheet';
};
// 应用
dynamicLoadingCss('./__federation_expose_App.css');
```

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

### 浅比较

```js
function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true;

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}
```

### 是否是绝对 url 地址

```js
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}
isAbsoluteURL('iting://open'); // true
isAbsoluteURL('//baidu.com'); // true
```
