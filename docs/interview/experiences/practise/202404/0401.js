/**
 * 日常刷算法题，刷到300题，前150hot要铭记于心，本月目标就是刷40题就行
 * 1.快乐数
 * 2.四数之和
 * 3.乘积最大子数组
 * 4.最长递增子序列
 * 5.划分字母区间
 * 6.反转字符串里的单词
 * 7.搜索旋转排序数组
 * 8.最长重复子数组
 */

function maxMul(arr) {
  let len = arr.length;
  let dpMax = new Array(len).fill(1);
  dpMax[0] = arr[0];
  let dpMin = new Array(len).fill(1);
  dpMin[0] = arr[0];
  let max = arr[0];
  for (let i = 1; i < len; i++) {
    let cur = arr[i];
    dpMax[i] = Math.max(dpMin[i - 1] * cur, cur, dpMax[i - 1] * cur);
    dpMin[i] = Math.min(dpMin[i - 1] * cur, cur, dpMax[i - 1] * cur);
    max = Math.max(dpMax[i], max);
  }
  return max;
}

function maxMul2(arr) {
  let len = arr.length;
  let max = 1;
  let min = 1;
  let res = Number.MIN_SAFE_INTEGER;
  for (let i = 0; i < len; i++) {
    let cur = arr[i];
    if (cur < 0) {
      let tmp = max;
      max = min;
      min = tmp;
    }
    min = Math.min(min * cur, cur);
    max = Math.max(max * cur, cur);
    res = Math.max(res, max);
  }
  return res;
}

class Route {
  constructor() {
    this.routes = [];
    this.currentHash = '';
    this.freshRoute = this.freshRoute.bind(this);
    window.addEventListener('load', this.freshRoute, false);
    window.addEventListener('hashchange', this.freshRoute, false);
  }
  // 存储
  storeRoute(path, cb) {
    this.routes[path] = cb || function () {};
  }
  // 刷新
  freshRoute() {
    this.currentHash = location.hash.slice(1) || '/';
    this.routes[this.currentHash]();
  }
}

function lazyLoadImg(imgs, options) {
  let Observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const { target, intersectionRatio } = entry;
      if (intersectionRatio > 0 && target) {
        const trueUrl = target.dataset.src;
        target.src = trueUrl;
        target.onerror = function (err) {
          if (e.type == 'error') {
            target.src = options.defaultImg;
          }
        };
        Observer.unobserve(target);
      }
    });
  });
  imgs.forEach((img) => Observer.observe(img));
}
function searchSort(arr, target) {
  if (arr.length < 2) return arr[0];
  let r = arr.length - 1;
  let l = 0;
  while (l <= r) {
    let mid = l + Math.floor((r - l) / 2);
    if (arr[mid] == target) return mid;
    if (arr[mid] >= arr[l]) {
      if (target >= arr[l] && target < arr[mid]) {
        r = mid - 1;
      } else {
        l = mid + 1;
      }
    } else {
      if (target > arr[mid] && target <= arr[r]) {
        l = mid + 1;
      } else {
        r = mid - 1;
      }
    }
  }
  return -1;
}

reverseWord('the sky is blue');
function reverseWord(str) {
  let arr = str.trim().split(' ').filter(Boolean);
  let len = arr.length;
  let l = 0,
    r = len - 1;
  while (l < r) {
    let tmp = arr[r];
    arr[r] = arr[l];
    arr[l] = tmp;
    r--;
    l++;
  }
  return arr.join(' ');
}

// [-2,3,-3]
function multipleArr(arr) {
  let len = arr.length;
  let minDp = new Array(len).fill(1);
  minDp[1] = arr[0];
  let maxDp = new Array(len).fill(1);
  maxDp[1] = arr[0];
  let max = arr[0];
  for (let i = 1; i < len; i++) {
    let cur = arr[i];
    minDp[i] = Math.min(minDp[i - 1] * cur, cur, maxDp[i - 1] * cur);
    maxDp[i] = Math.max(minDp[i - 1] * cur, cur, maxDp[i - 1] * cur);
    max = Math.max(maxNum, max);
  }
  return max;
}

/**
 输入：S = "ababcbacadefegdehijhklij"
 输出：[9,7,8] 解释： 划分结果为 "ababcbaca", "defegde", "hijhklij"。 每个字母最多出现在一个片段中。 像 "ababcbacadefegde", "hijhklij" 的划分是错误的，因为划分的片段数较少。 
 */
function splitChar(str) {
  let m = new Map();
  let ans = [];
  for (let i = 0; i < str.length; i++) {
    m.set(str[i], i);
  }
  let l = 0,
    r = 0;
  for (let i = 0; i < str.length; i++) {
    let cur = str[i];
    r = Math.max(r, m.get(cur));
    if (r == i) {
      ans.push(r - l + 1);
      l = i + 1;
    }
  }
  return ans;
}
