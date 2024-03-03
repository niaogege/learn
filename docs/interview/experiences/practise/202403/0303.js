/**
 * 1.requestIdleCallback
 * 2.mockClass
 * 3.合并俩个有序数组
 * 4.最长重复子数组
 * 5.最长公共子序列
 */
// 合并俩个有序数组
var merge = function (nums1, m, nums2, n) {
  for (let i = m; i < m + n; i++) {
    nums[i] = nums2[i - m];
  }
  return nums1.sort((a, b) => a - b);
};
// 同名函数定义多次
function heavyLoad(target, name, fn) {
  let old = target[name];
  target[name] = function (...rest) {
    if (fn.length === rest.length) {
      fn.apply(this, rest);
    } else {
      old.apply(this, rest);
    }
  };
}

var test = { name: 'cpp' };
heavyLoad(test, 'show', () => {
  console.log('show one');
});
heavyLoad(test, 'show', (a, b) => {
  console.log('show two', a, b);
});
test.show();
test.show('wmh', 'cpp');
