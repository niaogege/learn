/**
 * 1.myCall/myApply
 * 2.mockNew
 * 3.LRU 最近最少更新 缓存淘汰策略
 * 4.compose 组合，洋葱模型
 * 5.myBind
 * 6.curry(参数固定和不固定)
 * 7.bigIntSum 大数相加
 * 8.deepClone 深浅拷贝
 * 9.16 进制转 rgb or rgb 转 16 进制
 * 10.mockMap/mockFilter 数组方法重写
 * 11.myReduce 重写
 * 12.flatter 扁平化手写
 * 13.手写发布订阅模式
 * 14.instanceof 手写
 * 15.手写选择排序和插入排序
 * 16.手写二分法
 * 17.手写驼峰转换
 * 18.手写防抖和节流
 * 19.反转链表
 * 20.手写Promise
 * 21.手写vue版render
 * 22.手写数字的千分位分割法
 * 23.实现promisify
 * 24.封装一个类使对象可以被 for of 遍历
 * 25.删除链表一个节点
 * 26.手写async/await
 * 27.手写pipe/redux中的compose
 * 28.Promise.all/any/race/allSettled
 * 29.手写并发控制器!!!
 * 30.手写ajax
 * 31.手写jsonp
 * 33.URL参数解析
 * 34.手写去重
 * 35.useEvent
 * 36.useFetch 如何同时保持函数引用不变与访问到最新状态。
 * 37.链表是否有环？
 * 38.缓存memo函数
 * 39.手写函数重载
 * 40.二叉树前中后序遍历(迭代方式)
 * 41.冒泡排序和归并排序
 * 42.滑动窗口，无重复字符的最长子串
 * 43.实现一个带缓存斐波那契数列
 * 44.最大子序和
 * 45.实现简单的hash路由跟history路由
 * 46.二叉树的层序遍历
 * 47.二叉树前中后序遍历(递归方式)
 * 48.如何实现无限累加的一个函数
 * 49.手写NOSSR
 * 50.数组随机展示以及随机取一个数字展示
 **/

// > 定个小目标100个手写提

//29. 并发控制器

class MakeIterator {
  constructor(obj) {
    this.target = obj;
    this.len = Object.keys(obj).length;
    this.index = 0;
  }
  [Symbol.Iterator]() {
    return this;
  }
  next() {
    return this.index < this.len
      ? {
          value: this.taget[this.index++],
          done: false,
        }
      : {
          value: undefined,
          done: true,
        };
  }
}
// 注意对象的格式 类数组
var obj = {
  0: 'wmh',
  1: 'cpp',
  2: 'chendap',
  length: 3,
};
for (var item of new MakeIterator(obj)) {
  console.log(item);
}

// 6.函数柯里化curry(参数固定和不固定)
// 参数不固定curry(1,2,3)
function curry(fn) {
  var arr = [];
  return function temp(...arg) {
    if (arg.length) {
      arr.push(...arg);
      return temp;
    } else {
      var res = fn.apply(this, arr);
      arr = [];
      return res;
    }
  };
}
// 参数固定 curry(1)(2)(3)()
function curry2(fn) {
  var judge = (...rest) => {
    if (rest.length === fn.length) {
      fn.apply(this, rest);
    } else {
      return (...arg) => judge(...arg, ...rest);
    }
  };
  return judge;
}

// 48 如何实现无限累加的一个函数
function sum(...rest) {
  var f = (...arg) => sum(...arg, ...rest);
  f.valueOf = () => rest.reduce((a, b) => a + b, 0);
  return f;
}

sum(1, 2, 3).valueOf(); //6
sum(2, 3)(2).valueOf(); //7
sum(1)(2)(3)(4).valueOf(); //10
sum(2)(4, 1)(2).valueOf(); //9
sum(1)(2)(3)(4)(5)(6).valueOf(); // 21

// 49.手写NOSSR
import { useEffect, useState } from 'react';

function NoSSR(props) {
  const { children } = props;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  } else {
    return <div>{children}</div>;
  }
}

// 50.随机展示 以及随机取一个数字展示
function randomArr(arr) {
  return arr.sort(() => 0.5 - Math.random());
}
randomArr(['哈哈', '嘟嘟', '嘎嘎', 'wqreqw', '戈戈', '戈戈22', 'ccc', '卧槽', '武侠', '女生']);

function randomArrOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
randomArrOne(['哈哈', '嘟嘟', '嘎嘎', 'wqreqw', '戈戈', '戈戈22', 'ccc', '卧槽', '武侠', '女生']);
