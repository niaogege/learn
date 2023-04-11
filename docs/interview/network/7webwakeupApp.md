---
title: H5端如何唤起App
order: 7
group:
  order: 2
  title: 网络
  path: /interview/network
nav:
  order: 3
  title: 'interview'
  path: /interview
---

<!-- 面试中的重点，划重点 -->
<!-- 工作中有接触，算是一种回归和总结 -->

### 常见的唤端方式

### URL Scheme

URL Scheme 是一种特殊的 URL 协议，可以在 URL 中携带参数，通过调用该 URL 来唤起本地 APP。例如，微信的 URL Scheme 为**weixin://**，支付宝的 URL Scheme 为**alipay://**。喜马拉雅的 scheme 为**iting://**

唤起 APP 的实现方式是在 H5 页面中通过 JavaScript 代码拼接出唤起 APP 的 URL，并将该 URL 作为链接或按钮的 href 属性值或 JavaScript 事件绑定中的 location.href 赋值即可实现。

> 安卓阔以在 mainfest 里通过 intent-filter 配置 ios 在 info.plist 文件添加 URLURLtypes 注册一个 scheme 然后系统根据 scheme 唤起 app

```js
<!-- 通过链接方式唤起APP -->
<a href="weixin://">打开微信</a>
<!-- 通过绑定事件方式唤起APP -->
<button onclick="location.href='weixin://'">打开微信</button>
```

或者通过 a 标签

```js
function wakeUp() {
  const link = document.createElement('a');
  const body = document.body;
  link.href = iting ? iting : 'iting://open';
  body.appendChild(link);
  link.click();
  openAppTimer = setTimeout(() => {
    clearTimeout(openAppTimer);
  }, 2000);
}
```

#### 优缺点

URL Scheme 这种方式兼容性好，无论安卓或者 iOS 都能支持，是目前最常用的方式

- 无法准确判断是否唤起成功，h5 端无法知道当前用户手机是否已安装 app
- 唤端链路较长
- 当要被唤起的 APP 没有安装时，这个链接就会出错，页面无反应
- 不支持从其他 app 中的 UIWebView 中跳转到目标 APP， 所以 ios 和 android 都出现了自己的独有解决方案。

### Universal Link(IOS)

Universal Link 是在 iOS 9 中新增的功能，使用它可以直接通过 https 协议的链接来打开 APP。它相比前一种 URL Scheme 的优点在于它是使用 https 协议，所以如果没有唤端成功，那么就会直接打开这个网页，不再需要判断是否唤起成功了。并且使用 Universal Link，不会再弹出是否打开的弹出，对用户来说，唤端的效率更高了。

```js
<!-- 通过链接方式唤起APP -->
<a href="https://example.com/apple-app-site-association">打开APP</a>
<!-- 通过绑定事件方式唤起APP -->
<button onclick="location.href='https://example.com/apple-app-site-association'">打开APP</button>

window.location.href = 'https://oia.zhihu.com/questions/64966868'
```

#### 注意事项

- 协议必须是 https,且不支持重定向
- 根目录下需要配置一个 **apple-app-site-association** 文件
- 只能在 ios 端使用，安卓端无效

#### 优缺点

- 已经安装 APP，直接唤起 APP；APP 没有安装，就会跳去对应的 web link。
- universal Link 是从服务器上查询是哪个 APP 需要被打开，所以不会存在冲突问题
- universal Link 支持从其他 app 中的 UIWebView 中跳转到目标 app

缺点在于会记住用户的选择：在用户点击了 Universal link 之后，iOS 会去检测用户最近一次是选择了直接打开 app 还是打开网站。一旦用户点击了这个选项，他就会通过 safiri 打开你的网站。并且在之后的操作中，默认一直延续这个选择，除非用户从你的 webpage 上通过点击 Smart App Banner 上的 OPEN 按钮来打开。

### App Link、Chrome Intents（Android）

#### App Link

App Links 让用户在点击一个普通 web 链接的时候可以打开指定 APP 的指定页面，前提是这个 APP 已经安装并且经过了验证，否则会显示一个打开确认选项的弹出框，只支持 Android 6 以上系统

