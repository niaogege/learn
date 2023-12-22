/**
 * 1.重排链表
 * 2.两个字符串对比, 得出结论都做了什么操作, 比如插入或者删除
 * 3.背包问题
 * 4.多个数组合并/交集/并集（最优解）
 * 5.比较版本号
 */

function removeDep(arr) {}
removeDep([1, 1, 2, 3]);

/**
 * 多个数组交集 [[3,1,2,4,5],[1,2,3,4],[3,4,5,6]]
 */
// 横向扫描
function intersect2(nums) {
  if (!nums.length) return [];
  let prefix = nums[0];
  for (let i = 1; i < nums.length; i++) {
    prefix = findT(prefix, nums[i]);
    if (prefix.length == 0) break;
  }
  return prefix;
}
function findT(a, b) {
  let ans = [];
  for (let item of a) {
    let index = b.indexOf(item);
    if (index > -1) {
      ans.push(item);
      b.splice(index, 1);
    }
  }
  return ans;
}
intersect2([
  [3, 1, 2, 4, 5],
  [1, 2, 3, 4],
  [3, 4, 5, 6],
]);

// hash
function intersect3(nums) {
  let m = new Map();
  let ans = [];
  for (let item of nums) {
    for (let i of item) {
      if (!m.has(i)) {
        m.set(i, 0);
      }
      let count = m.get(i);
      m.set(i, count + 1);
    }
  }
  for (let [key, value] of m.entries()) {
    if (value == nums.length) {
      ans.push(key);
    }
  }
  return ans;
}
intersect3([
  [3, 1, 2, 4, 5],
  [1, 2, 3, 4],
  [3, 4, 5, 6],
]);
var intersect1 = function (nums1, nums2) {
  let ans = [];
  for (let item of nums1) {
    let index = nums2.indexOf(item);
    if (index != -1) {
      ans.push(item);
      // nums2[index] = false;
      nums2.splice(index, 1);
    }
  }
  return ans;
};
intersect1([2, 2], [1, 2]);

// 双指针
var intersect = function (nums1, nums2) {
  nums1.sort((a, b) => a - b);
  nums2.sort((a, b) => a - b);
  let l = 0,
    r = 0,
    res = [];
  while (l < nums1.length && r < nums1.length) {
    if (nums1[l] == nums2[r]) {
      res.push(nums1[l]);
      l++;
      r++;
    } else {
      if (nums1[l] < nums2[r]) {
        l++;
      } else {
        r++;
      }
    }
  }
  return res;
};

// 两个数组交集
var intersection = function (nums1, nums2) {
  let a = [...new Set(nums1)];
  let b = [...new Set(nums2)];
  let arr = [];
  for (let i of a) {
    if (b.includes(i)) {
      arr.push(i);
    }
  }
  return arr;
};

// 双指针
function reorderLink(root) {
  if (!root) return;
  let cur = root;
  let map = [];
  while (cur) {
    map.push(cur);
    cur = cur.next;
  }
  let i = 0;
  let j = map.length - 1;
  while (i < j) {
    map[i].next = map[j];
    i++;
    if (i === j) {
      break;
    }
    map[j].next = map[i];
    j--;
  }
  map[j].next = null;
}
