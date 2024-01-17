/**
 * 1.对象扁平化
 * 2.字符串转换
 * 3.用栈实现队列
 * 4.反转链表
 * 5.不同的子序列
 * 6.编辑距离
 * 7.
 */
// 两个字符串的删除操作

/** 
字符串的一个 子序列 是指，通过删除一些（也可以不删除）字符且不干扰剩余字符相对位置所组成的新字符串。（例如，"ACE" 是 "ABCDE" 的一个子序列，而 "AEC" 不是）
*/
function diffChild(s, t) {
  let [m, n] = [s.length, t.length];
  let dp = new Array(m + 1).fill().map(() => new Array(n + 1).fill(0));
  // s中有1个空字符串
  for (let i = 0; i < m; i++) {
    dp[i][0] = 1;
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s[i - 1] == t[i - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
      } else {
        dp[i][j] = dp[i - 1][j];
      }
    }
  }
  return dp[m][n];
}
// 宇宙的尽头就是不断重复重复，我看你是否记得住
