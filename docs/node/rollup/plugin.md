---
title: rollup插件机制
order: 1
group:
  title: rollup
  order: 5
  path: /node/rollup
nav:
  order: 5
  title: 'node'
  path: /node
---

- rollup 整体构建阶段，build 阶段和 output 阶段主要做了什么
- 插件中两个阶段都有哪些钩子函数
- 钩子函数都有哪些类型
- vite 如何兼容 rollup 插件的

## rollup 打包基本概念

Rollup 的打包过程中，会定义一套完整的构建生命周期，从开始打包到产物输出，中途会经历一些**标志性**的阶段，并且在不同阶段会自动执行对应的插件钩子函数(Hook)。对 Rollup 插件来讲，最重要的部分是钩子函数，一方面它定义了插件的**执行逻辑**，也就是"做什么"；另一方面也声明了插件的**作用阶段**，即"什么时候做"，这与 Rollup 本身的构建生命周期息息相关。

### output 自定义输出配置

```json
output: {
    // 产物输出目录
  dir: path.resolve(__dirname, 'dist'),
  // 以下三个配置项都可以使用这些占位符:
  // 1. [name]: 去除文件后缀后的文件名
  // 2. [hash]: 根据文件名和文件内容生成的 hash 值
  // 3. [format]: 产物模块格式，如 es、cjs
  // 4. [extname]: 产物后缀名(带`.`)
  // 入口模块的输出文件名
  entryFileNames: `[name].js`,
  // 非入口模块(如动态 import)的输出文件名
  chunkFileNames: 'chunk-[hash].js',
  // 静态资源文件输出文件名
  assetFileNames: 'assets/[name]-[hash][extname]',
  // 产物输出格式，包括`amd`、`cjs`、`es`、`iife`、`umd`、`system`
  format: 'cjs',
  // 是否生成 sourcemap 文件
  sourcemap: true,
  // 如果是打包出 iife/umd 格式，需要对外暴露出一个全局变量，通过 name 配置变量名
  name: 'MyBundle',
  // 全局变量声明
  globals: {
    // 项目中可以直接用`$`代替`jquery`
    jquery: '$'
  }
}
```

### 排除依赖 external

对于某些第三方包，有时候我们不想让 Rollup 进行打包，也可以通过 external 进行外部化:

```js
external: ['react', 'react-dom'];
```

### 插件

虽然 rollup 能输出 commonjs 的产物，但对于输入给 rollup 的代码并不支持 **commonjs** ,仅仅支持 ESM，因此，我们需要引入额外的插件去解决这个问题。

```js
pnpm i @rollup/plugin-node-resolve @rollup/plugin-commonjs
```

- @rollup/plugin-node-resolve 是为了**允许我们加载第三方依赖**，否则像 import React from 'react' 的依赖导入语句将不会被 Rollup 识别

- @rollup/plugin-commonjs 的作用是将 **CommonJS 格式的代码转换为 ESM 格式**

然后让我们在配置文件中导入这些插件:

```js
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

/**
 * @type { import('rollup').RollupOptions }
 */
export default {
  input: ['src/index.js'],
  output: [
    {
      dir: 'dist/es',
      format: 'esm',
    },
    {
      dir: 'dist/cjs',
      format: 'cjs',
    },
  ],
  // 通过 plugins 参数添加插件
  plugins: [resolve(), commonjs()],
};
```

其他场景的插件库：

- @rollup/plugin-json： 支持.json 的加载，并配合 rollup 的 Tree Shaking 机制去掉未使用的部分，进行按需打包。
- @rollup/plugin-babel：在 Rollup 中使用 Babel 进行 JS 代码的语法转译。
- @rollup/plugin-typescript: 支持使用 TypeScript 开发。
- @rollup/plugin-alias：支持别名配置。
- @rollup/plugin-replace：在 Rollup 进行变量字符串的替换。
- rollup-plugin-visualizer: 对 Rollup 打包产物进行分析，自动生成产物体积可视化分析图。

### JavaScript API 方式调用

**rollup.rollup**，用来一次性地进行 Rollup 打包

