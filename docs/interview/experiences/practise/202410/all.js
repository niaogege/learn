/**
 * 限制并发请求
 */
const limitRequest = async (arr, limit, fn) => {
  const queue = []; // 存放结果
  const resolveP = []; // 存储当前正在执行的异步任务
  for (let i = 0; i < arr.length; i++) {
    const p1 = Promise.resolve().then(() => fn(arr[i]));
    queue.push(p1);
    if (arr.length >= limit) {
      const p2 = p1.then(() => resolveP.splice(resolveP.indexOf(p2), 1));
      resolveP.push(p2);
      if (resolveP.length >= limit) {
        // 等待较快的任务执行
        await Promise.race(resolveP);
      }
    }
  }
  return Promise.all(queue);
};
// arr.splice(index, 1)

// 单行省略号
