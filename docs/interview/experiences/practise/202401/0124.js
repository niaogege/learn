/**
 * 1.分发饼干
 */

/**
输入: g = [1,2,3], s = [1,1]
输出: 1
 */
var findContentChildren = function (g, s) {
  let count = 0,
    index = s.length;
  let len = g.length;
  for (let i = len - 1; i >= 0; i--) {
    if (index >= 0 && g[i] <= s[i]) {
      count++;
      index--;
    }
  }
  return count;
};
