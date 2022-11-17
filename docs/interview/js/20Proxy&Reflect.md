---
title: Proxy/Reflecy应用场景
order: 20
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## Reflect

## Proxy

Proxy 对象用于创建一个对象的代理，从而实现基本操作的**拦截和自定义（如属性查找、赋值、枚举、函数调用等）** — MDN

```js
let proxy = new Proxy(target, handler);
```

但是要注意的是，

- **handler 不能 设置为 null** ，会抛出一个错误 —— **Cannot create proxy with a non-object as target or handler！**

- Proxy 能够代理的对象仅限于 Object(Array, Map, Set, WeakMap, WeakMap 等), 所以对于 Number、String 等类型, 它就无能为力了. 比如下面这段代码就会报错:

```js
new Proxy(1, {});
// TypeError: Cannot create proxy with a non-object as target or handler
```

### 利用 Proxy 监听变量的变化

```js
var Observer1 = (obj, change) => {
  const handler = {
    get(target, property, receiver) {
      console.log(target, 'target');
      console.log(handler, 'handler', receiver);
      try {
        return new Proxy(target[property], handler);
      } catch (err) {
        console.log(err, 'err');
        return Reflect.get(target, property, receiver);
      }
      // return property in target ? target[property] : 'CPP'
    },
    set(target, key, value, receiver) {
      change(key, value);
      console.log('触发 set');
      return Reflect.set(target, key, value, receiver);
    },
  };
  return new Proxy(obj, handler);
};
var test = {
  name: 'cpp',
  nest: {
    test1: {
      name: 'test1',
    },
    test2: {
      name: 'test2',
    },
  },
  arr: [
    {
      name: 'arr',
    },
  ],
};
const watchObj = Observer1(test, (key, val) => {
  console.log(`监听到${key}变化成${val}`);
});
watchObj.name = 'wmh';
watchObj.arr.length = 5;
watchObj.arr.push('pp');

// console
监听到name变化成wmh;
监听到length变化成5;
监听到5变化成pp;
监听到length变化成6;
```

### 使用 Proxy 问题

- Proxy 只会代理对象的第一层，那么又是怎样处理这个问题的呢？
- 监测数组的时候可能触发多次 get/set，那么如何防止触发多次呢（push 操作除了增加数组的数据项之外，也会引发数组本身其他相关属性的改变）

#### 解构 proxy 会丢失响应性

```js
var test1 = {
  name: 'wmh',
};
var obj = new Proxy(test1, {
  get(target, key) {
    console.log('get', target, key);
    return target[key];
  },
});
console.log(obj.name);
```

#### Proxy 内部的 this 指向

```js

```

### 利用 Object.defineProperty 监听 js 变量变化

> Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象 -MDN

```js
Object.defineProperty(obj, prop, descriptor)
obj ：要定义属性的对象
prop ：要定义或修改的属性的名称或 **Symbol**
descriptor ：要定义或修改的属性描述符
```

```js
var Observer2 = (data, onChange) => {
  if (!data || typeof data !== 'object') {
    return;
  }
  // 取出所有属性遍历
  Object.keys(data).forEach(function(key) {
    defineReactive(data, key, data[key],onChange);
  });

  function defineReactive(data, key, val, onChange) {
    if (typeof val === 'object') {
      Observer2(val,onChange); // 监听子属性
    }
    Object.defineProperty(data, key, {
      enumerable: true, // 可枚举
      configurable: false, // 不能再define
      get: function() {
        return val;
      },
      set: function(newVal) {
        onChange(newVal);
        val = newVal;
      }
    });
  }
}
var test = {
  name: 'cpp',
  nest: {
    test1: {
      name: 'test1'
    },
    test2: {
      name: 'test2'
    }
  },
  arr: [
    {
      name: 'arr'
    }
  ]
}
Observer2(test, (key, val) => {
  console.log(`defined 监听到${key}变化成${val}`)
})
test.name = 'wmh define'
test.arr.length = 4
test.arr.push('pp')
// console
defined 监听到wmh define变化成undefined
```

缺点：

- Object.defineProperty 不能监听新增/删除的属性,Proxy 阔以
- Object.defineProperty 不能监听到数组 length 的改变以及数组新增 push 的改变

## 思考

## 参考

- [Reflect.ownKeys 与 Object.keys 的区别](https://jishuin.proginn.com/p/763bfbd64280)

- [JS 中监听对象中变量的变化](https://wangyulue.com/code/frontend/JS%E4%B8%AD%E7%9B%91%E5%90%AC%E5%AF%B9%E8%B1%A1%E4%B8%AD%E5%8F%98%E9%87%8F%E7%9A%84%E5%8F%98%E5%8C%96.html)

- [vue3](https://zhuanlan.zhihu.com/p/472866636)
