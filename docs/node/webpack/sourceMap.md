---
title: webpack SourceMap配置
order: 4
group:
  title: webpack
  order: 3
  path: /node/webpack
nav:
  order: 5
  title: 'node'
  path: /node
---

webpack 中针对 sourceMap 设置有好几种，我是一时间难以区分开

```js
// server.js
module.exports = {
  mode: 'development',
  target: 'node',
  devtool: 'source-map', // eval nosources cheap module
  entry: path.resolve(__dirname, '../src/server/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'),
    libraryTarget: 'commonjs',
  },
};
```

### eval

eval 的 api 是动态执行 JS 代码的。比如：

```js
eval(`function add(a,b) {return a+b};add(1,2)`);
```

但有个问题，eval 的代码打不了断点。怎么解决这个问题呢？

浏览器支持了这样一种特性，只要在 eval 代码的最后加上 **//# sourceURL=xxx**，那就会以 xxx 为名字把这段代码加到 sources 里。

```js
eval(`function add(a,b) {return a+b};add(1,2);//# sourceURL=cpp.js`);
```

除了指定 source 文件还能指定 **sourceMappingURL** 来映射到源码

```js
eval(`function add(a,b) {return a+b};add(1,2);
//# sourceURL=cpp.js 
//# sourceMappingURL=bundle.js.map`);
```

执行完之后，源码处会多一个 cpp.js 文件，然后就能在 eval 里打断点了。webpack 就利用了 eval 这个特性来优化的 sourcemap 生成的性能，比如你可以指定 devtool 为 eval：

### source-map

source-map 的配置是生成独立的 sourcemap 文件：

```js
module.exports = {
  mode: 'development',
  target: 'node',
  devtool: 'source-map', // eval nosources cheap module
  entry: path.resolve(__dirname, '../src/server/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'),
    libraryTarget: 'commonjs',
  },
};
```

可以关联，也可以不关联，比如加上 hidden，就是生成 sourcemap 但是不关联：

```js
module.exports = {
  mode: 'development',
  target: 'node',
  devtool: 'hidden-source-map', // eval nosources cheap module
  entry: path.resolve(__dirname, '../src/server/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'),
    libraryTarget: 'commonjs',
  },
};
```

关联就是

```js
// 此处省略
/******/ })()
;
//# sourceMappingURL=bundle.js.map
```

不关联就是,末尾啥也没有

```js
// bundle.js
{
}
```

生产环境就不需要关联 sourcemap，但是可能要生成 sourcemap 文件，把它上传到错误管理平台之类的，用来映射线上代码报错位置到对应的源码。

> 生产环境为啥不需要关联 sourcemap？追踪不了源代码错误，只能提示到构建后代码的错误位置

### cheap

sourcemap 慢主要是处理映射比较慢，很多情况下我们不需要映射到源码的行和列，只要精确到行就行，这时候就可以用 cheap。

```js
module.exports = {
  mode: 'development',
  target: 'node',
  devtool: 'cheap', // eval nosources cheap module
  entry: path.resolve(__dirname, '../src/server/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'),
    libraryTarget: 'commonjs',
  },
};
```

### module

webpack 中对一个模块会进行多次处理，比如经过 loader A 做一次转换，再用 loader B 做一次转换，之后打包到一起。

每次转换都会生成 sourcemap，那也就是有多个 sourcemap：

那如果你想调试最初的源码怎么办呢？

那就把每一次的 loader 的 sourcemap 也关联起来，这就是 module 配置的作用。这样就能一次性映射回最初的源码：

### nosources

sourcemap 里是有 sourceContent 部分的，也就是直接把源码贴在这里，这样的好处是根据文件路径查不到文件也可以映射，但这样会增加 sourcemap 的体积。

如果你确定**根据文件路径能查找到源文件**，那不生成 sourceContent 也行。

如果配置 nosources 之后，生成的 souremap 就没有 sourceContent 部分，这样好处就是 souremap 文件会小很多

### 校验规则

它是按照这个正则来校验的：^(inline-|hidden-|eval-)?(nosources-)?(cheap-(module-)?)?source-map$

- source-map：外部。可以查看错误代码准确信息和源代码的错误位置。

- inline-source-map：内联。只生成一个内联 Source Map，可以查看错误代码准确信息和源代码的错误位置

- hidden-source-map：外部。可以查看错误代码准确信息，但不能追踪源代码错误，只能提示到构建后代码的错误位置。

-eval-source-map：内联。每一个文件都生成对应的 Source Map，都在 eval 中，可以查看错误代码准确信息 和 源代码的错误位置。

- nosources-source-map：外部。可以查看错误代码错误原因，但不能查看错误代码准确信息，并且没有任何源代码信息。

- cheap-source-map：外部。可以查看错误代码准确信息和源代码的错误位置，只能把错误精确到整行，忽略列。

- cheap-module-source-map：外部。可以错误代码准确信息和源代码的错误位置，module 会加入 loader 的 Source Map。
