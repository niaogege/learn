/**
 * never give up
 * 1.二叉树镜像
 * 2.反转链表II
 * 3.快乐数
 * 4.字符串转换整数
 * 5.除自身以外数组的乘积
 * 6.岛屿的最大面积
 * 7.最长连续序列
 * 8.乘积最大子数组
 */

function maxMul(arr) {
  let max = 1;
  let min = 1;
  let ans = 1;
  for (let num of arr) {
    if (num < -1) {
      let tmp = max;
      max = min;
      min = tmp;
    }
    max = Math.max(max * num, num);
    min = Math.min(min * num, num);
    ans = Math.max(max, ans);
  }
  return ans;
}

isHappy(19);
function isHappy(n) {
  let slow = n;
  let fast = getSum(n);
  while (fast != 1) {
    slow = getSum(slow);
    fast = getSum(fast);
    fast = getSum(fast);
    if (fast == slow) {
      return false;
    }
  }
  return true;
}
function getSum(n) {
  let sum = 0;
  while (n > 0) {
    sum += Math.pow(n % 10, 2);
    n = Math.floor(n / 10);
  }
  return sum;
}
getSum(81);

function Mirror(pRoot) {
  // write code here
  if (pRoot == null) return pRoot;
  let temp = Mirror(pRoot.left);
  pRoot.left = Mirror(pRoot.right);
  pRoot.right = temp;
  return pRoot;
}

/**
 * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
 *
 *
 * @param head ListNode类
 * @param m int整型
 * @param n int整型
 * @return ListNode类
 */
function reverseBetween(head, m, n) {
  // write code here
}
