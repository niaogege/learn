---
title: 1208面试小记
order: 31
group:
  order: 11
  title: /interview/experience
nav:
  order: 3
  title: 'interview'
  path: /interview
---

12/01/02 三个月的时间尽量弥补短板，有太多的不会，有太多的没接触到的题目，不要灰心，更不要放弃

> 时间过的真快，三个月的功夫自己有进步了吗？好像除了残缺不全的记忆其他没啥长进

## 需要补充的短板

- [牛客网里的 100 道算法题，需要干掉](https://www.nowcoder.com/exam/oj?page=1&tab=%E7%AE%97%E6%B3%95%E7%AF%87&topicId=295)
- [牛客网里的 JS](https://www.nowcoder.com/exam/oj?page=1&pageSize=50&search=&tab=JS%E7%AF%87&topicId=2)

## 值得借鉴的面经

- [字节跳动前端面经（3 年工作经验附详细答案）](https://mp.weixin.qq.com/s/MYfuUSNS7xIAT4RgZIMv0g?poc_token=HJKJcmWjYrg5NsAJM_kYwsNn0jPlyGgEsQh4RNwX)

- [在百度工作三年半后，是时候说再见了](https://mp.weixin.qq.com/s/BQ4lTMIDh58Jrg0qLJEVLw)

- [[面经] 5 年前端 - 历时 1 个月收获 7 个 offer](https://juejin.cn/post/7142690757722243102?searchId=20231219153749735C4B8C58F910E747A8)

-[前端面经】2023 面试复盘之字节跳动](https://mp.weixin.qq.com/s/1uE70MfsoS7kQ4HB4rbeoA)

## 值得积累的面试题 2023/12/15

- 简单实现一下「模版字符串」功能：

```js
const name = 'John';
const age = 25;
const greeting = templateString`Hello, my name is ${name} and I'm ${age} years old.`;

console.log(greeting); // Output: Hello, my name is John and I'm 25 years old.
```

- 按照版本号对数组排序

- 数组目标和

- 对于深层对象转化为一层对象，其中 key 变为点号分隔的形式

## 202403 积累的面试题

- react18 相关
- react 和 vue 更新原理

## 如果不用 eval，还有其他方式去执行 js 函数吗？

### 1 使用 Function 构造函数

Function 构造函数可以创建一个新的函数对象，类似于 eval()，但它不会直接执行代码，而是返回一个函数。这种方式比 eval() 更安全，因为它不会访问当前作用域链。

```js
const code = 'return x + y;';
const dynamicFunction = new Function('x', 'y', code);

console.log(dynamicFunction(2, 3)); // 输出：5
```

优点：比 eval() 更安全，不会访问当前作用域。缺点：仍然会执行字符串中的代码，可能有潜在的安全风险（如代码注入）。

### 2 模板字面量和 **new Function** 构造器结合：

如果需要在函数内动态生成代码，可以结合模板字面量和 Function 构造器。

```js
let code = 'return a + b';
let dynamicFunc = new Function('a', 'b', `${code}`);
console.log(dynamicFunc(2, 3)); // 输出: 5
```

总之，虽然 eval 可以直接执行任意字符串形式的 JavaScript 代码，但由于其安全性和性能问题，通常建议用上述其他更安全的方法来实现相同的功能。

### 3 间接调用（通过变量来引用函数）：

如果你有一个函数名的字符串，可以通过对象的属性访问来间接调用该函数。

```js
function sayHello() {
  console.log('Hello!');
}

let funcName = 'sayHello';
window[funcName](); // 输出: Hello!
```

### setTimeout 和 setInterval：

setTimeout 和 setInterval 方法可以接受字符串形式的代码，并在特定的时间后执行。这种方式不推荐使用，因为它实际是类似于 eval 的行为。

```js
setTimeout('console.log("Hello World!")', 1000); // 一秒后输出 "Hello World!"
```
