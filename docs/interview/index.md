---
title: interview 综述
group:
  order: 0
  title: interview
nav:
  order: 3
  title: 'interview'
  path: /interview
---

- 我每天都在问自己，如果现在公司裁员，我有幸拿大礼包了，我是该如何度过这段艰难的岁月
- 各种原理东西，读了看了，在试着手写，手写 1 遍/2 遍...，试着理解设计思想，感觉过一段时间又忘记了
- 面试中如何表现自信一点，如果不想尴尬，觉得自己能值，那就从现在开始记录，一点一点记录，一点一点累计
- 一开始化简为繁，自己不会的东西越来越多，记得东西越来越繁杂
- 慢慢的，化繁为简，哈哈哈，你脑子基本就有大致思路和框架了
- 面试中的任何一个问题，面试官描述完试题，要知道他要考察的是哪类问题，然后再去大脑搜寻相关的知识点
- 搜集见过的面试题，争取在面试中自信一点而已
- 面试终归是八股文，能解决实际问题才是王道
- 因为简历平平无奇，正要把基础知识吃透，为啥简历会这么平淡，宛如白水，一口下去，啥也没有
- 20231129 再次记录下磕磕绊绊的复习，感觉复习永远复习不完，只能把精力放在核心知识点上
- 20240302 每次都需要翻记录，其实核心知识点就这么多，万变不离其宗
  > 然后所有的这些都是基本，只是合格工程师需要掌握的基础知识而已 !

