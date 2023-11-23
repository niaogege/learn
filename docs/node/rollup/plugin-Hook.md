---
title: Hook
order: 2
group:
  title: rollup
  order: 5
  path: /node/rollup
nav:
  order: 5
  title: 'node'
  path: /node
---

看了好久的 plugin，前期铺垫这么久，需要来点实战(笔记)

实际上开发 Rollup 插件就是在编写一个个 Hook 函数，你可以理解为一个 Rollup 插件基本就是各种 **Hook** 函数的组合

## 路径解析 resolved

resolveId 钩子一般用来解析模块路径，为 **Async + First** 类型即 **异步优先** 的钩子。这里我们拿官方的 alias 插件 来说明，这个插件用法演示如下:

```js
export default alias(options) {
  // 获取 entries 配置
  const entries = getEntries(options);
  return {
    // 传入三个参数，当前模块路径、引用当前模块的模块路径、其余参数
    resolveId(importee, importer, resolveOptions) {
      // 先检查能不能匹配别名规则
      const matchedEntry = entries.find((entry) => matches(entry.find, importee));
      // 如果不能匹配替换规则，或者当前模块是入口模块，则不会继续后面的别名替换流程
      if (!matchedEntry || !importerId) {
        // return null 后，当前的模块路径会交给下一个插件处理
        return null;
      }
      // 正式替换路径
      const updatedId = normalizeId(
        importee.replace(matchedEntry.find, matchedEntry.replacement)
      );
      // 每个插件执行时都会绑定一个上下文对象作为 this
      // 这里的 this.resolve 会执行所有插件(除当前插件外)的 resolveId 钩子
      return this.resolve(
        updatedId,
        importer,
        Object.assign({ skipSelf: true }, resolveOptions)
      ).then((resolved) => {
        // 替换后的路径即 updateId 会经过别的插件进行处理
        let finalResult: PartialResolvedId | null = resolved;
        if (!finalResult) {
          // 如果其它插件没有处理这个路径，则直接返回 updateId
          finalResult = { id: updatedId };
        }
        return finalResult;
      });
    }
  }
}
```

从这里你可以看到 resolveId 钩子函数的一些常用使用方式，它的入参分别是当前模块路径、引用当前模块的模块路径、解析参数，返回值可以是 null、string 或者一个对象，我们分情况讨论。

- 返回值为 null 时，会默认交给下一个插件的 resolveId 钩子处理。
- 返回值为 string 时，则停止后续插件的处理。这里为了让替换后的路径能被其他插件处理，特意调用了 **this.resolve** 来交给其它插件处理，否则将不会进入到其它插件的处理。
- 返回值为一个对象，也会停止后续插件的处理，不过这个对象就可以包含更多的信息了，包括解析后的路径、是否被 enternal、是否需要 tree-shaking 等等，不过大部分情况下返回一个 string 就够用了。

## 加载模块 load

load 为 Async + First 类型，即异步优先的钩子，和 resolveId 类似。它的作用是通过 resolveId 解析后的路径来加载模块内容。这里，我们以官方的 image 插件 为例来介绍一下 load 钩子的使用。源码简化后如下所示:

```js
const mimeTypes = {
  '.jpg': 'image/jpeg',
  // 后面图片类型省略
};

export default function image(opts = {}) {
  const options = Object.assign({}, defaults, opts);
  return {
    name: 'image',
    load(id) {
      const mime = mimeTypes[extname(id)];
      if (!mime) {
        // 如果不是图片类型，返回 null，交给下一个插件处理
        return null;
      }
      // 加载图片具体内容
      const isSvg = mime === mimeTypes['.svg'];
      const format = isSvg ? 'utf-8' : 'base64';
      const source = readFileSync(id, format).replace(/[\r\n]+/gm, '');
      const dataUri = getDataUri({ format, isSvg, mime, source });
      const code = options.dom ? domTemplate({ dataUri }) : constTemplate({ dataUri });

      return code.trim();
    },
  };
}
```

