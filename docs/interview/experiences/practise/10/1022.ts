/**
 * 1.排序
 * 2.手写虚拟DOM
 * 3.如何实现(a == 1 && a == 2 && a == 3)
 * 4.图片懒加载
 */
var tree = {
  type: 'DIV',
  attrs: {
    id: 'app',
  },
  children: [
    {
      type: 'SPAN',
      children: [],
    },
  ],
};
function render2(vnode, parent) {
  var mount = parent ? (el) => parent.appendChild(el) : (el) => el;
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return mount(document.createTextNode(vnode));
  } else {
    let dom = mount(document.createElement(vnode.type));
    if (vnode.attrs) {
      Object.keys(vnode.attrs).forEach((key) => {
        const val = vnode.attrs[key];
        dom.setAttribute(key, val);
      });
    }
    vnode.children.forEach((child) => {
      dom.appendChild(render(child));
    });
  }
}
render(tree, document.getElementById('app'));
var a = {
  value: 1,
  toString: function () {
    return a.value++;
  },
};
console.log(a == 1 && a == 2 && a == 3);

function lazyLoadImg(imgs) {
  var observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const { target, intersectionRatio } = entry;
      if (intersectionRatio > 0) {
        target.src = target.dataset.src;
        observer.unobserve(target);
      }
    });
  });
  imgs.forEach((img) => observer.observe(img));
}