需要注意的是，使用 App link 方式打开链接需要系统支持，目前仅在 Android 6.0 及以上的系统中支持。在低版本的系统中，仍需要使用 URL Scheme 方式打开链接

#### Chrome Intents

Chrome Intent 是 Android 设备上 Chrome 浏览器中 URI 方案的深层链接替代品。如果 APP 已安装，则通过配置的 URI SCHEME 打开 APP。如果 APP 未安装，配置了 fallback url 的跳转 fallback url，没有配置的则跳转应用市场。

**安卓的两种唤端方式在国内应用较少**

### H5 唤端方式

a 标签和 iframe 标签以及 window.location.href 三种方式

在 ios9 以上的 safari 中不支持 iframe 唤起，阔以用 a 标签并模拟点击的方式

```js
function testOpen() {
  const a = document.createComment('a');
  const body = document.body;
  a.href = 'iting://open?';
  body.appendChild(a);
  a.click();
}
```

不同的浏览器对唤起 APP 的方式支持情况不同,以下是一个兼容性较好的 openApp 函数，同时支持设置超时时间和唤起失败后的处理方式。

```js
function openApp(schemeUrl, timeout, failCallback) {
  var ua = navigator.userAgent.toLowerCase();
  var startTime = Date.now();
  var tagA;
  var timer;
  // 微信浏览器，采用JSAPI方式唤起微信APP
  if (ua.indexOf('micromessenger') !== -1) {
    if (typeof WeixinJSBridge === 'undefined') {
      if (document.addEventListener) {
        document.addEventListener(
          'WeixinJSBridgeReady',
          function () {
            WeixinJSBridge.invoke(
              'launchApplication',
              {
                schemeUrl: schemeUrl,
              },
              function (res) {},
            );
          },
          false,
        );
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', function () {
          WeixinJSBridge.invoke(
            'launchApplication',
            {
              schemeUrl: schemeUrl,
            },
            function (res) {},
          );
        });
        document.attachEvent('onWeixinJSBridgeReady', function () {
          WeixinJSBridge.invoke(
            'launchApplication',
            {
              schemeUrl: schemeUrl,
            },
            function (res) {},
          );
        });
      }
    } else {
      WeixinJSBridge.invoke(
        'launchApplication',
        {
          schemeUrl: schemeUrl,
        },
        function (res) {},
      );
    }
  } else {
    // 其他浏览器，采用URL Scheme方式唤起APP
    tagA = document.createElement('a');
    tagA.style.display = 'none';
    tagA.src = schemeUrl;
    document.body.appendChild(tagA);
  }
  timer = setTimeout(function () {
    var endTime = Date.now();
    if (endTime - startTime < timeout + 200) {
      // APP未唤起，执行失败回调函数
      failCallback && failCallback();
    }
  }, timeout);
  window.onblur = function () {
    clearTimeout(timer);
  };
  window.onfocus = function () {
    clearTimeout(timer);
  };
}
```

使用方式

```js
openApp('iting://', 2000, function () {
  // 唤起失败，执行处理逻辑
});
```

#### 未安装 app 跳转到 H5 页面的选项

可以在唤起链接或按钮的点击事件中加入一个判断，如果唤起失败，则提供一个跳转到 H5 页面的选项。

```js
function openApp() {
  window.location.href = 'weixin://';
  setTimeout(function () {
    if (document.hidden || document.webkitHidden) {
      // 唤起失败，提供跳转到H5页面的选项
      if (confirm('未检测到对应的APP，是否跳转到H5页面？')) {
        window.location.href = 'https://example.com';
      }
    }
  }, 2000); // 设置一个2秒的定时器，判断是否唤起成功
}
```

### 参考

- [web 页面中如何唤起打开 APP](https://blog.csdn.net/zzhongcy/article/details/123506765)
- [H5 如何实现唤起 APP ](https://mp.weixin.qq.com/s/v4EKb3A3QsZMK_-C5cnAVg)
