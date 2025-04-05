---
title: Web Worker和service worker
order: 21
group:
  order: 1
  title: js Basic
  path: /interview/js
nav:
  order: 3
  title: 'interview'
  path: /interview
---

## Service worker

### 1. 什么是 Service Worker

Service Worker 本质上是充当 web 应用程序与浏览器之间的代理服务器，也可以在网络可用时作为浏览器和网络间的代理。它们的目的是创建有效的**离线体验**、拦截网络请求并根据网络是否可用采取适当的操作，以及更新服务器上的资产。它们还允许访问推送通知和后台同步 API。

### 2.service worker 的生命周期

Service Worker 的生命周期可以分为 6 个阶段：解析(parsed)、安装(installing)、安装完成(installed)、激活(activating)、激活完成(activated)、闲置(redundant)。

#### Parsed 解析阶段

当我们第一次尝试注册 Service Worker 时，用户代理会解析脚本并获取入口点。如果解析成功（并且满足其他一些要求，例如 HTTPS），我们将可以访问 Service Worker 注册对象。其中包含有关 Service Worker 的状态及其作用域的信息。

```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./sw.js')
    .then(function (registration) {
      console.log('Service Worker Registered', registration);
    })
    .catch(function (err) {
      console.log('Service Worker Failed to Register', err);
    });
}
```

Service Worker 注册成功并不意味着它已安装完毕或处于激活状态，而只是意味着脚本已成功解析，它与文档处于同一源上，且源为 HTTPS。注册完成后，服务 Worker 将进入下一个状态。

#### installing

一旦 Service Worker 脚本被解析，用户代理就会尝试安装它，并进入安装状态。在 Service Worker 的 registration 对象中，我们可以在 installing 属性中检查此状态。

并且，在 installing 状态下，install 事件会被触发，我们一般会在这个回调中处理缓存事件。

```js
navigator.serviceWorker.register('./sw.js').then(function (registration) {
  if (registration.installing) {
    // Service Worker is Installing
  }
});
```

如果事件中有 event.waitUntil() 方法，其中的 Promise 只有在 resolve 后，install 事件才会成功。如果 Promise 被拒绝，install 就会失败，Service Worker 就会变为 redundant 状态。

```js
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(currentCacheName).then(function (cache) {
      return cache.addAll(['./', './index.html', './style.css', './app.js']);
    }),
  );
});

self.addEventListener('install', function(event) {
  event.waitUntil(
   return Promise.reject(); // Failure
  );
});
```

#### Installed / Waiting 安装完成

如果安装成功，Service Worker 的状态变为 installed （也叫 waiting ）。处于这个状态时， Service Worker 是有效的但是是未激活的 worker，暂时没有控制页面的权力，需要等待从当前 worker 获得控制权。

我们可以在 registration 对象的 waiting 属性中检测到此状态。

```js
navigator.serviceWorker.register('./sw.js').then(function (registration) {
  if (registration.waiting) {
    // Service Worker is Waiting
  }
});
```

我们可以在这个时机去更新新版本或自动更新缓存。

#### Activating 激活

在以下情况之一时，处于 Waiting 状态的 worker 的 Activating 状态会被触发：

- 当前没有处于激活状态的 worker
- self.skipWaiting() 在 sw.js 中被调用，直接跳过 waiting 阶段
- 用户导航离开当前页面，从而释放了前一个 active worker
- 经过了指定时间段，从而释放了前一个 active worker

在当前状态下，activate 事件会被触发，在这个回调中我们通常用于清除旧缓存。

```js
self.addEventListener('activate', function (event) {
  event.waitUntil(
    // Get all the cache names
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        // Get all the items that are stored under a different cache name than the current one
        cacheNames
          .filter(function (cacheName) {
            return cacheName != currentCacheName;
          })
          .map(function (cacheName) {
            // Delete the items
            return caches.delete(cacheName);
          }),
      ); // end Promise.all()
    }), // end caches.keys()
  ); // end event.waitUntil()
});
```

