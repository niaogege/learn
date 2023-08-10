/**
 * 1.删除链表一个节点
 * 2.选择排序和插入排序
 * 3.反转链表
 * 4.链表是否有环？
 * 5.手写数字的千分位分割法
 * 6.缓存memo函数
 * 7.实现一个带缓存斐波那契数列
 * 8.封装一个类使对象可以被 for of 遍历
 * 9.手写vue版render
 * 10.手写驼峰转换
 */

function reverseNode(root) {
  var cur = root;
  var pre = null;
  while (cur) {
    var next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  return pre;
}

function thousand(str) {
  var reg = /(?!^)(?=(\d{3})+$)/g;
  return str.replace(reg, ',');
}
thousand('123456789');

function deleteNode(head, val) {
  var dummy = {
    val: 0,
    next: head,
  };
  var cur = dummy;
  while (cur && cur.next) {
    if (cur.next.val === val) {
      cur.next = cur.next.next;
      continue;
    }
    cur = cur.next;
  }
  return cur.next;
}

// 选择排序 选择最小的
// 对于从什么开始 记忆不牢固
// 将最小的元素存放在数组起始位置，再从剩下的未排序的序列中寻找最小的元素，然后将其放到已排序的序列后面
function selectSort(arr) {
  var min,
    len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    min = i;
    for (let j = i + 1; j < len; j++) {
      if (arr[min] > arr[j]) {
        min = j;
      }
    }
    let temp = arr[i];
    arr[i] = arr[min];
    arr[min] = temp;
  }
}

// 插入排序 从后往前插入
function insertSort(arr) {
  var pre,
    cur,
    len = arr.length;
  for (let i = 1; i < len; i++) {
    pre = i - 1;
    cur = arr[i];
    while (pre >= 0 && arr[pre] > cur) {
      arr[pre + 1] = arr[pre];
      pre--;
    }
    arr[pre + 1] = cur;
  }
  return arr;
}

// 是否有环
// map和快慢指针
function hasCycle(root) {
  var m = new Map();
  var cur = root;
  while (cur) {
    if (m.has(cur)) {
      return true;
    }
    m.set(cur, cur);
    cur = cur.next;
  }
  return false;
}

function render(str, data) {
  var reg = /\{\{(\w+)\}\}/;
  if (reg.test(str)) {
    var name = reg.exec(str)[1]; // RegExp.$1.trim()
    str = str.replace(reg, data[name]);
    return render(str, data);
  }
  return str;
}

function upperCase(str) {
  return str.replace(/[-|@|_]([\w])/g, (match, p) => p.toUpperCase());
}
upperCase('cpp-wmh');
