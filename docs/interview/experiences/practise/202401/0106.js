/**
 * 1.螺旋矩阵
 * 2.岛屿数量
 * 3.三数之和
 * 4.接雨水
 * 5.最长递增子序列
 * 6.最长连续递增子序列
 * 7.useRequest
 * 8.最长重复子数组(最长公共子串)
 * 9.最长公共子序列
 * 10.最大子序和
 */

/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
var longestCommonSubsequence = function (text1, text2) {
  let [m, n] = [text1.length, text2.length];
  let dp = new Array(m + 1).fill().map(() => new Array(n + 1).fill(0));
  let max = 0;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      let a = text1[i - 1];
      let b = text2[j - 1];
      if (a == b) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      }
      max = Math.max(dp[i][j], max);
    }
  }
  return max;
};

var findLength = function (nums1, nums2) {
  let max = 0;
  let [m, n] = [nums1.length, nums2.length];
  let dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    for (let j = n; j >= 0; j--) {
      let a = nums1[i - 1];
      let b = nums2[j - 1];
      if (a == b) {
        dp[j] = dp[j - 1] + 1;
      } else {
        dp[j] = 0;
      }
      max = Math.max(max, dp[j]);
    }
  }
  return max;
};

// 最长重复子数组
var findLength = function (nums1, nums2) {
  let max = 0;
  let [m, n] = [nums1.length, nums2.length];
  let dp = new Array(m + 1).fill().map(() => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      let a = nums1[i - 1];
      let b = nums2[j - 1];
      if (a == b) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      }
      max = Math.max(max, dp[i][j]);
    }
  }
  return max;
};

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findLength = function (nums1, nums2) {
  let max = 0;
  let prefix = [];
  let res = [];
  for (let i = 0; i < nums1.length; i++) {
    let item = nums1[i];
    let index = nums2.indexOf(item);
    if (index > -1) {
      let temp = nums2.slice(index);
      console.log(temp, 'temp');
      console.log(nums1.slice(i), 'nums1.slice(i)');
      prefix = resolve(temp, nums1.slice(i));
      max = Math.max(max, prefix.length);
      if (max == prefix.length) {
        res = prefix;
      }
    }
  }
  // console.log(res, 'res')
  return max;
  function resolve(a, b) {
    let len = Math.min(a.length, b.length);
    let index = 0;
    while (a[index] == b[index] && index < len) {
      index++;
    }
    return a.slice(0, index);
  }
};

var threeSum = function (nums) {};

function useRequest(url, opt) {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [abort, setAbort] = useState(() => {});
  useEffect(() => {
    let fetchData = async () => {
      try {
        let controller = new AbortController();
        setAbort(() => controller.abort());
        let signal = controller.signal;
        let res = fetch(url, {
          ...opt,
          signal,
        });
        setData(res);
      } catch (e) {
        setError(e);
      }
    };
    fetchData();
    return () => {
      abort && abort();
    };
  }, []);
  return {
    error,
    data,
    abort,
  };
}

function longester1(nums) {
  let dp = new Array(nums.length).fill(1);
  let max = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) {
      dp[i] = dp[i - 1] + 1;
    }
    max = Math.max(max, dp[i]);
  }
  return max;
}

longester1([1, 3, 5, 4, 7]);
/*
输入：nums = [1,3,5,4,7]
输出：3
解释：最长连续递增序列是 [1,3,5], 长度为3。尽管 [1,3,5,7] 也是升序的子序列, 但它不是连续的，因为 5 和 7 在原数组里被 4 隔开。
*/
function longester(nums) {
  let count = 1;
  let max = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) {
      count++;
    } else {
      count = 1;
    }
    max = Math.max(max, count);
  }
  return max;
}

/**
输入：nums = [10,9,2,5,3,7,101,18]
输出：4
解释：最长递增子序列是 [2,3,7,101]，因此长度为 4 。
 */
function longest(nums) {
  let dp = new Array(nums.length).fill(1);
  let max = 1;
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    max = Math.max(max, dp[i]);
  }
  return max;
}
longest([10, 9, 2, 5, 3, 7, 101, 18]);
