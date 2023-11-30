/**
 * 1，滚动到底部
 * 2. 滚动到顶部
 */

function scrollTop() {
  var top = document.body.scrollTop || document.documentElement.scrollTop;
  if (top > 0) {
    window.requestAnimationFrame(scrollTop);
    window.scrollTo(0, height - height / 8);
  }
}

function scrollBottom() {
  // 滚动的总距离
  var scrollAllheight = document.body.scrollHeight || document.documentElement.scrollHeight;
  // 视图高度
  var innerHeight = window.innerHeight || document.body.clientHeight;
  // 滚动的距离
  var scrollH = document.body.scrollTop;
  if (scrollH + innerHeight >= scrollAllheight) {
    console.log('到底了');
  }
}
