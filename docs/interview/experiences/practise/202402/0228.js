/**
 * 1.最大子序和
 * 2.链表相交
 * 3.盛最多水的容器
 * 4.有效的括号
 * 5.实现 ES6 的 Class
 * 6.实现 ES6 的 Extend
 * 7.滚动到底部懒加载数据 Hooks 实现
 * 8.图片懒加载
 * 9.手写虚拟dom
 * 11.打乱数组顺序
 */

/**
给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。
有效字符串需满足：
- 左括号必须用相同类型的右括号闭合。
- 左括号必须以正确的顺序闭合。
- 每个右括号都有一个对应的相同类型的左括号。
1.输入：s = "()[]{}" 输出：true 2.输入：s = "[()]" 输出：true
*/
function isValid(s) {
  let m = new Map([
    [')', '('],
    ['}', '{'],
    [']', '['],
  ]);
  let ans = [];
  for (let item of s) {
    const one = m.get(item);
    const last = ans[ans.length - 1];
    if (one == last) {
      ans.pop();
    } else {
      ans.push(item);
    }
  }
  return ans.length == 0;
}

/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function (height) {
  let end = height.length - 1;
  let start = 0;
  let max = 0;
  while (start <= end) {
    let h = Math.max(height[start], height[end]);
    let w = end - start;
    max = Math.max(max, h * w);
    if (height[end] > height[start]) {
      start++;
    } else {
      end--;
    }
  }
  return max;
};

// 惰性函数
function addEventListener() {}

function mockClass(Con, parent, props) {}

// 创建对象，基于父类原型创建一个副本 prototype
// 增强对象，弥补因重写原型而失去的默认的 constructor 属性
// 指定对象，将副本 prototype 赋值给子类型的原型属性
function mockExtend(child, parent) {
  const parentProto = Object.create(parent.prototype);
  parentProto.constructor = child;
  child.prototype = parentProto;
}

function mockExtends(child, parent, props) {}

function render(vnode, parent) {
  const mount = parent ? (el) => parent.appendChild(el) : (el) => el;
  if (typeof vnode.tag === 'string') {
    mount(document.createElement(vnode.tag));
  } else {
    const div = mount(document.createElement(vnode.tag));
    // props
    if (vnode.props) {
      Object.keys(vnode.props).forEach((key) => {
        const val = vnode.props[key];
        div.setAttribute(key, val);
      });
    }
    // child
    if (vnode.children) {
      vnode.children.forEach((child) => {
        document.appendChild(render(child, parent));
      });
    }
    return div;
  }
}
render({}, document.getElementById('app'));

// 滚动到底部懒加载数据 Hooks 实现
function useBottom() {
  const getData = useCallback(() => {}, []);
  useEffect(() => {
    const allHeight = document.body.offsetHeight;
    const scrollH = document.body.scrollHeight;
    const clientH = window.innerHeight;
    if (scrollH + clientH + 10 > allHeight) {
      getData();
    }
  }, [getData]);
}

function lazyLoadImg() {
  const ele = document.querySelectorAll('img');
  let Observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const { insectionRatio, target } = entry;
      if (insectionRatio > 0) {
        target.src = target.dataSet.src;
        Observer.unobserve(target);
      }
    });
  });
  ele.forEach((item) => {
    Observer.observe(item);
  });
}

function lazyLoadImg2(src) {
  return new Promise((resolve, reject) => {
    loadImg(src, function (err, con) {
      if (err) {
        reject(err);
      }
      resolve(con);
    });
  });
}
function loadImg(src, cb) {
  const img = document.createElement('img');
  img.src = src;
  img.onload = function () {
    cb(null, img);
  };
  img.onerror = function () {
    cb('err');
  };
  document.body.appendChild(img);
}

/**
 * 
给你两个单链表的头节点 headA 和 headB ，请你找出并返回两个单链表相交的起始节点。如果两个链表没有交点，返回 null 。
图示两个链表在节点 c1 开始相交：
*/

function insectionNode(headA, headB) {
  let s = new Set();
  let cur = headA;
  while (cur) {
    s.add(cur);
    cur = cur.next;
  }
  let tmp = headB;
  while (tmp) {
    if (s.has(tmp)) {
      return tmp;
    }
    tmp = tmp.next;
  }
  return null;
}

/** 
输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
输出：6
解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
*/
function subChildArr(arr) {
  let sum = 0;
  let max = 0;
  for (let item of arr) {
    if (sum > 0) {
      sum += item;
    } else {
      sum = item;
    }
    max = Math.max(max, sum);
  }
  return max;
}
subChildArr([-2, 1, -3, 4, -1, 2, 1, -5, 4]);

function randomArr(arr) {
  for (let i = arr.length; i > 0; i--) {
    let index = Math.floor(Math.random() * (i - 1));
    // let tmp = arr[index];
    // arr[index] = arr[i];
    // arr[i] = tmp;
    [arr[index], arr[i]] = [arr[i], arr[index]];
  }
}
function randomArr2(arr) {
  return arr.sort(() => 0.5 - Math.random());
}
randomArr2([1, 2, 3, 4, 5, 6, 7]);
