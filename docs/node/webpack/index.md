---
title: webpack
order: 0
group:
  title: webpack
  order: 3
  path: /node/webpack
nav:
  order: 5
  title: 'node'
  path: /node
---

> 本来对 webpack 是不抱什么希望，但是市面上 webpack 打包还是占多大数，只希望原理层面了解点皮毛

- webpack 构建流程
- webpack 打包基本原理
- webpack **treeShaking** 机制的原理是什么？

## 构建流程

[面经 webpack 构建](https://fe.ecool.fun/topic/59ec4023-36a6-42dd-a0d7-e35d6f3a49ef?orderBy=updateTime&order=desc&titleKey=webpack)

- 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；
- 开始编译：用上一步得到的参数初始化 **Compiler** 对象，加载所有配置的插件，执行对象的 **run** 方法开始执行编译；
- 确定入口：根据配置中的 entry 找出所有的入口文件；
- 编译模块：从入口文件出发，调用所有配置的 **Loader** 对模块进行编译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
- 完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被编译后的最终内容以及它们之间的依赖关系；
- 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 **Chunk**，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
- 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

## webpack 打包基本原理

## 打包过程

- 分析模块之间的依赖关系
- ES6 转 ES5
- 处理 exports 和 require 语法

### 处理模块之间的依赖关系

在打包过程中，Webpack 还处理模块之间的依赖关系。它生成的依赖关系图如下所示：

```js
{
  "./src/index.js": {
    "deps": { "./add.js": "./src/add.js" },
    "code": "....."
  },
  "./src/add.js": {
    "deps": {},
    "code": "......"
  }
}
```

### 处理 ES6 转 ES5(babel 的天下)

### 处理 exports 和 require 语法

#### 处理 exports

如果我们想加载一个模块，我们只需要两个步骤：

- 读取文件的内容
- 然后将字符串转换为可执行代码(eval), 在读取文件内容时，我们可以使用类似 **fs.readfileSync**()的 API。然后我们可以使用 eval 函数将文件中的字符串作为代码执行。

```js
// before
exports.default = function test(a, b) {
  return a + b;
};

// after
var exports = {}(function (exports, code) {
  eval(code);
})(exports, 'exports.default = function (a, b) {return a + b');
```

#### 处理 require 函数

require 函数需要做的事情非常简单，即**取出 exports 中的内容**。我们可以简化这个问题，假设我们只需要在 add 中加载内容。require 函数可以这样写：

```js
function require(file) {
  var exports = {};
  (function (exports, code) {
    eval(code);
  })(exports, 'exports.default = function test(a, b){return a + b}');
  return exports;
}
var add = require('add.js');
add(1, 2);
```

但实际场景是会有多个文件的导入，所以可以这么设计，文件名是 key,文件内容是 value

```js
let moduleList = {
  'index.js': `
    var add = require('add.js').default
    console.log(add(1 , 2))
        `,
  'add.js': `exports.default = function(a,b){return a + b}`,
}(function (list) {
  function require(file) {
    var exports = {}(function test(exports, code) {
      eval(code);
    })(exports, list[file]);
  }
  require('index.js');
})(moduleList);
```

## 简单明白说清楚

```js
const fs = require('fs');
const path = require('path');
// es6 code transform ast
const parser = require('@babel/parser');
// traverse 依赖路径
const traverse = require('@babel/traverse');
// paser transformFromAst es5代码
const babel = require('@babel/core');
const getModuleInfo = (file) => {
  const body = fs.readFileSync(file, 'utf-8');
  const ast = parser.parse(body, {
    sourceType: 'module', // 解析的是es模块 default sourceType: 'script'
  });
  // 收集依赖路径 win10系统下
  const deps = {};
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(file);
      const depsPath = node.source.value;
      const abspath = './' + path.join(dirname, depsPath);
      deps[depsPath] = abspath;
    },
  });
  const { code } = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env'],
  });
  return {
    file,
    deps,
    code,
  };
};
// 解析模块深层次遍历模块 输出字符串
const parseModules = (file) => {
  const entry = getModuleInfo(file);
  const temp = [entry];
  for (let i = 0; i < temp.length; i++) {
    const deps = temp[i].deps;
    if (deps) {
      for (const key in deps) {
        if (deps.hasOwnProperty(key)) {
          temp.push(getModuleInfo(deps[key]));
        }
      }
    }
  }
  // 存储格式 add.js: {deps: '', code: ''}
  const depsGraph = {};
  temp.forEach((moduleInfo) => {
    depsGraph[moduleInfo.file] = {
      deps: moduleInfo.deps,
      code: moduleInfo.code,
    };
  });
  return depsGraph;
};
// 输出bundle
const bundle = (file) => {
  const depsGraph = JSON.stringify(parseModules(file));
  return `
    (function (graph) {
      function require(file) {
        var exports = {};
        function absRequire(relPath) {
          return require(graph[file].deps[relPath])
        }
        // 
        (function(require, exports, code){
          console.log(require, exports, code)
          eval(code)
        })(absRequire, exports, graph[file].code);
        return exports;
      }
      require('${file}')
    })(${depsGraph})`;
};
// 按照路径生成文件
function emit(path) {
  const content = bundle(path);
  const distPath = './dist';
  const bundlePath = './dist/bundle.js';
  fs.unlinkSync(bundlePath);
  fs.rmdirSync(distPath);
  fs.mkdirSync(distPath);
  fs.writeFileSync(bundlePath, content);
}
emit('./src/index.js');
```

## loader 和 plugin

loader: 对源文件进行转换，比如对.vue 格式文件进行转换

plugin: 扩展 webpack 功能，比如代码压缩和代码分割

## 膜拜大佬

- [【Webpack】1362- 通过插图来理解 webpack](https://mp.weixin.qq.com/s/gUgWEg_z6e0ZR06q5WAGjQ)
