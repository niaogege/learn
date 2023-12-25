/**
 * 1.多数组取交集
 * 2.排序多版本号
 * 3.两个字符串对比, 得出结论都做了什么操作, 比如插入或者删除
 * 4.分割等和子集
 * 5.快速排序
 */

//背包的体积为sum / 2
// 背包要放入的商品（集合里的元素）重量为 元素的数值，价值也为元素的数值
// 背包如果正好装满，说明找到了总和为 sum / 2 的子集。
// 背包中每一个元素是不可重复放入。

var canPartition = function (nums) {
  nums.sort((a, b) => a - b);
  let sum = nums.reduce((a, b) => a + b);
  let isUp = sum % 2;
  if (isUp > 0) return false;
  let mid = sum / 2;
  let len = nums.length;
  var dp = new Array(len).fill().map(() => new Array(mid + 1));
  for (let i = nums[0]; i <= mid; i++) {
    dp[0][i] = nums[0];
  }
  // 转化成数组里是几项之和是否等于mid
  for (let i = 1; i < len; i++) {
    for (let j = 0; j <= size; j++) {
      dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - nums[i]] + nums[i]);
    }
  }
  return dp[size] / 2 == mid;
};

function weightBag(weight, value, size) {
  let len = weight.length;
  let dp = new Array(len).fill().map(() => new Array(size + 1).fill(0));
  // 首行初始化wieght[0]
  for (let i = weight[0]; i < size; i++) {
    dp[0][i] = value[0];
  }
  for (let i = 1; i < len; i++) {
    for (let j = 0; j <= size; j++) {
      if (weight[i] > j) {
        dp[i][j] = dp[i - 1][j];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - weight[i]] + value[i]);
      }
    }
  }
  return dp[len - 1][size];
}

function weightBagOne(weight, value, size) {
  let dp = new Array(size + 1).fill(0);
  for (let i = 0; i < weight.length; i++) {
    for (let j = size; j >= weight[i]; j--) {
      dp[j] = Math.max(dp[j], dp[j - weight[i]] + value[i]);
    }
  }
  console.log(dp);
  return dp[size];
}
weightBagOne([1, 3, 4], [15, 20, 30], 6);

/*
输入：version1 = "1.01", version2 = "1.001"
输出：0
解释：忽略前导零，"01" 和 "001" 都表示相同的整数 "1"
示例 2：
输入：version1 = "1.0", version2 = "1.0.0"
输出：0
解释：version1 没有指定下标为 2 的修订号，即视为 "0"
示例 3：
输入：version1 = "0.1", version2 = "1.1"
输出：-1
解释：version1 中下标为 0 的修订号是 "0"，version2 中下标为 0 的修订号是 "1" 。0 < 1，所以 version1 < version2
*/

var compareVersion = function (v1, v2) {
  v1 = v1.split('.').map((e) => +e);
  v2 = v2.split('.').map((e) => +e);
  let len = Math.max(v1.length, v2.length);
  let i = 0;
  while (i < len) {
    let cu1 = v1[i] || 0;
    let cu2 = v2[i] || 0;
    if (cu1 > cu2) {
      return 1;
    } else if (cu1 < cu2) {
      return -1;
    } else if (cu1 == cu2) {
      i++;
    }
  }
  return 0;
};

class RedPackage {
  money = 0;
  count = 0;
  _remain = 0;

  constructor(money, count) {
    this.money = money;
    this.count = count;
    this._remain = money;
  }

  openRedPackge() {
    //  已经抢完了
    if (this.count <= 0) {
      console.log('红包已经被抢完啦~');
      return;
    }

    //  只剩一个红包
    if (this.count === 1) {
      this.count--;
      console.log(this._remain);
      return;
    }

    const ratio = Math.random() * (this._remain / this.money);
    //  这里会涉及到一个JS计算精度的问题
    //  正常应该用第三方库或者字符串算法实现一个精准的加减乘除
    //  这里为了简单就这么直接做了
    let youGet = (this.money * ratio).toFixed(2);
    const tempRemain = +(this._remain - youGet).toFixed(2);
    const allLeast = this.count * 0.01;

    //  如果剩余的金额不够每人一分钱，那么需要减少本次获得的金额
    if (tempRemain < allLeast) {
      youGet = +(this._remain - allLeast).toFixed(2);
      this._remain = allLeast;
    } else {
      this._remain = tempRemain;
    }
    console.log(youGet);
    this.count--;
  }
}
var t = new RedPackage(100, 10);
console.log(t, 'ttt');
