/*
 * 1.treeToArr
 * 2.thousand
 * 3.手机号脱敏
 * 4.数组中的第K个最大元素
 * 5. K 个一组翻转链表
 * 6.三数之和
 * 7.最大子序和
 * 8.合并两个有序链表
 * 9.两数之和
 * 10.密码校验，要求包含大小写字母，数字，长度为6，至少满足三个条件
 * 11.异步串行
 */

function asyncSeries(...fns) {
  var [first, ...others] = fns;
  return (...arg) => {
    return others.reduce((pre, cur) => {
      return pre.then((val) => cur(val));
    }, first(...arg));
  };
}

function thousand(str) {
  return str.replace(/(?!^)(?=(\d{3})+$)/g, ',');
}
thousand('123456789');

function hiddenPhone(str) {
  return str.replace(/(?=\d{3})(\d{4})(\d{4})/i, '$1****$2');
}
hiddenPhone('18799998888');
var listTree = [
  {
    id: 1,
    name: '部门1',
    pid: 0,
    children: [
      {
        id: 2,
        name: '部门1-1',
        pid: 1,
        children: [
          {
            id: 4,
            name: '部门1-1-1',
            pid: 2,
            children: [],
          },
        ],
      },
      {
        id: 3,
        name: '部门1-2',
        pid: 1,
        children: [
          {
            id: 5,
            name: '部门1-2-1',
            pid: 3,
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 6,
    name: '部门2',
    pid: 0,
    children: [
      {
        id: 7,
        name: '部门2-1',
        pid: 6,
        children: [],
      },
    ],
  },
  {
    id: 8,
    name: '部门3',
    pid: 0,
    children: [],
  },
];

// dfs
function treeToArr1(tree) {
  var res = [];
  var dfs = (arr, res) => {
    for (let item of arr) {
      if (item.children) {
        dfs(item.children, res);
        delete item.children;
      }
      res.push(item);
    }
  };
  dfs(tree, res);
  return res;
}
treeToArr1(listTree);

function treeToArr2(tree, res = []) {
  var stack = [];
  stack = stack.concat(tree);
  while (stack.length) {
    var child = stack.shift();
    if (child.children) {
      stack = stack.concat(child.children);
      delete child.children;
    }
    res.push(child);
  }
  return res;
}
treeToArr2(listTree);

var inputArray = [
  { id: 1, parentId: null, name: 'Node 1' },
  { id: 2, parentId: 1, name: 'Node 1.1' },
  { id: 3, parentId: 1, name: 'Node 1.2' },
  { id: 4, parentId: 2, name: 'Node 1.1.1' },
  { id: 5, parentId: null, name: 'Node 2' },
  { id: 6, parentId: 5, name: 'Node 2.1' },
];

// dfs
function arrToTree1(arr) {
  var res = [];
  var dfs = (arr, res, parentId) => {
    for (let item of arr) {
      if (item.parentId === parentId) {
        var newChild = {
          ...item,
          children: [],
        };
        res.push(newChild);
        dfs(arr, newChild.children, item.id);
      }
    }
  };
  dfs(arr, res, null);
  return res;
}
arrToTree1(inputArray);

// 输入：nums = [-1,0,1,2,-1,-4]
// 输出：[[-1,-1,2],[-1,0,1]]
// 解释：
// nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0 。
// nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0 。
// nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0 。
// 不同的三元组是 [-1,0,1] 和 [-1,-1,2] 。
// 注意，输出的顺序和三元组的顺序并不重要。
/**
 * 给你一个整数数组 nums ，判断是否存在三元组 [nums[i], nums[j], nums[k]] 满足 i != j、i != k 且 j != k ，同时还满足 nums[i] + nums[j] + nums[k] == 0 。请
你返回所有和为 0 且不重复的三元组。
注意：答案中不可以包含重复的三元组。
 */
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {};

/**
 * 1.给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。
  你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。
  你可以按任意顺序返回答案。
  输入：nums = [2,7,11,15], target = 9
  输出：[0,1]
  解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  for (let i = 0; i < nums.length; i++) {
    var cur = nums[i];
    var other = target - cur;
    if (nums.indexOf(other) > -1) {
      return [i, nums.indexOf(other)];
    }
  }
};
twoSum([2, 7, 11, 15], 9);
