---
title: Node学习笔记
order: 1
group:
  title: study
  order: 1
  path: /study
nav:
  order: 1
  title: 'node'
  path: /node
---

## Nodejs 阔以做什么

Node.js 是运行在操作系统中的 **JavaScript 运行时环境**，提供了一系列操作系统的 API，通过它们我们可以执行**操作系统指令、读写文件、建立网络连接、调用操作系统中的其他服务**等等。

Node.js 内置的模块比较丰富，常用的主要是以下几个。

- File System 模块：这是操作系统的目录和文件的模块，提供文件和目录的读、写、创建、删除、权限设置等等。

- Net 模块：提供网络套接字 socket，用来创建 TCP 连接，TCP 连接可以用来访问后台数据库和其他持久化服务。

- HTTP 模块：提供创建 HTTP 连接的能力，可以用来创建 Web 服务，也是 Node.js 在前端最常用的核心模块。

- URL 模块：用来处理客户端请求的 URL 信息的辅助模块，可以解析 URL 字符串。

- Path 模块：用来处理文件路径信息的辅助模块，可以解析文件路径的字符串。

- Process 模块：用来获取进程信息。

- Buffer 模块：用来处理二进制数据。

- Console 模块：控制台模块，同浏览器的 Console 模块，用来输出信息到控制台。

- Crypto 加密解密模块：用来处理需要用户授权的服务。

- Events 模块：用来监听和派发用户事件。

> process.argv 可以获得命令行调用的信息，以空格分隔。所以，按照我们执行 node ziyue.js 的命令，这时候 process.argv 的值是数组['node', 'ziyue.js']

### 模块化

所谓模块化，就是指代码具有模块结构，整个应用可以自顶向下划分为若干个模块，每个模块彼此独立，代码不会相互影响。模块化的目的是使代码可以**更好地复用**，从而支持更大规模的应用开发。

### esModule(.mjs)

export 导出的时候别名

```js
export {
  a as aa,
  b as bb;
}
```

引入的时候

```js
import { aa, bb } from '../xx.mjs';
```

我们可以任意命名导出的 API 名字，同样，我们也可以在引入的时候给其它模块的 API 命名。

```js
import { a as c, b as d } from './ziyue.mjs';
```

我们也可以在导入的时候，将这些导出的 API 声明成一个任意名字的对象的属性：

```js
// ziyue.mjs

const ziyue = (text) => { ... } ;
const a = 10;
const b = '君喻学堂';

export default ziyue;
export {a, b};
```

导入的时候：

```js
import * as foo from './ziyue.mjs';

console.log(foo.a); // 10
console.log(foo.b); // 君喻学堂
console.log(foo.default); // [Object Function]
```

### commonjs

在 CommonJS 规范中，有两种导出模块 API 的方式：**module.exports 和 exports**。这两个变量默认情况下都指向同一个初始值{}。因此，除了使用 module.exports 我们也可以使用 exports 变量导出模块的 API：

```js
module.exports = {};
const tt = require('../xx');
```

但是，这种用法不能和 module.exports 混用。因为 module.exports = 新对象改写了 module.exports 的默认引用，而引擎默认返回的是 modeule.exports，从而导致 exports 指向的初始空间无效了

```js
exports.a = 1;
exports.b = 2;
exports.c = () => a + b;
const d = 'foobar';
moudle.exports = { d };
```

上面的代码只导出了 d:foobar 而没有导出 a、b、c，因为 module.exports = {d}覆盖了默认的初始空间，这让之前 exports 变量上增加的属性（a、b、c）不会再被导出。

### ES Modules 的向下兼容

在 **Node.js** 环境中，ES Modules 向下兼容 CommonJS，因此用 import 方式可以引入 CommonJS 方式导出的 API，但是会以 **default** 方式引入。

> 由于 ES Module 的向下兼容，遵循 CommonJS 规范的模块可以被 ES Module 规范以 default 方式引入

因此以下写法：

```js
// abc.js 这是一个 CommonJS 规范的模块
const a = 1;
const b = 2;
const c = () => a + b;

module.exports = { a, b, c };
```

它可以用 ES Modules 的 import 引入：

```js
import abc from './test.js';
console.log(abc.a, abc.b, abc.c()); // 1 2 3
```

但是不能用

```js
import { a, b, c } from './test.js';
```

因为 **module.exports = {a, b, c}** 相当于 EsModule 中的**export default module**：

```js
const abc = { a, b, c };
export default abc;
```

### ES Modules 与 CommonJS 的主要区别

- 如果要在导出时使用别名，ES Modules 要写成：

```js
export { a as aa, b as bb };
```

而对应的 CommonJS 的写法是：

```js
module.exports = {
  a: aa,
  b: bb,
};
```

- CommonJS 在 require 文件的时候采用文件路径，并且可以忽略 .js 文件扩展名。也就是说，require('./ziyue.js')也可以写成 require('./ziyue')。但是，ES Modules 在 import 的时候采用的是 URL 规范就不能省略文件的扩展名，而必须写成完整的文件名**import {ziyue} from './ziyue.mjs'**，.mjs 的扩展名不能省略

  > 如果你使用 Babel 编译的方式将 ES Modules 编译成 CommonJS，因为 Babel 自己做了处理，所以可以省略文件扩展名，但是根据规范还是应该保留文件扩展名。

- ES Modules 的 import 和 export 都只能写在最外层，不能放在块级作用域或函数作用域中。

```js
if (condition) {
  import { a } from './foo';
} else {
  import { a } from './bar';
}
```

这样的写法，在 ES Modules 中是不被允许的。但是，想下面这样写在 CommonJS 中是被允许的：

```js
let api;
if (condition) {
  api = require('./foo');
} else {
  api = require('./bar');
}
```

- require 是一个函数调用，路径是参数字符串，它可以动态拼接，比如：

```js
const libPath = ENV.supportES6 ? './es6/' : './';
const myLib = require(`${libPath}mylib.js`);
```

但是**ES Modules 的 import**语句是不允许用动态路径的。

### import() 动态加载

ES Modules 不允许 import 语句用动态路径，也不允许在语句块中使用它。但是，它提供了一个异步动态加载模块的机制 —— **将 import 作为异步函数使用**。

```js
const ziyue = (text) => `cpp:${text}`;
export default ziyue;
```

注意在 nodejs 环境的下动态加载

```js
(async function () {
  const tt = await import('./test2.mjs');
  console.log(tt); // { default: [Function: ziyue] }
  const argv = process.argv;
  console.log(tt.default(argv[2] || '巧言令色，鮮矣仁！'));
})();
```

### fs 模块

fs 模块中有两个方法可以方便地读取出文件内容，一个是**readFile**，一个是**readFileSync**，前者是异步方法，后者是同步方法

```js
import { readFile } from 'fs';
readFile('./index', (err, data) => {
  console.log(data);
});
```

### 参考

- [nodejs eventEmitter](https://nodejs.cn/api/events.html)
