/**
 * 每天抽半小时时间复习2道题+默写前面三道题
 * 1.不同的子序列
 * 2.计算质数的个数
 * 3.字符串转换整数
 */

/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isSubsequence = function (s, t) {
  if (s.length == 0) return true;
  let [m, n] = [t.length, s.length];
  let j = 0;
  for (let i = 0; i < m; i++) {
    let cur = m[i];
    if (cur == s[j++]) {
      if (j == n) {
        return true;
      }
    }
  }
  return false;
};

var isSubsequence = function (s, t) {
  let [m, n] = [t.length, s.length];
  let dp = new Array(m + 1).fill().map(() => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (t[i - 1] == s[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = dp[i - 1][j];
      }
    }
  }
  return dp[m][n] == n;
};

function strToNum(str) {
  let num = parseInt(str);
  let max = Math.pow(2, 32) - 1;
  let min = Math.pow(-2, 32);
  if (isNaN(num)) {
    return 0;
  } else if (num > max || num < min) {
    return num > max ? max : min;
  } else {
    return num;
  }
}

function countPrime(n) {
  if (n < 2) return 0;
  let count = 0;
  for (let i = 2; i <= n; i++) {
    if (isPrime(i)) {
      count++;
    }
  }
  return count;
}
function isPrime(n) {
  for (let i = 1; i * i <= n; i++) {
    if (n % i == 0) return false;
  }
}

function countPrime(n) {
  let count = 0;
  let dp = new Array(n).fill(true);
  for (let i = 2; i * i < n; i++) {
    if (dp[i]) {
      for (let j = i * i; j < n; j += i) {
        dp[j] = false;
      }
    }
  }

  for (let i = 2; i < n; i++) {
    if (dp[i]) {
      count++;
    }
  }
  return count;
}