![前端面试.png](https://s2.loli.net/2022/06/23/Z5V4FuNXb7GdrhE.png)

## 心得

- [2023 行情不好，大龄员工如何跳槽](https://juejin.cn/post/7300118821533089807)

## 面试考察

### 第一部分：八股文

主要包含：js /css 基础知识/ts/网络基础/浏览器相关/nodejs,还有一个比较重要的部分：手写 JS 应用场景

### 第二部分：框架

主要包含：vue/react/打包工具/前端工程化/CICD

### 第三部分：算法

主要包含：排序/字符串/数组/dp/二叉树/DFS/BFS/链表/回溯/单调栈/贪心/双指针

## 八股文 基础知识

### [手写 JS](../interview//experiences/16easyHandwriting.md)

### JS

> 🌟🌟🌟🌟🌟 五星 必考 四星 问的几率大 三星 可能会问到

- 前端性能优化 🌟🌟🌟🌟🌟
- js 执行机制/事件循环 eventLoop 🌟🌟🌟🌟🌟
- 异步编程解决方案 🌟🌟🌟🌟
- 作用域和作用域链/闭包 🌟🌟🌟🌟
- this/call/apply/bind 指向 🌟🌟🌟🌟
- 原型和原型链 🌟🌟🌟🌟
- 继承 🌟🌟
- requestAnimationFrame 和 requestIdleCallback🌟🌟🌟
- 箭头函数和普通函数区别 🌟🌟
- Map 和 WeakMap🌟🌟
- Set 和 WeakSet🌟🌟
- CRP 优化关键渲染路径和重绘、重排 🌟🌟🌟🌟
- dom 事件处理程序 🌟🌟🌟
- 事件捕获事件冒泡 🌟🌟
- 事件代理(事件委托)🌟🌟
- 内存泄露 🌟🌟🌟
- 垃圾回收 🌟🌟🌟
- 设计模式 🌟

### CSS

- 盒模型 🌟🌟🌟
- BFC 🌟🌟🌟🌟🌟
- Flex 布局 🌟🌟🌟🌟🌟
- 样式优先级 🌟🌟🌟
- position 属性 🌟🌟🌟
- 水平垂直居中 🌟🌟🌟
- 分析比较 opacity: 0、visibility: hidden、display: none 优劣和适用场景 🌟🌟🌟

### browser

- 浏览器渲染原理 🌟🌟🌟🌟🌟
- jwt/cookie/session 🌟🌟🌟
- csrf/xss 🌟🌟🌟
- 跨域 🌟🌟🌟🌟
- web 缓存 🌟🌟🌟🌟🌟
- 性能优化 🌟🌟🌟🌟🌟

### nodejs

- ESModule 和 Commonjs 区别 🌟🌟🌟🌟🌟
- treeShaking 原理 🌟🌟🌟🌟🌟
- v8 相关
- 垃圾回收 🌟🌟🌟
- 如何利用多核 CPU🌟🌟🌟🌟
- node 事件循环机制 🌟🌟
- nodejs 如何做负载均衡 🌟🌟🌟🌟

### 网络

- http1.0/http1.1/http2🌟🌟🌟🌟
- http3🌟🌟
- https🌟🌟🌟
- tcp/udp/http🌟🌟🌟
- http 缓存 🌟🌟🌟🌟
- WebSocket🌟🌟

### ts

- 泛型 🌟🌟
- 各种类型体操 🌟🌟🌟🌟🌟
- 逆变和协变 🌟🌟
- interface 和 type 区别 🌟🌟🌟🌟🌟

> 在哪里跌倒 就在哪里爬起来

> 运行时 runtime 是什么意思

## 框架(react/vue)

## [算法](../interview/logic/)

## 面试经验总结

- 提前准备后自我介绍，自己私下多说几遍
- 提前准备好跳槽原因 1.个人发展：想去大公司看看，了解基建/行为准则， 2.业务发展：缓慢看不到希望，组织调整频繁，下面人员变动频繁
- 个人发展规划：

- 准备问题： 技术栈/负责的业务
- 项目深挖： 提前准备好项目开发过程中遇到的难点以及如何去解决这个问题？

a.ssr 降级 b.next 项目介入 pm2，守护 node 服务进程

## 大龄程序员如何准备前端面试

> 估计最后一次这么努力刻苦准备前端面试了，后续可能没有机会了精力有限+经济压力大+熟悉新业务

### 第一阶段：知识体系重建（1-2 周）

核心基础强化

JS 底层机制：重点复习闭包/原型链/事件循环（高频考点），用 CanIUse 验证 API 兼容性，补充 ES6+特性（如 Proxy、可选链）

框架原理：针对 React 重点掌握 Hooks 原理、Fiber 架构；针对 Vue3 深入理解组合式 API、响应式原理（对比 Vue2 的 Object.defineProperty 与 Proxy 差异）

工程化能力：Webpack 优化（TreeShaking/Code Splitting）、Babel 插件开发经验、CI/CD 流程设计（可结合过往项目案例）

技术广度拓展

前沿技术：了解 Turbopack/Vite 等新工具链，掌握 SSR/SSG 方案（Next.js/Nuxt.js），学习 WebAssembly 基础应用场景

性能优化体系：构建 Lighthouse 评测指标思维，准备实际案例（如首屏加载从 5s 优化到 1.2s 的具体方案）

### 项目经验重塑总结（1 周）

- 项目亮点提炼

选择 3 个复杂度递增的项目（建议包含一个主导型项目），按 STAR 法则重构描述：

准备架构图/性能对比数据等可视化素材

- 难点问题预演

针对复杂场景准备解决方案，例如：

"如何实现千万级数据量的虚拟列表？"

"SSR 降级"

"前端白屏率从 3%降到 0.5%"

### 应试能力冲刺（3 周）

> 前端手写代码弱点，再次重温，回炉重造，不知道第几次了，反正就是每次看，事后再问，习惯了

- 手写前端代码,前端手写 180+
- 每日 LeetCode 刷题（重点：字符串处理/链表/二叉树），掌握前端高频题型：Leetcode Hot 100
- 模拟面试实战

### 差异化优势打造

总结八年前端经验

## 面试中的知识点汇总

- [蒋鹏飞 前端进阶知识汇总](https://juejin.cn/post/6844904061838295047)
- [前端面经 - 看这篇就够了](https://juejin.cn/post/6948227795059212318#heading-3)
- [写给女朋友的中级前端面试秘籍](https://juejin.cn/post/6844904115428917255)
- [最新的前端大厂面经](https://juejin.cn/post/7004638318843412493#comment)
- [FE-Interview-questions](https://github.com/wantnocode/FE-Interview-questions)
