---
title: Fiber
order: 5
group:
  title: react生态
  order: 0
---

# Fiber

React 是通过 jsx 描述界面的，会把 jsx 编译成 render function, 然后执行 render Function 生成 VDom

`JSX -> Render Function -> VDom`

V16 之前，react 会直接遍历 vdom, 通过 dom Api 增删改查 dom 的方式进行渲染，劣势就是当 vdom 过大的时候影响性能，且递归不能中断，长时间展示主线程

后来就引入了 fiber 架构，先把 vdom 树转成 fiber 链表，然后再渲染 fiber。

`JSX -> Render Function -> VDom -> Fiber`

Vdom 转 Fiber 过程称为 **reconcile**，是能中断的， schedual 机制在空闲时间执行 reconcile,reconcile 调合过程中会做 diff,打上增删改查的标记(EffectTag),并把对应的 dom 创建好，然后一次性把 fiber 渲染到真实 dom 上，也就是 commit 过程

## JSX

## 参考

- [React 是如何创建 vdom 和 fiber tree](https://mp.weixin.qq.com/s/f1AHGOosON-GHTrDO_99Gg)