从中可以看到，load 钩子的入参是模块 id，返回值一般是 null、string 或者一个对象：

- 如果返回值为 null，则交给下一个插件处理；
- 如果返回值为 string 或者对象，则终止后续插件的处理，如果是对象可以包含 SourceMap、AST 等更详细的信息。

## 代码转换 transform

transform 钩子也是非常常见的一个钩子函数，为 **Async + Sequential** 类型，也就是 异步串行钩子，作用是对加载后的模块内容进行**自定义的转换**。我们以官方的 replace 插件为例，这个插件的使用方式如下:

```js
// rollup.config.js
import replace from '@rollup/plugin-replace';

module.exports = {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'cjs',
  },
  plugins: [
    // 将会把代码中所有的 __TEST__ 替换为 1
    replace({
      __TEST__: 1,
    }),
  ],
};
```

内部实现(伪代码)

```js
import MagicString from 'magic-string';

export default function replace(options = {}) {
  return {
    name: 'replace',
    renderChunk(code, chunk) {
      const id = chunk.fileName;
      if (!keys.length) return null;
      if (!filter(id)) return null;
      return executeReplacement(code, id);
    },

    transform(code, id) {
      // 省略一些边界情况的处理
      // 拿到 chunk 的代码及文件名，执行替换逻辑
      if (!keys.length) return null;
      if (!filter(id)) return null;
      return executeReplacement(code, id);
    },
  };

  function executeReplacement(code, id) {
    const magicString = new MagicString(code);
    if (!codeHasReplacements(code, id, magicString)) {
      return null;
    }
    const result = { code: magicString.toString() };
    if (isSourceMapEnabled()) {
      result.map = magicString.generateMap({ hires: true });
    }
    return result;
  }
}
```

transform 钩子的入参分别为**模块代码、模块 ID**，返回一个包含 **code(代码内容) 和 map(SourceMap 内容) 属性**的对象，当然也可以返回 null 来跳过当前插件的 transform 处理。需要注意的是，当前插件返回的代码会作为下一个插件 transform 钩子的第一个入参，实现类似于瀑布流的处理。

## Chunk 级代码修改 renderChunk

**Async + Sequential**, 异步串行钩子，还是以官方的 replace 插件为例，代码在上面

这里我们把关注点放到 renderChunk 函数本身，可以看到有两个入参，分别为 **chunk 代码内容、chunk 元信息**，返回值跟 transform 钩子类似，既可以返回包含 code 和 map 属性的对象，也可以通过返回 null 来跳过当前钩子的处理。

## 产物生成最后一步 **generateBundle**

generateBundle 也是 **Async + Sequential** 异步串行的钩子，你可以在这个钩子里面自定义删除一些无用的 chunk 或者静态资源，或者自己添加一些文件。这里我们以 Rollup 官方的 html 插件来具体说明，这个插件的作用是通过拿到 Rollup 打包后的资源来生成包含这些资源的 HTML 文件，源码简化后如下所示:

```js
// ...
export default function html(opts = {}): Plugin {
  // 初始化配置
  return {
    name: 'html',
    async generateBundle(output, bundle) {
      // 省略一些边界情况的处理
      // 1. 获取打包后的文件
      const files = getFiles(bundle);
      // 2. 组装 HTML，插入相应 meta、link 和 script 标签
      const source = await template({ attributes, bundle, files, meta, publicPath, title });
      // 3. 通过上下文对象的 emitFile 方法，输出 html 文件
      const htmlFile: EmittedAsset = {
        type: 'asset',
        source,
        name: 'Rollup HTML Asset',
        fileName,
      };
      this.emitFile(htmlFile);
    },
  };
}
```

入参分别为**output 配置、所有打包产物的元信息对象**，通过操作元信息对象你可以删除一些不需要的 chunk 或者静态资源，也可以通过 插件上下文对象的 **emitFile** 方法输出自定义文件。
