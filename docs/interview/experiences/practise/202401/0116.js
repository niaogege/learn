/**
 * 1.回文子串
 * 2.最长回文子串
 * 3.零钱兑换II
 * 4.数字转36进制
 * 5.对象和数组扁平化
 * 6.字符串相加
 * 7.字符串转换
 */

// get-element-by-id' -> 'getElementById

function transformStr(str) {
  return str.replace(/[_|-|@]([\w+])/g, (_, p) => p.toLocalUppercase());
}
transformStr('get-element-by-id');

function flattenArr(arr) {
  let stack = [...arr];
  let res = [];
  while (stack.length) {
    let last = stack.pop();
    if (Array.isArray(last)) {
      stack.push(...last);
    } else {
      res.push(last);
    }
  }
  return res.reverse();
}
flattenArr([1, 2, 3, [4, 5, 6]]);

// 第三次写了
function flattenObj(res, tmp = {}, paths = '', isArray = false) {
  for (let [key, val] of Object.entries(res)) {
    if (Array.isArray(val)) {
      let path = isArray ? `${paths}[${key}]` : `${paths}${key}`;
      flattenObj(val, tmp, path, true);
    } else if (typeof val == 'object') {
      let path = isArray ? `${paths}[${key}].` : `${paths}${key}.`;
      flattenObj(val, tmp, path, false);
    } else {
      let path = isArray ? `${paths}[${key}]` : `${paths}${key}`;
      tmp[path] = val;
    }
  }
  return tmp;
}
flattenObj({
  a: {
    b: 1,
    c: [2, 3],
  },
});

function add(a, b) {
  let len = Math.max(a.length, b.length);
  a = a.padStart(len, '0');
  b = b.padStart(len, '0');
  let i = len - 1;
  let flag = 0;
  let res = '';
  while (i >= 0) {
    flag = Number(a[i]) + Number(b[i]) + flag;
    res = (flag % 10) + res;
    flag = Math.floor(flag / 10);
    i--;
  }
  if (flag == 1) {
    res = '1' + res;
  }
  return res;
}
add('12', '13');
// 数字转36进制
function numTo36(nums) {
  if (nums == 0) return '0';
  let radix = '0123456789abcdefghijklmnopqrstuvxyz';
  let res = '';
  while (nums > 0) {
    let flag = nums % 36;
    res = radix[flag] + res;
    nums = Math.floor(nums / 36);
  }
  return res;
}
numTo36(360);
/**
 * 输入: amount = 5, coins = [1, 2, 5]
输出: 4
 */
function coinChange2(amount, coins) {
  let dp = new Array(amount + 1).fill(0);
  dp[0] = 1;
  for (let coin of coins) {
    for (let j = coin; j <= amount; j++) {
      dp[j] += dp[j - coin];
    }
  }
  return dp[amount];
}
coinChange2(5, [1, 2, 5]);
coinChange2(3, [2]);
