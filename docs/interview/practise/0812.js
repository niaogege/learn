/**
 * 1.盛最多的水容器
 * 2.有效的括号
 * 3.手写histyory和hashRouter
 * 4. instanceof
 * 5.手写bind
 * 6.手写new
 * 7.手写call
 * 8.滚动到底部加载数据
 */

function scrollPage() {
  var scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight; // 文档内容的总高度
  var scrollBarTop = document.body.scrollTop || document.documentElement.scrollTop; // 滚动条的滚动距离
  var clientHeight = window.innerHeight;
  if (scrollBarTop + clientHeight >= scrollHeight) {
    fetchData(page);
  }
}
window.addEventListener('scroll', scrollPage);
window.removeEventListener('scroll', scrollPage);
