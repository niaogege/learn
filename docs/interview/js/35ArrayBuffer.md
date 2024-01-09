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

ArrayBuffer/Uint8Array/Blob/File 到底都是些什么东东？今天来学习下

## Blob

Blob

Blob 是对大数据块的不透明引用或者句柄。名字源于 SQL 数据库，表示“**二进制大数据**”（Binary Large Object）。在 JavaScript 中 Blob 通常表示二进制数据，但是不一定是大量数据。Blob 是不透明的，我们可以对它执行的操作只有获取它的大小，MIME 类型和将他切割成更小的 Blob。——《JavaScript 权威指南》

## File

File 继承 Blob,并基于用户的操作系统拓展了 blob，使用户可以通过浏览器安全的访问系统的 File
