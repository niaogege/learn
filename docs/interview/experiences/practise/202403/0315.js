/**
 * 1.算法题都准备好了吗
 * 2.核心知识点前端准备
 * 3.mockReduce
 * 4.手写实现lodash.get
 * 5.超时重传机制
 */

function flattenObj(obj, res = {}, path = '', isArray = false) {
  for (let [key, val] of Object.entries(obj)) {
    if (Array.isArray(val)) {
      let tmp = isArray ? `${path}[${key}]` : `${path}${key}`;
      flattenObj(val, res, tmp, true);
    } else if (typeof val == 'object') {
      let tmp = isArray ? `${path}[${key}].` : `${path}${key}.`;
      flattenObj(val, res, tmp, false);
    } else {
      let tmp = isArray ? `${path}[${key}]` : `${path}${key}`;
      res[tmp] = val;
    }
  }
  return res;
}
let test = { a: [{ b: { c: 3 }, e: { name: 'cpp' } }] };
function mockGet(obj, name) {
  var obj = flattenObj(obj);
  return obj[name];
}
mockGet(test, 'a[0].b.c');
function flatten(arr, depth) {
  let stack = [...arr];
  let i = 1;
  let ans = [];
  while (stack.length) {
    const cur = stack.pop();
    if (Array.isArray(cur) && i < depth) {
      i++;
      stack.push(...cur);
    } else {
      ans.push(cur);
    }
  }
  return ans.reverse();
}
flatten([1, 2, [3, 4, [5]]], 2);

Array.prototype.mockReduce = function (fn, init) {
  let arr = this || [];
  let res = init ? init : arr[0];
  let startIndex = init ? 0 : 1;
  for (let i = startIndex; i < arr.length; i++) {
    res = fn.call(this, res, arr[i], i, arr);
  }
  return res;
};

/**
 * 

- 奇迹项目，复杂和深度
比较难得点在于优化
1.节点比较多 导致html页面比较大
2.seo方面，影响最深：需要的直出所有的连接，要把连接的url地址显示在html里，这个跟以前做spa模式完全不一样，spa都是js router 点击跳转到目标地址，现在是要把分类过滤好的目标url显示在html里 需要循环拼接url
3.NoSSR模式
*/
/**
 * 
- www项目
- 难度 唤端
- ssr debugger调试 launch.json 和本地开发
- 中间件
- docker/物理机部署发布 区别
*/
