/**
 * 1.myCall/myApply
 * 2.mockNew
 * 3.LRU 最近最少更新 缓存淘汰策略
 * 4.compose 组合，洋葱模型
 * 5.myBind
 * 6.curry(参数固定和不固定)
 * 7.bigIntSum 大数相加
 * 8.deepClone 深浅拷贝
 * 9.16 进制转 rgb or rgb 转 16 进制
 * 10.mockMap/mockFilter 数组方法重写
 * 11.myReduce 重写
 * 12.flatter 扁平化手写
 * 13.手写发布订阅模式
 * 14.instanceof 手写
 * 15.手写选择排序和选择排序
 * 16.手写二分法
 * 17.手写驼峰转换
 * 18.手写防抖和节流
 * 19.反转链表
 * 20.手写Promise
 * 21.手写vue版render
 * 22.手写数字的千分位分割法
 * 23.实现promisify
 * 24.封装一个类使对象可以被 for of 遍历
 * 25.数字千分位展示
 * 26.手写async/await
 * 27.手写pipe compose
 * 28.Promise.all/any/race/allSettled
 * 29.手写并发控制器
 * 30.手写ajax
 * 31.手写jsonp
 * 33.URL参数解析
 * 34.手写去重
 **/

class MakeIterator {}
// 注意对象的格式 类数组
var obj = {
  0: 'wmh',
  1: 'cpp',
  2: 'chendap',
  length: 3,
};
for (var item of new MakeIterator(obj)) {
  console.log(item);
}
