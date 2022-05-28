---
title: stack相关的积累
order: 6
group:
  order: 3
  title: 算法
  path: /interview/logic
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## 有效的括号

```js
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  if (!s.length || s.length % 2 != 0) return false;
  var m = new Map([
    [']', '['],
    [')', '('],
    ['}', '{'],
  ]);
  var stack = [];
  for (let i = 0; i < s.length; i++) {
    var cur = s[i];
    if (m.has(cur)) {
      var reverse = m.get(cur);
      var ding = stack.slice().pop();
      if (ding === reverse) {
        stack.pop();
      } else {
        stack.push(cur);
      }
    } else {
      stack.push(cur);
    }
  }
  return stack.length === 0;
};
```
