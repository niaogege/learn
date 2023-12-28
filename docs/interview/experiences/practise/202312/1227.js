/**
 * 1.零钱兑换II
 * 2.不定长的二维数组全排列
 * 3.练习asyncGenerator
 * 4.对象扁平化
 * 5.字符串相乘
 * 6.rgbToHex/hexToRgb
 * 7.字符串相加
 */

function addBig(a, b) {
  let len = Math.max(a.length, b.length);
  a = a.padStart(len, '0');
  b = b.padStart(len, '0');
  let ans = '';
  let flag = 0;
  for (let i = len - 1; i >= 0; i--) {
    flag = Number(a[i]) + Number(b[i]) + flag;
    ans = (flag % 10) + ans;
    flag = Math.floor(flag / 10);
  }
  return flag === 1 ? '1' + ans : ans;
}
addBig('99', '33');
/**
 * 给定两个以字符串形式表示的非负整数 num1 和 num2，返回 num1 和 num2 的乘积，它们的乘积也表示为字符串形式。
注意：不能使用任何内置的 BigInteger 库或直接将输入转换为整数。
示例 1:
输入: num1 = "123", num2 = "456"
输出: "56088"
 * 
 */

/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 * 10*15
 * =15+15
 */
var multiply = function (a, b) {
  let flag = 0;
  let ans = '';
  for (let i = b.length - 1; i >= 0; i--) {
    flag = Number(b[i]) * Number(a);
    ans = flag + ans;
  }
  return ans;
};

var multiply = function (num1, num2) {
  let m = num1.length,
    n = num2.length;
  let res = new Array(m + n).fill(0); // [0,0]
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      let mul = +num1[i] * +num2[j];
      let p1 = i + j; // 0
      let p2 = i + j + 1; // 1
      let sum = mul + res[p2]; //6
      res[p2] = sum % 10; // 6
      res[p1] = res[p1] + Math.floor(sum / 10);
    }
  }
  while (res[0] == 0) {
    res.shift();
  }
  return res.length ? res.join('') : '0';
};

// {
//  'a.b': 1,
//  'a.c': 2,
//  'a.d.e': 5,
//  'b[0]': 1,
//  'b[1]': 3,
//  'b[2].a': 2,
//  'b[2].b': 3
//   c: 3
// }
var obj = {
  a: {
    b: 1,
    c: 2,
    d: { e: 5 },
  },
  b: [1, 3, { a: 2, b: 3 }],
  c: 3,
};

flattenObj(obj);

function flattenObj(obj, path = '', res = {}, isArray) {
  for (let [k, v] of Object.entries(obj)) {
    if (Array.isArray(v)) {
      let temp = isArray ? `${path}[${k}]` : `${path}${k}`;
      flattenObj(v, temp, res, true);
    } else if (v instanceof Object) {
      let temp = isArray ? `${path}[${k}].` : `${path}${k}.`;
      flattenObj(v, temp, res, false);
    } else {
      let temp = isArray ? `${path}[${k}]` : `${path}${k}`;
      res[temp] = v;
    }
  }
  return res;
}
flattenObj({
  a: {
    b: 1,
    c: 2,
    d: { e: 5 },
  },
  b: [1, 3, { a: 2, b: 3 }],
  c: 3,
});

// #ffffff => rgb(255,255,255)
function hexToRgb(str) {
  str = str.replace('#', '0x');
  let r = str >> 16;
  let g = (str >> 8) & 0xff;
  let b = str & 0xff;
  return `rgb(${r}, ${g}, ${b})`;
}
hexToRgb('#ffffff');
// rgb(255,255,255) => #ffffff
function rgbToHex(str) {
  let arr = str.split(/\D+/);
  let [, r, g, b] = arr;
  let toHex = (s) => {
    let hex = (+s).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
rgbToHex('rgb(255,255,255');

function asyncGenerator(fn) {
  return (...rest) => {
    let fun = fn.apply(this, rest);
    return new Promise((resolve, reject) => {
      function step(key, ...arg) {
        let res;
        try {
          res = fun[key](...arg);
        } catch (e) {
          reject(e);
        }
        const { done, value } = res;
        if (done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            (ans) => {
              return step('next', ans);
            },
            (err) => {
              return step('throw', err);
            },
          );
        }
      }
      step('next');
    });
  };
}

function mockResolve(num) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(num + 1);
    }, 1000);
  });
}

var mockGen = asyncGenerator(function* (num) {
  let f1 = yield mockResolve(num);
  let f2 = yield mockResolve(f1);
  console.log(f2);
  return f2;
});
mockGen(10).then((res) => {
  console.log(res, 'then');
});

// 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
// 每次你可以爬至多m (1 <= m < n)个台阶。你有多少种不同的方法可以爬到楼顶呢？
// 注意：给定 n 是一个正整数。

// dp[j]：凑足总额为j所需钱币的最少个数为dp[j]
function coinChange(coins, amount) {
  let dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let coin of coins) {
    for (let j = coin; j <= amount; j++) {
      dp[j] = Math.min(dp[j], dp[j - coin] + 1);
    }
  }
  return dp[amount] == Infinity ? '-1' : dp[amount];
}

function per(nums) {
  let ans = [];
  let backTrack = (nums, path) => {
    if (nums.length == path.length) {
      ans.push(path.slice());
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      let cur = nums[i];
      if (!path.includes(cur)) {
        path.push(cur);
        backTrack(nums, path);
        path.pop();
      }
    }
  };
  backTrack(nums, []);
  return ans;
}
per(['1', '2', '3']);
//
function allPer(nums) {
  let ans = [];
  let backTrack = (arr, path, row) => {
    if (path.length === arr.length) {
      ans.push(path.slice().join(''));
      return;
    }
    for (let i = 0; i < arr[row].length; i++) {
      path.push(arr[row][i]);
      backTrack(arr, path, row + 1);
      path.pop();
    }
  };
  backTrack(nums, [], 0);
  return ans;
}
allPer([
  ['A', 'B'],
  [1, 2],
  ['a', 'b'],
]);
