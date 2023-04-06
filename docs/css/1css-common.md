---
title: css common
order: 1
group:
  order: 0
  title: css
  path: /interview/css
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## 元素水平和垂直居中

- The first demo

```html
<div className="child-demo">
  <div className="childs">CHILD</div>
</div>
```

```css
.child-demo {
  position: relative;
  width: 400px;
  height: 300px;
  margin: 0 auto;
  .childs {
    position: absolute;
    width: 100px;
    height: 100px;
    background-color: yellow;
    background-color: yellow;
    inset: 0;
    margin-inline: auto; // 水平方向的居中
    margin-block: auto; // 垂直方式的居中
  }
}
```

## 鼠标移进目标元素过度效果

```html
<div className="child2">
  <div className="child2s">CHILD</div>
</div>
```

```css
.child2 {
  position: relative;
  width: 400px;
  height: 300px;
  margin: 0 auto;
  .child2s {
    position: absolute;
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    background-color: lightblue;
    border: 0 solid transparent; 效果
    box-sizin
    transition: border 1s linear;
    inset: 0;
    margin-inline: auto;
    margin-block: auto;
    &:hover {
      border: 4px solid red;
    }
  }
}
```

## 参考

- [CSS 简写中的坑，看你还敢不敢这么写](https://mp.weixin.qq.com/s/7X5urVtW-0bkhr90Apm0ug)
