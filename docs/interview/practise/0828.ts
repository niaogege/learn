/**
 * 1.二叉树的最大深度和最小深度
 * 2.TS手写Unique 去重
 * 3.class
 * 4.手写Object.create()的实现
 * 5.手写虚拟DOM
 * 6.手写并发控制
 * 7.怎么实现一个sleep
 * 8.联合转交叉
 * 9.滚动到底部懒加载数据Hooks实现
 * 10.冒泡排序和归并排序
 */

function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        var temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}
bubbleSort([1, 22, 3, 1111, 3, 2, 9]);
async function asyncPoop(arr, limit, fn) {}

// 递归需要确定终止条件
function MaxDepth(root) {
  if (!root) return 0;
  var leftDepth = root.left && MaxDepth(root.left); // 左
  var rightDepth = root.right && MaxDepth(root.right); // 右
  var depth = 1 + Math.max(leftDepth, rightDepth); // 根
  return depth;
}

function MaxDepth2(root) {
  if (!root) return 0;
  var queue = [root];
  var depth = 0;
  while (queue.length) {
    depth++;
    for (let i = 0; i < queue.length; i++) {
      var cur = queue.shift();
      if (cur.left) {
        queue.push(cur.left);
      }
      if (cur.right) {
        queue.push(cur.right);
      }
    }
  }
  return depth;
}

type isEqual<A, B = A> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
  ? true
  : false;

type Has<T, O> = T extends [infer F, ...infer R]
  ? isEqual<O, F> extends true
    ? true
    : Has<R, O>
  : false;

type TT1 = Has<[1, 2, 3], 1>;

type Unique1<T, Arr extends unknown[] = []> = T extends [infer F, ...infer R]
  ? Has<Arr, F> extends true
    ? Unique1<R, Arr>
    : Unique1<R, [F, ...Arr]>
  : Arr;

type TTT2 = Unique1<[1, 2, 3, 4, 2]>;

const vnode = {
  tag: 'div',
  props: {
    id: 'app',
  },
  children: [],
};
function render(vNode, parent) {
  var mount = parent ? (el) => parent.appendChild(el) : (el) => el;
  if (typeof vNode === 'string') {
    return mount(document.createTextNode(vNode.tag));
  } else if (typeof vNode === 'object') {
    var dom = mount(document.createElement(vNode.tag));
    // 遍历子节点
    for (let child of vNode.children) {
      render(child, dom);
    }
    // 设置属性值
    for (let props in vNode.props) {
      dom.setAttribute(props, vNode.props[props]);
    }
    return dom;
  }
}
render(vnode, document.getElementById('app'));

function myCreate(obj) {
  function P() {}
  P.prototype = obj;
  return new P();
}

function sleep(delay) {
  var timer = new Date().getTime();
  while (new Date().getTime() - timer < delay) {
    continue;
  }
}

function sleep2(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay);
  });
}

(async function () {
  console.log('Do some thing, ' + new Date());
  await sleep2(3000);
  console.log('Do other things, ' + new Date());
})();
