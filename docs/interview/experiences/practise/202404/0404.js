/**
 * never give up
 * 1.二叉树镜像
 * 2.反转链表II
 */

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