```js
// build.js
import { rollup as rollupAs } from 'rollup';
const inputOptions = {
  input: './src/index.js',
};

const outputOptionsList = [
  {
    dir: 'dist/es',
    format: 'esm',
    entryFileNames: '[name].[hash].cpp.js',
    chunkFileNames: 'chunk-[hash].cpp.js',
    assetFileNames: 'assets/[name]-[hash][extname]',
  },
  {
    dir: 'dist/cjs',
    format: 'cjs',
    entryFileNames: '[name].[hash].js',
    chunkFileNames: 'chunk-[hash].js',
    assetFileNames: 'assets/[name]-[hash][extname]',
  },
];

build();

async function build() {
  let bundle;
  let buildFailed = false;
  try {
    // create a bundle
    const bundle = await rollupAs(inputOptions);
    console.log(bundle, 'BUNDLE');
    await generateOutputs(bundle);
  } catch (error) {
    buildFailed = true;
    console.error(error);
  }
  if (bundle) {
    await bundle.close();
  }
  process.exit(buildFailed ? 1 : 0);
}

async function generateOutputs(bundle) {
  for (const outputOptions of outputOptionsList) {
    const { output } = await bundle.generate(outputOptions);
    console.log(output, 'output');
    // for (const chunkOrAsset of output) {
    //   if (chunkOrAsset.type === "asset") {
    //     console.log("Asset", chunkOrAsset);
    //   } else {
    //     console.log("Chunk", chunkOrAsset.modules);
    //   }
    // }
    await bundle.write(outputOptions);
  }
}
```

执行步骤

- 通过 **rollup.rollup**方法，传入 inputOptions，生成 bundle 对象；
- 调用 bundle 对象的 **generate 和 write** 方法，传入 outputOptions，分别完成产物和生成和磁盘写入。
- 调用 bundle 对象的 close 方法来结束打包。

## rollup 整体构建过程

```js
// Build 阶段
const bundle = await rollup.rollup(inputOptions);

// Output 阶段
await Promise.all(outputOptions.map(bundle.write));

// 构建结束
await bundle.close();
```

- Build 阶段主要负责创建模块依赖图，初始化各个模块的 AST 以及模块之间的依赖关系
- output 阶段: 真正进行打包的过程会在 Output 阶段进行，即在 bundle 对象的 generate 或者 write 方法中进行

对于一次完整的构建过程而言， Rollup 会先进入到 Build 阶段，解析各模块的内容及依赖关系，然后进入 Output 阶段，完成打包及输出的过程。对于不同的阶段，Rollup 插件会有不同的插件工作流程，

## 插件工作流程

### Hook 类型

不同 hook 代表不同插件的**执行特点**，插件的各种 Hook 可以根据这两个构建阶段分为两类: **Build Hook** 与 **Output Hook**

- Build Hook 即在 Build 阶段执行的钩子函数，在这个阶段主要进行模块代码的转换、AST 解析以及模块依赖的解析，那么这个阶段的 Hook 对于代码的操作粒度一般为模块级别，也就是**单文件级别**

- Ouput Hook(官方称为 Output Generation Hook)，则主要进行代码的打包，对于代码而言，操作粒度一般为 chunk 级别(一个 **chunk** 通常指很多文件打包到一起的产物)。

除了根据**构建阶段**可以将 Rollup 插件进行分类，根据不同的 Hook **执行方式** 也会有不同的分类，主要包括 Async、Sync、Parallel、Squential、First 这五种。在后文中我们将接触各种各样的插件 Hook，但无论哪个 Hook 都离不开这五种执行方式

### Hook 执行方式

- Async/Sync 异步和同步的钩子，最大的区别是同步的钩子不能有异步的逻辑，异步阔以有同步的逻辑,返回 Promise

- Parallel 这里指并行的钩子函数。如果有多个插件实现了这个钩子的逻辑，一旦有钩子函数是异步逻辑，则并发执行钩子函数，不会等待当前钩子完成(底层使用 Promise.all)。

- Squential 串行执行，这种 Hook 往往适用于插件间处理结果相互依赖的情况，前一个插件 Hook 的返回值作为后续插件的入参，这种情况就需要等待前一个插件执行完 Hook，获得其执行结果，然后才能进行下一个插件相应 Hook 的调用，如 transform

- First 如果多个插件都实现了这个钩子，那么这些钩子会依次运行，直到一个钩子返回的不是 null 或 undefined 的值为止。典型的 hook 比如 resolved,一旦插件的 resolved 返回了一个路径，将停止执行后的 resolved 的逻辑

还有的钩子同时是多种类型的钩子， options 钩子，是 async 和 sequential 类型，options 钩子可以是异步的，且是串行执行的，因为配置会按顺序依次被覆盖修改，如果是并行执行 options，那么最终的配置就会不可控

### Build 构建流程

