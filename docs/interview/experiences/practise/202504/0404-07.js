// 一天10 三天30个手写题目
/**
 * 1.金额大写
 * 2.Map结构
 * 3.compisition Pipe
 * 4.实现 Immutability helper
 * 5.deepClone
 * 6.利用栈(Stack)创建队列(Queue)
 */

/* you can use this Class which is bundled together with your code

class Stack {
  push(element) { // add element to stack }
  peek() { // get the top element }
  pop() { // remove the top element}
  size() { // count of element }
}
*/

/* Array is disabled in your code */

// you need to complete the following Class
class Queue {
  enqueue(element) {
    // add new element to the rare
  }
  peek() {
    // get the head element
  }
  size() {
    // return count of element
  }
  dequeue() {
    // remove the head element
  }
}

function dedepClone(obj) {
  if (typeof obj !== Object || obj == null) return obj;
  let val = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      val[key] = typeof obj[key] == 'object' ? dedepClone(obj[key]) : obj[key];
    }
  }
  return val;
}

function memo(fn, resolver = (...arg) => arg.join('_')) {
  let cache = new Map();
  return function (...arg) {
    let key = resolver(arg);
    if (cache.has(key)) {
      return cache.get(key);
    }
    let val = fn.apply(this, arg);
    cache.set(key, val);
    return val;
  };
}

function pipe(func) {
  if (!func.length) {
    return (arg) => arg;
  }
  if (func.length === 1) return func[0];
  return (arg) =>
    func.reduce((pre, cur) => {
      return cur(pre);
    }, arg);
}

class MockMap {
  constructor() {
    this.cache = {};
  }
  get(node) {
    return this.cache[node.__nodeKey];
  }
  set(node, val) {
    node.__nodeKey = Symbol();
    this.cache[node.__nodeKey] = val;
  }
  has(node) {
    return !!this.cache[node.__nodeKey];
  }
}
