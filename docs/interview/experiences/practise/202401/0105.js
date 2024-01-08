/**
 * 1.三数之和
 * 2.二叉树最大路径之和
 * 3.校验邮箱
 * 4.分发糖果
 * 5.股票最大价值
 * 6.实现useRequest的hook函数
 * 7.查找字符串中连续重复最多字符的函数
 * 8.无重复字符的最长子串
 * 9.最长递增子序列
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function (nums) {
  var dp = new Array(nums.length).fill(1);
  let ans = 1;
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        // 以nums[i]为结尾的最长递增子序列可以由nums[0]为结尾的最长递增子序列长度、nums[1]为结尾的最长长度、……nums[i-1]为结尾的最长长度比较得到
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
      ans = Math.max(ans, dp[i]);
    }
  }
  return ans;
};
function selectSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[min] > arr[j]) {
        min = j;
      }
    }
    swap(arr, min, i);
  }
  return arr;
}

function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

selectSort([11, 22, 333, 4, 5, 666]);
function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (j > 0 && arr[j - 1] > arr[j]) {
      swap(arr, j, j - 1);
      j--;
    }
  }
  return arr;
}
insertSort([11, 22, 333, 4, 5, 666]);
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - i; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
      }
    }
  }
  return arr;
}

bubbleSort([11, 22, 333, 4, 5, 666]);

var maxProfit4 = function (k, prices) {
  if (prices == null || prices.length < 2 || k == 0) {
    return 0;
  }
  let timer = 1 + 2 * k;
  var dp = new Array(prices.length).fill().map(() => new Array(timer).fill(0));
  // 初始化奇数-prices[0]
  for (let i = 1; i < 2 * k; i += 2) {
    dp[0][i] = -prices[0];
  }
  for (let i = 1; i < prices.length; i++) {
    for (let j = 0; j < 2 * k; j += 2) {
      dp[i][j + 1] = Math.max(dp[i - 1][j + 1], dp[i - 1][j] - prices[i]);
      dp[i][j + 2] = Math.max(dp[i - 1][j + 2], dp[i - 1][j + 1] + prices[i]);
    }
  }
  return dp[prices.length - 1][2 * k];
};

var maxProfit3 = function (prices) {
  let dp = new Array(prices.length).fill().map(() => new Array(5).fill(0));
  dp[0][1] = -prices[0];
  dp[0][3] = -prices[0];
  for (let i = 1; i < prices.length; i++) {
    // 如何记录交易数 <= 2
    dp[i][0] = dp[i - 1][0];
    // 持有股票
    dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] - prices[i]);
    // 不持有股票 现金最多
    dp[i][2] = Math.max(dp[i - 1][2], dp[i - 1][1] + prices[i]);
    dp[i][3] = Math.max(dp[i - 1][3], dp[i - 1][2] - prices[i]);
    // 不持有股票 现金最多
    dp[i][4] = Math.max(dp[i - 1][4], dp[i - 1][3] + prices[i]);
  }
  return dp[prices.length - 1][4];
};

/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit2 = function (prices) {
  let dp = new Array(prices.length).fill([0, 0]);
  dp[0] = [-prices[0], 0];
  for (let i = 1; i < prices.length; i++) {
    // 如何记录交易数 <= 2
    // 持有股票
    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] - prices[i]);
    // 不持有股票 现金最多
    dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] + prices[i]);
  }
  return dp[prices.length - 1][1];
};

// 股票最大价值
// 输入：[7,1,5,3,6,4]
// 输出：5
// 解释：在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。 注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格；同时，你不能在买入前卖出股票。

function maxProfit(nums) {
  // 持有股票 不持有股票
  let dp = new Array(nums.length).fill([0, 1]);
  dp[0] = [-nums[0], 0];
  for (let i = 1; i < nums.length; i++) {
    // 持有股票
    // 第i-1天就持有股票  第i天买入股票
    dp[i][0] = Math.max(dp[i - 1][0], -nums[i]);
    // 不持有股票
    // 第i-1天就不持有股票  第i天卖出股票
    dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] + nums[i]);
  }
  return dp[nums.length - 1][1];
}

const res = useRequest('https://bythewayer.com/api/v1/cats/image', {
  method: 'GET',
});

function useRequest(url, opt) {
  const [data, setData] = useState(null);
  const [error, setError] = useState({});
  const [abort, setAbort] = useState(() => {});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const controller = new AbortController();
        const signal = controller.signal;
        setAbort(() => controller.abort());
        let res = await fetch(url, {
          ...opt,
          signal,
        });
        const data = await res.json();
        setData(data);
      } catch (e) {
        setError(e);
      }
    };
    fetchData();
    return () => {
      abort && abort();
    };
  }, []);
  return { data, error };
}

// abcabcbb
var lengthOfLongestSubstring = function (s) {
  let max = 0;
  let arr = [];
  for (let item of s) {
    const index = arr.indexOf(item);
    if (index > -1) {
      arr.splice(0, index);
    }
    arr.push(item);
    max = Math.max(max, arr.length);
  }
  return max;
};

// 连续重复最多字符的函数 aabbbc
// {
// count: 0,
// name: ''
// }
function maxStr(str) {
  let res = {
    count: 0,
    word: '',
  };
  let arr = [];
  for (let i = 0; i < str.length; i++) {
    let val = str[i];
    let index = arr.indexOf(val);
    if (arr.length > 0 && index == -1) {
      arr = [];
    }
    arr.push(val);
    res.count = Math.max(res.count, arr.length);
    if (arr.length == res.count) {
      res.word = val;
    }
  }
  return res;
}
maxStr('aabbbc');
function maxPath(root) {
  let max = 0;
  let dfs = (root) => {
    if (root == null) return 0;
    let left = dfs(root.left);
    let right = dfs(root.right);
    // innerMax
    let innerMax = left + right + root.val;
    max = Math.max(max, innerMax);
    // 当前子树对外提供的最大和
    let outerMax = root.val + Math.max(0, left, right);
    return outerMax > 0 ? outerMax : 0;
  };
  dfs(root);
  return max;
}
