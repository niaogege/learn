/**
 * 1.最小栈
 * 2.最大子序和/最大乘积子数组
 * 3.字符串转换整数
 * 4.判断子序列
 * 5.跳跃游戏II
 * 6.单词搜索
 * 7.字符串解码
 * 8.每日温度
 * 9.快乐数
 */

function maxChildSum(arr) {
  let len = arr.length;
  let dp = new Array(len).fill(0);
  let max = arr[0];
  dp[0] = arr[0];
  for (let i = 1; i < len; i++) {
    if (dp[i - 1] > 0) {
      dp[i] = dp[i - 1] + arr[i];
    } else {
      dp[i] = arr[i];
    }
    max = Math.max(max, dp[i]);
  }
  return max;
}
maxChildSum([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
function maxChildMul(arr) {
  let max = 1;
  let min = 1;
  let sum = 1;
  for (let i = 0; i < arr.length; i++) {
    let cur = arr[i];
    if (cur < 0) {
      let tmp = max;
      max = min;
      min = tmp;
    }
    max = Math.max(max * cur, cur);
    min = Math.min(min * cur, cur);
    sum = Math.max(max, sum);
  }
  return sum;
}
maxChildMul([2, 3, -2, 4]);

function toNum(n) {
  let num = parseInt(n);
  let min = Math.pow(-2, 32);
  let max = Math.pow(2, 32) - 1;
  if (isNaN(num)) {
    return 0;
  } else if (num < min || num > max) {
    return num < min ? min : max;
  } else {
    return num;
  }
}

function isHappy(num) {
  let slow = num;
  let fast = num;
  while (fast != 1) {
    slow = getSum(slow);
    fast = getSum(fast);
    fast = getSum(fast);
    if (slow == fast) return false;
  }
  return true;
}
function getSum(n) {
  let sum = 0;
  while (n > 0) {
    sum += Math.pow(n % 10, 2);
    n = Math.floor(n / 10);
  }
  return sum;
}
isHappy(19);
function to36(num, radix = 36) {
  num = +num;
  let units = '0123456789abcdefghijklmnopqrstuvwxyz';
  let res = '';
  while (num > 0) {
    let flag = num % radix;
    res = units[flag] + res;
    num = Math.floor(num / radix);
  }
  return res;
}
to36(360);
