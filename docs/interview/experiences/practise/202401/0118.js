/**
 * 1.接雨水
 * 2.用栈实现队列
 * 3.编辑距离
 * 4.36进制数据转换
 * 5.回文子串的个数
 */

var countSubstrings = function (s) {
  if (s.length == 0) return 0;
  let len = s.length;
  let dp = new Array(len).fill().map(() => new Array(len).fill(false));
  let count = 0;
  for (let i = len - 1; i >= 0; i--) {
    for (let j = i; j < len; j++) {
      if (s[i] == s[j]) {
        if (j - i <= 1) {
          count = count + 1;
          dp[i][j] = true;
        } else if (dp[i + 1][j - 1]) {
          count = count + 1;
          dp[i][j] = true;
        }
      }
    }
  }
  return count;
};

function multiply(a, b) {
  let [m, n] = [a.length, b.length];
  let res = new Array(m + n).fill(0);
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      let pos = i + j;
      let pos1 = pos + 1;
      let sum = Number(a[i]) * Number(b[j]) + res[pos1];
      res[pos1] = sum % 10;
      res[pos] = Math.floor(sum / 10) + res[pos];
    }
  }
  while (res[0] == 0) {
    res.shift();
  }
  return res.length == 0 ? '0' : res.join('');
}
multiply('455', '789');

function to36(num, radix = 36) {
  if (num == 0) return '';
  let base = '0123456789abcdefghijklmnopqrstuvwxyz';
  let res = '';
  while (num > 0) {
    let flag = num % radix;
    res = base[flag] + res;
    num = Math.floor(num / radix);
  }
  return res;
}
to36(360); // a0

/** 
push(x) -- 将一个元素放入队列的尾部。
pop() -- 从队列首部移除元素。
peek() -- 返回队列首部的元素。
empty() -- 返回队列是否为空。
*/

var MyQueue = function () {
  this.stackIn = [];
  this.stackOut = [];
};

/**
 * @param {number} x
 * @return {void}
 */
MyQueue.prototype.push = function (x) {
  this.stackIn.push(x);
};

/**
 * @return {number}
 */
MyQueue.prototype.pop = function () {
  const size = this.stackOut.length;
  if (size) {
    return this.stackOut.pop();
  }
  while (this.stackIn.length) {
    this.stackOut.push(this.stackIn.pop());
  }
  return this.stackOut.pop();
};

/**
 * @return {number}
 */
MyQueue.prototype.peek = function () {
  const x = this.pop();
  this.stackOut.push(x);
  return x;
};

/**
 * @return {boolean}
 */
MyQueue.prototype.empty = function () {
  return this.stackIn.length == 0 && this.stackOut.length == 0;
};

/**
 * Your MyQueue object will be instantiated and called as such:
 * var obj = new MyQueue()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.peek()
 * var param_4 = obj.empty()
 */

function editPaths(word1, word2) {
  let [m, n] = [word1.length, word2.length];
  let dp = new Array(m + 1).fill().map(() => new Array(n + 1).fill(0));
  // 首行 i
  for (let i = 1; i <= m; i++) {
    dp[i][0] = i;
  }
  // 首列j
  for (let j = 1; j <= n; j++) {
    dp[0][j] = j;
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] == word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        // 增加和删除
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j], dp[i - 1][j - 1]) + 1;
      }
    }
  }
  return dp[m][n];
}
