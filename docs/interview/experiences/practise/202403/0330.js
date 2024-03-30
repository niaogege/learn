/**
 * never give up
 * 1.字母异位分组
 * 2.字符串转换整数
 * 3.最小栈
 * 4.从前序和中序构造二叉树
 * 5.翻转字符串里的单词
 * 6.N叉树的层序遍历
 * 7.单词搜索
 * 8.vue render
 * 9.划分字母区间
 * 10.最长重复子数组
 */

Array.prototype.mockFlatMap = function (fn, context) {
  let arr = this || [];
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    let data = fn.apply(context, [arr[i], i, arr]);
    if (Array.isArray(data)) {
      res.push(...data.mockFlatMap((x) => x));
    } else {
      res.push(data);
    }
  }
};

function render(str, data) {
  let reg = /\{\{(\w+)\}\}/;
  if (reg.test(str)) {
    let key = reg.exec(str)[1];
    str = str.replace(reg, data[key]);
    return render(str, data);
  }
  return str;
}
function render(str, data) {
  let reg = /\{\{(\w+)\}\}/;
  if (reg.test(str)) {
    let key = reg.exec(str)[1];
    str = str.replace(reg, data[key]);
    return render(str, data);
  }
  return str;
}
render('{{msg}}::{{name}}', {
  msg: 'info',
  name: 'cpp',
});

/**
  * 
输入: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
输出: [["bat"],["nat","tan"],["ate","eat","tea"]]
  */
function output(arr) {
  let m = new Map();
  for (let item of arr) {
    let cur = item.split('').sort().join('');
    if (m.has(cur)) {
      let arr = m.get(cur);
      arr.push(item);
      m.set(cur, arr);
    } else {
      m.set(cur, [item]);
    }
  }
  return Array.from(m.values());
}
output(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']);
// 最远距离+双指针
//      012345678
// S = "ababcbacadefegde"
// 输出：[9,7,8] 解释： 划分结果为 "ababcbaca", "defegde",。
function splitChartBw(str) {
  let m = new Map();
  let len = str.length;
  let ans = [];
  for (let i = 0; i < len; i++) {
    m.set(str[i], i);
  }
  let l = 0,
    r = 0;
  for (let i = 0; i < len; i++) {
    r = Math.max(r, m.get(str[i]));
    if (r === i) {
      ans.push(r - l + 1);
      l = r;
    }
  }
  return ans;
}
splitChartBw('ababcbacadefegde');
