/**
 * 1.除自身以外的数组乘积
 * 2.和为k的子数组
 * 3.删除有序数组的重复项
 * 4.合并俩个有序数组
 * 5.合并区间
 * 6.无重叠区间
 * 7.螺旋矩阵
 * 8.最长的有效括号
 * 9.用栈实现队列
 * 10.用队列实现栈
 */

class MyQueue {
  constructor() {
    this.stackIn = [];
    this.stackOut = [];
  }
  push(x) {
    this.stackIn.push(x);
  }
  pop() {
    if (this.stackOut.length == 0) {
      while (this.stackIn.length) {
        this.stackOut.push(this.stackIn.pop());
      }
    }
    return this.stackOut.pop();
  }
  peak() {
    let x = this.pop();
    this.stackOut.push(x);
    return x;
  }
  isEmpty() {
    return this.stackIn.length && this.stackOut.length;
  }
}

class MyStack {
  constructor() {
    this.queue = [];
  }
  push(x) {
    this.queue.push(x);
  }
  // 先进后出
  pop() {
    let len = this.queue.length;
    while (len--) {
      this.queue.push(this.queue.shift());
    }
    return this.queue.shift();
  }
  peak() {
    let x = this.queue.pop();
    this.queue.push(x);
    return x;
  }
  isEmpty() {
    return this.queue.length == 0;
  }
}