同 install 事件，如果 Promise 被 reject 了，则 activate 事件失败，Service Worker 变为 redundant 状态。

#### Activated

如果激活成功，Service Worker 状态会变成 active ，在这个状态下，Service Worker 是一个可以完全控制网页的激活 worker，我们可以在 registration 对象的 active 属性中检测到此状态。

```js
navigator.serviceWorker.register('./sw.js').then(function (registration) {
  if (registration.active) {
    // Service Worker is Active
  }
});
```

#### Redundant

以下任一情况，Service Worker 都会变成 redundant。

install 失败 activate 失败有新的 Service Worker 将其替代成为现有的激活 worker

### Service Worker 离线缓存

Service Worker 最重要的功能之一，就是可以通过缓存静态资源来实现离线访问我们的页面。 Service Worker 的缓存基于 CacheStorage，它是一个 Promise 对象，我们可以通过 caches 来获取它。CacheStorage 提供了一些方法，我们可以通过这些方法来对缓存进行操作。

```js
caches.open(currentCacheName).then(function (cache) {
  /** 可以通过cache.put来添加缓存
   *  它接收两个参数，第一个参数是Request对象或URL字符串，第二个参数是Response对象
   */
  cache.put(new Request('/'), new Response('Hello World'));

  /** 可以通过cache.addAll来添加缓存资源数组
   *  它接收一个参数，这个参数可以是Request对象数组，也可以是URL字符串数组
   */
  cache.addAll(['/']);

  /** 可以通过cache.match来获取缓存
   *  它接收一个参数，这个参数可以是Request对象，也可以是URL字符串
   */
  cache.match('/').then(function (response) {
    console.log(response);
  });

  /** 可以通过cache.delete来删除缓存
   *  它接收一个参数，这个参数可以是Request对象，也可以是URL字符串
   */
  cache.delete('/').then(function () {
    console.log('删除成功');
  });

  /** 可以通过cache.keys来获取缓存的key
   *  然后通过cache.delete来删除缓存
   */
  cache.keys().then(function (keys) {
    keys.forEach(function (key) {
      cache.delete(key);
    });
  });
});
```

### 「waitUntil 机制」

参考：https://developer.mozilla.org/zh-CN/docs/Web/API/ExtendableEvent/waitUntil

ExtendableEvent.waitUntil() 方法告诉事件分发器该事件仍在进行。这个方法也可以用于检测进行的任务是否成功。在服务工作线程中，这个方法告诉浏览器事件一直进行，直至 promise resolve，浏览器不应该在事件中的异步操作完成之前终止服务工作线程。

#### 「skipWaiting」

Service Worker 一旦更新，需要等所有的终端都关闭之后，再重新打开页面才能激活新的 Service Worker，这个过程太复杂了。通常情况下，开发者希望当 Service Worker 一检测到更新就直接激活新的 Service Worker。如果不想等所有的终端都关闭再打开的话，只能通过 skipWaiting 的方法了。

Service Worker 在全局提供了一个 skipWaiting() 方法，skipWaiting() 在 waiting 期间调用还是在之前调用并没有什么不同。一般情况下是在 install 事件中调用它。

#### 「clients.claim() 方法」

如果使用了 skipWaiting 的方式跳过 waiting 状态，直接激活了 Service Worker，可能会出现其他终端还没有受当前终端激活的 Service Worker 控制的情况，切回其他终端之后，Service Worker 控制页面的效果可能不符合预期，尤其是如果 Service Worker 需要动态拦截第三方请求的时候。

为了保证 Service Worker 激活之后能够马上作用于所有的终端，通常在激活 Service Worker 后，通过在其中调用 self.clients.claim() 方法控制未受控制的客户端。self.clients.claim() 方法返回一个 Promise，可以直接在 waitUntil() 方法中调用，如下代码所示：

## web worker 和 service worker 的关系

service worker 本质上 web worker
