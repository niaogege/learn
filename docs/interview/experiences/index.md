---
title: 积少成多 面试经验
group:
  order: 0
  title: interview
nav:
  order: 3
  title: 'interview'
  path: /interview
---

> 20221229 开始积累面试经验！好久不背面试题，都快忘记了，记忆力真差

> 20230105 感觉在面试方面没有自信心了，更多的是忧虑/恐慌/无助

- 面试官：你确定多窗口之间 sessionStorage 不能共享状态吗？？？

sessionStorage 属性允许你访问一个，对应当前源的 session `Storage`[1] 对象。它与 `localStorage`[2] 相似，不同之处在于 localStorage 里面存储的数据没有过期时间设置，而存储在 sessionStorage 里面的数据在页面会话结束时会被清除。

- 页面会话在浏览器打开期间一直保持，并且重新加载或恢复页面仍会保持原来的页面会话。
- 在**新标签或窗口**打开一个页面时会复制**顶级浏览会话的上下文作为新会话的上下文**， 这点和 session cookies 的运行方式不同。
- 打开多个相同的 URL 的 Tabs 页面，会创建各自的 sessionStorage。
- 关闭对应浏览器标签或窗口，会清除对应的 sessionStorage。

对面试官：多窗口之间 sessionStorage 不可以共享状态！！！但是在某些特定场景下新开的页面会复制之前页面的 sessionStorage！！也就是在**新标签或窗口**打开一个页面时会复制**顶级浏览会话的上下文作为新会话的上下文**
