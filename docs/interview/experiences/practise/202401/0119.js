/**
 *
 */

[
  [1, 2, 3],
  [4, 5, 6],
  [-1, 12, 13],
  [6, 18, 0],
  [5, 5, 5],
  [6, 9, 3],
],
  找出其中和最大的三个子数组;

function mathMax(nums) {
  const sum = (a) => a.reduce((b, c) => b + c, 0);
  nums.sort((a, b) => sum(b) - sum(a));
  return nums.slice(0, 3);
}
mathMax([
  [1, 2, 3],
  [4, 5, 6],
  [-1, 12, 13],
  [6, 18, 0],
  [5, 5, 5],
  [6, 9, 3],
]);
