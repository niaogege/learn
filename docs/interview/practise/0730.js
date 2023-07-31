/**
 * 1.memo
 * 2.函数重载
 * 3.千分位展示
 * 4.vue中的render函数
 * 5.驼峰转化
 * 6.useFetch
 * 7.useEvent
 * 8.封装class使其阔以可以被 for of 遍历
 * 9.Promise/Promise.all/Promise.allSettled
 * 10.compose/pipe
 * 11.请求并发限制
 */

function memo(fn) {
  var cache = {}
  return function (...rest) {
    var arg = JSON.stringify(rest)
    cache[arg] = fn.apply(this, rest)
    return cache[arg]
  }
}

function heavyLoad(obj, name, fn) {
  var oldFn = obj[name]
  obj[name] = funcion(...rest) {
    if (fn.length === rest.length) {
      fn.apply(this, rest)
    } else {
      oldFn.apply(this, rest)
    }
  }
}

function thousand(str) {
  var reg = /(?!^)(?=(\d{3})+$)/g
  return str.replace(reg, ',')
}
thousand('123445678')

// {{msg}}-{{name}} - {name, msg}
function render(str, data) {
  var reg = /\{\{(\w+)\}\}/
  if (reg.test(str)) {
    var name = RegExp.$1.trim()
    str = str.replace(reg, data[name])
    return render(str, data)
  }
  return str
}
render(`{{msg}}-{{name}}`, {name: 'cpp', msg: 'wmh'})
// cpp-wmh => cppWmh
function camUpper(str) {
  return str.replace(/[@|_|-]([\w+])/g, (match,p) => p && p.toUpperCase())
}
camUpper('cpp-wmh')


class MyPromise {
  constructor(exe) {
    this.data = undefined
    this.cbs = []
    const resolve = (res) => {
      setTimeout(() => {
        this.data = res
        this.cbs.forEach((cb) => {
          cb(res)
        })
      }, 0)
    }
    exe(resolve)
  }
  then(onResolved) {
    return new MyPromise((resolve) => {
      this.cbs.push(() => {
        const res = onResolved(this.data)
        if (res instanceof MyPromise) {
          return res.then(resolve)
        } else {
          return resolve(res)
        }
      })
    })
  }
  all(promises) {
    return new MyPromise((resolve, reject) => {
      const res = []
      for (let [index, item] of promises.entries()) {
        Promise.resolve(item).then((val) => {
          res.push(val)
          if (index === promises.length - 1) {
            resolve(res)
          }
        }, (err) => {
          return reject(err)
        })
      }
    })
  }
  race(promises) {
    return new Promise((resolve, reject) => {
      for(let [index, item] of promises.entries()) {
        Promise.resolve(item).then((val) => {
          resolve(val)
        }, (err) => {
          reject(err)
        })
      }
    })
  }
  allSettled(promises) {}
}

var p1 = new MyPromise((resolve) => {

})
p1.then((res) => {})

// 从右到左
function compose(...rest) {
  if (rest.length === 0) return (...arg) => arg
  if (rest.length === 1) return rest[0]
  return rest.reduce((pre, cur) => {
   return (...arg) => pre(cur(...arg)) 
  })
}

// 从左到右
function pipe(...rest) {
  return (val) => {
    return rest.reduce((pre, cur) => {
      return cur(pre)
    }, val)
  }
}

// 请求并发限制
var delay = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(time)
    }, time)
  })
}
var p1 = delay(200)
var p2 = delay(300)
var p3 = delay(500)
var p4 = delay(400)

async function pool(array, limit, iteratorFn) {
  var res = [] // 存放结果
  var arr = [] // 存储当前正在执行的异步任务
  for(let i = 0 ; i < array.length; i ++) {
    // 调用iteratorFn函数创建异步任务
    var p1 = Promise.resolve().then(() => iteratorFn(array[i], array))
    // 保存新的异步任务
    res.push(p1)
    // Limit值小于或等于总任务个数时，进行并发控制
    if (array.length >= limit) {
      // 当任务完成后，从正在执行的任务数组中移除已完成的任务
      var p2 = p1.then(() => arr.splice(arr.indexOf(p2), 1))
      // 保存正在执行的异步任务
      arr.push(p2)
      if(arr.length >= arr ) {
        // 等待较快的任务执行
        await Promise.race(arr)
      }
    }
  }
  return Promise.all(res)
}


import {useState, useRef, useEffect, useCallback} from 'react'

const useEvent = (handler) => {
  var handlerRef = useRef()
  useLayoutEffect(() => {
    handlerRef.current = handler
  })
  return useCallback((...rest) => {
    if (handlerRef.current) {
      handlerRef.current(...rest)
    }
  }, [])
}
const MyApp = () => {
  const [text, setText] = useState('TEXT');
  const onClick = useEvent(() => {
    setText('NEW Text');
  });

  // return <SendButton onClick={onClick} text={text} />;
};
// export default MyApp



const useFetch = (url, option) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [abort, setAbort] = useState(() => {})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const abortController = new AbortController()
        setAbort(abortController.abort)
        const data = await fetch(url, {...option, signal: abortController.signal})
        const res = await data.json()
        setData(res)
      } catch(e) {
        setError(e)
      }
    }
    fetchData()
    return () => {
      abort()
    }
  }, [ ])

  return {
    data,
    error,
    abort
  }
}

const ImageFetch = props => {
  const res = useFetch('https://dog.ceo/api/breeds/image/random', {});
  if (!res.response) {
    return <div>Loading...</div>;
  }
  const imageUrl = res.response.message;
  return (
    <div>
      <img src={imageUrl} alt="avatar" width={400} height="auto" />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <ImageFetch />
);