---
title: 初识Ast
order: 1
group:
  title: babel
  order: 0
  path: /babel
nav:
  order: 1
  title: 'node'
  path: /node
---

![babel APi.png](https://s2.loli.net/2022/06/22/N7Rhz9UsBLpwGlQ.png)

## AST

标识符 Identifer、各种字面量 xxLiteral、各种语句 xxStatement，各种声明语句 xxDeclaration，各种表达式 xxExpression，以及 Class、Modules、File、Program、Directive、Comment 这些 AST 节点

### Literal

Literal 是字面量的意思，比如 let name = 'guang'中，'guang'就是一个字符串字面量 StringLiteral，相应的还有数字字面量 NumericLiteral(11)，布尔字面量 BooleanLiteral(false)，字符串字面量 StringLiteral('chendapeng')，正则表达式字面量 RegExpLiteral(/^[a-z]+/) 等

### Identifier 标识符

Identifer 是标识符的意思，**变量名、属性名、参数名**等各种声明和引用的名字，都是 Identifer。我们知道，JS 中的标识符只能包含字母或数字或下划线（“\_”）或美元符号（“$”），且不能以数字开头。这是 Identifier 的词法特点。

```js
const name = 'guang'; // name
function say(name) {
  // say name
  console.log(name); // console log name
}
const obj = {
  // obj
  name: 'guang', // name
};
```

### Statement

statement 是语句，它是可以独立执行的单位，比如 break、continue、debugger、return 或者 if 语句、while 语句、for 语句，还有声明语句，表达式语句等。我们写的每一条可以独立执行的代码都是语句。

语句末尾一般会加一个分号分隔，或者用换行分隔。

下面这些我们经常写的代码，每一行都是一个 Statement：

```js
break;
continue;
return;
debugger;
throw Error();
{}
try {} catch(e) {} finally{}
for (let key in obj) {}
for (let i = 0;i < 10;i ++) {}
while (true) {}
do {} while (true)
switch (v){case 1: break;default:;}
label: console.log();
with (a){}
```

### Declaration

声明语句是一种特殊的语句，它执行的逻辑是在作用域内声明一个变量、函数、class、import、export 等。声明语句用于定义变量，变量声明也是代码中一个基础的部分。

```js
const a = 1; // VariableDeclaration
function b() {} // FunctionD
class C {} // ClassD

import d from 'e'; // ImportD

export default e = 1; // ExportDefaultD
export { e }; // ExportName
export * from 'e'; // ExportAll
```

### expression

expression 是表达式，特点是执行完以后有返回值，这是和语句 (statement) 的区别。

```js
[1,2,3] // ArrayExpression // 数组表达式
a = 1 // Assignment 赋值表达式
1 + 2; // Binary 二元表达式
-1; // Unary 一元表达式
function(){}; // Function
() => {}; // ArrowFunction
class{}; // Class
a; // Indentifier
this; // This
super; // Super
a::b; // BindExporess 绑定表达式
```

## 参考文档

- [最详细、最全面的 Babel 小抄](https://mp.weixin.qq.com/s/miey_S-cBElyxOiAnMVOmw)
- [保姆级教学！这次一定学会 babel 插件开发！](https://mp.weixin.qq.com/s/ZVWffh-MWcRNl2rDp0cKiQ)
