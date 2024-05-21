---
title: JS各种数据流之间的格式
order: 35
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

> 摘自[JS 二进制之 File、Blob、FileReader、ArrayBuffer、Base64](https://juejin.cn/post/7306802651009138688?searchId=20240520101125C0A0B108A4F04C293364)

- ArrayBuffer/Uint8Array/Blob/File 到底都是些什么东东？今天来学习下

## Blob

Blob【Binary large object】即**二进制大对象**，表示原始文件的数据。它表示一个不可变、原始数据的类文件对象。它的数据可以按文本或二进制的格式进行读取，也可以转成  ReadableStream  来用于数据操作。简单来说，Blob 就是一个不可修改的二进制文件！

### 1.1 Blob 创建

```js
new Blob(array, options);
```

- array 是一个包含字符串、ArrayBuffer、ArrayBufferView、Blob 等的数组或可迭代对象。多个 BlobParts 会按照它们在数组中的顺序进行连接以形成 Blob。如果省略该参数，则创建一个空的 Blob。 options 是一个对象，可选属性为

- type 【较常用】 ，默认值为""，表示放入到 blob 对象中内容的 MIME 类型

### 1.2 Blob 切片

Blob 对象内置了 slice() 方法用来将 blob 对象分片，其语法如下：

```js
const instanceOfBlob = new Blob(array, options);
const blob = instanceOfBlob.slice([start [, end [, contentType]]]};
```

其有三个参数：

- start：设置切片的起点，即切片开始位置。默认值为 0，这意味着切片应该从第一个字节开始；
- end：设置切片的结束点，会对该位置之前的数据进行切片。默认值为 blob.size；
- contentType：设置新 blob 的 MIME 类型。如果省略 type，则默认为 blob 的原始值。

来看下面例子

```js
const iframe = document.getElementsByTagName('iframe')[0];

const blob = new Blob(['Hello World'], { type: 'text/plain' });

const subBlob = blob.slice(0, 5);

iframe.src = URL.createObjectURL(subBlob);
```

此时页面会显示"Hello"。

## File

File 继承 Blob,并基于用户的操作系统拓展了 blob，使用户可以通过浏览器安全的访问系统的 File

> File 对象 其实就是特殊类型的 Blob，即 Blob 的属性和方法同样适用于 File 对象。

### JS 中主要有两个地方产生 File 对象：

- 通过`<input type='file'>` 元素上传文件后，返回的 **FileList** 对象
- 文件拖放操作生成的**DataTransfer** 对象

看下两个示例

```js
// FileList
<input type="file" id="fileInput" multiple="multiple">
const fileInput = document.getElementById("fileInput");
fileInput.onchange = (e) => {
  console.log(e.target.files);
}
```

```js
// 文件拖放
<div id="drop-zone"></div>;
const dropZone = document.getElementById('drop-zone');
dropZone.ondragover = (e) => {
  e.preventDefault();
};
dropZone.ondrop = (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  console.log(files);
};
```

注意：

- 两个拖拽事件中都需要添加 e.preventDefault()，用来阻止默认事件，可以阻止浏览器的一些默认行为。比如默认浏览器不允许任何拖拽操作！！

- **e.dataTransfer.files** 的属性值是一个 FileList 数组。

## FileReader

FileReader **是一个异步 API**，用于读取文件并提取其内容以供进一步使用。 【 FileReader 可以将 Blob 读取为不同的格式！！】

## ArrayBuffer

ArrayBuffer 对象用来表示通用的、固定长度的**原始二进制数据缓冲区**。ArrayBuffer 的内容不能直接操作，只能通过 **DataView 对象或 TypedArrray** 对象来访问。这些对象用于读取和写入缓冲区内容。

> 注意： ArrayBuffer 本身就是一个黑盒，不能直接读写所存储的数据，需要借助以下视图对象来读写

## Object URL

Object URL 又称 Blog URL，它是一个用来表示 File Object 或 Blob Object 的 URL。在网页中，我们可能会看到过这种形式的 Blob URL：

创建一个指向 Blob 或 File 对象的可以用作图像、二进制数据下载链接等的 URL 源，可以在 `< img /> < script /> `中用当作 src 属性的值！！

```js
const objUrl = URL.createObjectURL(new File([''], 'filename'));
console.log(objUrl);
URL.revokeObjectURL(objUrl);
```

## Base64

Base64 是一种**基于 64 个可打印字符来表示二进制数据**的表示方法。Base64 编码普遍应用于需要通过被设计为处理文本数据的媒介`< img />`上储存和传输二进制数据而需要编码该二进制数据的场景。这样是为了保证数据的完整并且不用在传输过程中修改这些数据。

在 JavaScript 中，有两个函数被分别用来处理解码和编码 base64 字符串：

- atob()：解码，解码一个 Base64 字符串；
- btoa()：编码，从一个字符串或者二进制数据编码成一个 Base64 字符串。

## 总结

https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/042e945267784767bae2ff9852d9c80f~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1512&h=1070&s=146124&e=webp&b=fefcfc