![build.jpeg](https://s2.loli.net/2022/07/13/PmuW9hAvlqFwOnd.jpg)

步骤(options -> buildStart -> resolved -> load -> transform -> moduleParsed -> buildEnd)

- 1.首先经历 **options** 钩子进行配置的转换，得到处理后的配置对象。

- 2.随之 Rollup 会调用 **buildStart** 钩子，正式开始构建流程。

- 3.Rollup 先进入到 **resolveId** 钩子中解析文件路径。(从 input 配置指定的入口文件开始)。

- 4.Rollup 通过调用 **load** 钩子加载模块内容。

- 5.紧接着 Rollup 执行所有的 **transform** 钩子来对模块内容进行进行自定义的转换，比如 babel 转译。

- 6.现在 Rollup 拿到最后的模块内容，进行 AST 分析，得到所有的 import 内容，调用 **moduleParsed** 钩子:

  - 6.1 如果是普通的 import，则执行 **resolveId** 钩子，继续回到步骤 3。
  - 6.2 如果是动态 import，则执行 **resolveDynamicImport** 钩子解析路径，如果解析成功，则回到步骤 4 加载模块，否则回到步骤 3 通过 resolveId 解析路径。
    > 动态 import 是指什么

- 7.直到所有的 import 都解析完毕，Rollup 执行 **buildEnd** 钩子，Build 阶段结束。

当然，在 Rollup 解析路径的时候，即执行 resolveId 或者 resolveDynamicImport 的时候，有些路径可能会被标记为 external(翻译为排除)，也就是说不参加 Rollup 打包过程，这个时候就不会进行**load、transform**等等后续的处理了。

在流程图最上面，不知道大家有没有注意到 watchChange 和 closeWatcher 这两个 Hook，这里其实是对应了 rollup 的 watch 模式。当你使用 rollup --watch 指令或者在配置文件配有 watch: true 的属性时，代表开启了 Rollup 的 watch 打包模式，这个时候 Rollup 内部会初始化一个 watcher 对象，当文件内容发生变化时，watcher 对象会自动触发 watchChange 钩子执行并对项目进行重新构建。在当前打包过程结束时，Rollup 会自动清除 watcher 对象调用 closeWacher 钩子。

### Output 输出阶段

![output.jpeg](https://s2.loli.net/2022/07/13/Fc932oldqrwnM47.jpg)

步骤(十步)

outputOptions -> renderStart -> banner/footer/intro/outro ->

renderDynamicImport -> augmentChunkHash -> renderChunk ->

generateBundle -> writeBundle -> closeBundle

- 1.执行所有插件的 **outputOptions** 钩子函数，对 output 配置进行转换。

- 2.执行 **renderStart**，并发执行 renderStart 钩子，正式开始打包。

- 3.并发执行所有插件的 **banner、footer、intro、outro** 钩子(底层用 Promise.all 包裹所有的这四种钩子函数)，这四个钩子功能很简单，就是往打包产物的固定位置(比如头部和尾部)插入一些自定义的内容，比如协议声明内容、项目介绍等等。

- 4.从入口模块开始扫描，针对动态 import 语句执行 **renderDynamicImport** 钩子，来自定义动态 import 的内容。

- 5.对每个即将生成的 chunk，执行 **augmentChunkHash** 钩子，来决定是否更改 chunk 的哈希值，在 watch 模式下即可能会多次打包的场景下，这个钩子会比较适用。

- 6.如果没有遇到 **import.meta** 语句，则进入下一步，否则:

  - 6.1 对于 import.meta.url 语句调用 **resolveFileUrl** 来自定义 url 解析逻辑
  - 6.2 对于其他 import.meta 属性，则调用 **resolveImportMeta** 来进行自定义的解析。

- 7.接着 Rollup 会生成所有 chunk 的内容，针对每个 chunk 会依次调用插件的 **renderChunk** 方法进行自定义操作，也就是说，在这里时候你可以直接操作打包产物了。

- 8.随后会调用 **generateBundle** 钩子，这个钩子的入参里面会包含所有的打包产物信息，包括 chunk (打包后的代码)、asset(最终的静态资源文件)。你可以在这里删除一些 chunk 或者 asset，最终这些内容将不会作为产物输出。

- 9.前面提到了 rollup.rollup 方法会返回一个 bundle 对象，这个对象是包含 generate 和 write 两个方法，两个方法唯一的区别在于后者会将代码写入到磁盘中，同时会触发 writeBundle 钩子，传入所有的打包产物信息，包括 chunk 和 asset，和 generateBundle 钩子非常相似。不过值得注意的是，这个钩子执行的时候，产物已经输出了，而 generateBundle 执行的时候产物还并没有输出。顺序如下图所示:

**generateBundle -> 输出产物到磁盘 -> writeBundle**

- 10.当上述的 bundle 的 close 方法被调用时，会触发**closeBundle**钩子，到这里 Output 阶段正式结束。

> 第一次看这些钩子和步骤 根本记不住

### 膜拜

- [Output Generation Hooks](https://rollupjs.org/guide/en/#build-hooks)
