/**
 * 1. nevwe give up
 * 2.两两交换
 * 3.下个排列
 * 3.二叉树右视图
 * 4.最长公共子串
 * 6.最长递增子序列
 * 7.Promise
 * 8.async/await
 * 9.LimitRequest
 */

async function LimitRequest(arr, limit, fn) {
  let queue = [];
  let ans = [];
  for (let item of arr) {
    let p1 = Promise.resolve(item).then((val) => fn(val));
    ans.push(p1);
    if (arr.length >= limit) {
      let p2 = p1.then(() => {
        return queue.splice(queue.indexOf(p2), 1);
      });
      // 保存正在执行的异步任务
      queue.push(p2);
      if (queue.length >= limit) {
        // 等待较快的任务执行
        await Promise.race(queue);
      }
    }
  }
  return Promise.all(ans);
}

function mockGeneratorAsync(fn) {
  return (...rest) => {
    let gFN = fn.apply(this, rest);
    return new Promise((resolve, reject) => {
      step('next');
      function step(key, arg) {
        let res;
        try {
          res = gFN[key](...arg);
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
    });
  };
}

/**
// 1->2->3
cur -> 2
2->1
1->3
*/
function twoSwap(head) {
  let dummy = {
    next: head,
    val: null,
  };
  let cur = dummy;
  while (cur.next && cur.next.next) {
    let tmp1 = cur.next; //1
    let tmp2 = cur.next.next.next; // 3
    cur.next = cur.next.next; // 指向2
    cur.next.next = tmp1; // 2指向1
    tmp1.next = tmp2; // 1指向3
    cur = cur.next.next;
  }
  return dummy.next;
}

function reverse(head) {
  let pre = null;
  let cur = head;
  while (cur) {
    let next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  return pre;
}
