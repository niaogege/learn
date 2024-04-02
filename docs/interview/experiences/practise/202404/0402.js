/**
 * 1.利用正则筛选只包含大小写字母的字符串
 * 2.Object.assign(target, ...source)
 * 3.两个数组的交集
 * 4.字符串转换整数
 * 5.字符串压缩
 * 6.单词搜索
 * 7.版本号进行排序
 * 8.每日温度
 * 9.最长连续重复子串
 * 10.零钱兑换II
 */

function myAssign(target, ...source) {
  if (typeof target != 'object') {
    throw new TypeError('error');
  }
  source.forEach((item) => {
    if (Object.keys(item).length) {
      for (let key in item) {
        if (item.hasOwnProperty(key)) {
          target[key] = item[key];
        }
      }
    }
  });
  return target;
}
Object.assign = myAssign;

// ['Abc', 'DeF', '123', '_ghI'];
function dataF(arr) {
  return arr.filter((item) => /^[a-zA-Z]+$/.test(item)).map((item) => item.toUpperCase());
}
dataF(['Abc', 'DeF', '123', '_ghI']);
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function (nums1, nums2) {
  let a = [...new Set(nums1)];
  let b = [...new Set(nums2)];
  let m = new Map();
  let ans = [];
  for (let a1 of a) {
    m.set(a1, 1);
  }
  for (let b1 of b) {
    if (m.has(b1)) {
      ans.push(b1);
    }
  }
  return ans;
};
