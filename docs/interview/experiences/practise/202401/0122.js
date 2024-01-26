/**
 * 5.和为 K 的子数组
 * 6.滑动窗口最大值
 * 7.除自身以外数组的乘积
 */

var sub1 = function (nums, k) {
  let count = 0;
  for (let end = 0; end < nums.length; end++) {
    let sum = 0;
    for (let start = end; start >= 0; start--) {
      sum += nums[start];
      if (sum == k) {
        count++;
      } else {
        count = 0;
      }
    }
  }
  return count;
};

var subarraySum = function (nums, k) {
  let m = { 0: 1 };
  let count = 0;
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    if (m[sum - k]) {
      count += m[sum - k];
    }
    if (m[sum]) {
      m[sum]++;
    } else {
      m[sum] = 1;
    }
  }
  return count;
};

var subArraySum = function (nums, k) {
  let sum = 0,
    count = 0;
  let m = new Map([0, 1]);
  for (let num of nums) {
    sum += num;
    if (m.has(sum - k)) {
      count += m.get(sum - k);
    }
    if (m.has(sum)) {
      m.set(sum, m.get(sum) + 1);
    } else {
      m.set(sum, 1);
    }
  }
};
// [(1, 2, 3, 4)];
function mul(arr) {
  // I左边的相乘 在乘以I右边的
  let right = 1;
  let len = arr.length;
  let res = [1];

  for (let i = 1; i < len; i++) {
    res[i] = res[i - 1] * arr[i - 1];
  }
  for (let j = len - 1; j >= 0; j--) {
    res[j] *= right;
    right *= arr[j];
  }
  return res;
}
// [24, 12, 8, 6]
mul([1, 2, 3, 4]);
