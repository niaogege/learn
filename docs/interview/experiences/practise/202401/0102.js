/**
 * 1.给定一个二维数组, 在每一组中获取最小值并求和
 * 2.学生答案对比正确答案获取得分
 * 3.回到顶部
 * 4.寄生组合继承
 * 5.字符串相加和乘
 * 6.二叉树最大路径和
 * 7.三数之和
 * 8.背包问题
 * 9.对象扁平化
 * 10.数字转36进制
 */

// 数字转36进制
function numToString(str, radio = 36) {
  if (str == 0) return '0';
  let base = '0123456789abcdefghijklmnopqrstuvxyz';
  let res = '';
  while (str > 0) {
    let flag = str % radio;
    res = base[flag] + res;
    str = Math.floor(str / radio);
  }
  return res;
}
numToString(360); // 'a0'
function flattenObj(obj, path = '', res = {}, isArray = false) {
  for (let [key, v] of Object.entries(obj)) {
    if (Array.isArray(v)) {
      let tempPath = isArray ? `${path}[${key}]` : `${path}${key}`;
      flattenObj(v, tempPath, res, true);
    } else if (v instanceof Object) {
      let tempPath = isArray ? `${path}[${key}].` : `${path}${key}.`;
      flattenObj(v, tempPath, res, false);
    } else {
      let tempPath = isArray ? `${path}[${key}]` : `${path}${key}`;
      res[tempPath] = v;
    }
  }
  return res;
}
flattenObj({
  a: {
    b: 1,
    c: 2,
  },
  d: [1, 2, 3, 4],
});
function addBig(a, b) {
  let len = Math.max(a.length, b.length);
  a = a.padStart(len, '0');
  b = b.padStart(len, '0');
  let flag = 0;
  let res = '';
  for (let i = len - 1; i >= 0; i--) {
    flag = Number(a[i]) + Number(b[i]) + flag;
    res = (flag % 10) + res;
    flag = Math.floor(flag / 10);
  }
  return flag == '1' ? '1' + res : res;
}

function mulBig(a, b) {
  let res = new Array(a.length + b.length).fill(0);
  let aLen = a.length - 1;
  let blen = b.length - 1;
  for (let i = aLen; i >= 0; i--) {
    for (let j = blen; j >= 0; j--) {
      let p1 = i + j; // [1]
      let p2 = i + j + 1;
      let sum = +a[i] * b[j] + res[p2];
      res[p2] = sum % 10;
      res[p1] = Math.floor(sum / 10) + res[p1];
    }
  }
  while (res[0] == '0') {
    res.shift();
  }
  return res.join('');
}
mulBig('16', '16');
function mockExtends(child, parent) {
  let proto = Object.create(parent.prototype);
  child.prototype.contructor = child;
  child.prototype = proto;
}

function backTop() {
  const topPos = document.documentElement.scrollTop;
  if (topPos > 0) {
    window.requestAnimationFrame(backTop);
    window.scrollTo(0, topPos - topPos / 8);
  }
}

function smooth(el) {
  if (el) {
    document.querySelector(el).scrollIntoView({
      behavior: 'smooth',
    });
  }
}

const list = [
  [1, 3, 7, 2, 9, 100, 2],
  [98, 6, 89, 3, 1, 10],
  [20, 100, 8],
];
function getMinSum(arr) {
  return arr.reduce((a, b) => {
    console.log(a, b);
    return a + Math.min(...b);
  }, 0);
}
console.log(getMinSum(list));

// 学生答案对比正确答案获取得分
/**
 * 参数1为正确答案的数组, 参数2为学生答案的数组
 * 两个数组长度相同,要求该函数返回学生的得分(正确答案+4, 错误答案-1, 空白答案+0(y以空字符串表示))
 * 如果分数<0 则返回0
 */
console.log(checkTest([1, 5, 8, 3, 2], [1, 3, 8, 3, '']));
function checkTest(an1, an2) {
  let score = 0;
  for (let i = 0; i < an1.length; i++) {
    if (an1[i] == an2[i]) {
      score += 4;
    } else if (an2[i] == '') {
    } else {
      score -= 1;
    }
  }
  return score < 0 ? 0 : score;
}
