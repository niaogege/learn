---
title: cookie/jwt/session
order: 2
group:
  order: 10
  title: browser
  path: /interview/browser
nav:
  order: 3
  title: 'interview'
  path: /interview
---

面试题：

- 了解 JSON Web Token 么，它和其他的鉴权方式有什么区别

## 参考大佬

- [一文教你搞定所有前端鉴权与后端鉴权方案，让你不再迷惘](https://juejin.cn/post/7129298214959710244)
- [Web 安全 - 同事告诉我 JWT 是明文的...](https://mp.weixin.qq.com/s/eVaHk_YVxtmNs470p02I2g)

## Session-cookie 鉴权

### 介绍

session 的鉴权就是利用了 cookie，用户调用登录接口，完成账号密码的校验之后，将用户信息或者其他校验信息生成为 cookie 字符串，返回给用户，同时将 cookie 存储在服务器内存，用户请求其他接口时，会在请求头自动将 cookie 发送给服务器，服务器会通过与服务器内存中的用户信息匹配，如果匹配成功，则返回客户端想要的内容，否则抛出错误提示客户端需要重新登录。大致流程图如下：

### session 流程

- 客户端： 用户向服务器首次发送请求；

- 服务器： 接收到数据并自动为该用户创建特定的 Session / Session ID，来标识用户并跟踪用户当前的会话过程；

- 客户端： 浏览器收到响应获取会话信息，并且会在下一次请求时带上 Session / Session ID；

- 服务器： 服务器提取后会与本地保存的 Session ID 进行对比找到该特定用户的会话，进而获取会话状态；

至此客户端与服务器的通信变成有状态的通信；

### session 与 cookie 差异

- 安全性： Cookie 由于保存在客户端，可随意篡改，Session 则不同存储在服务器端，无法伪造，所以 Session 的安全性更高；

- 存取值的类型不同： Cookie 只支持字符串数据，Session 可以存任意数据类型；

- 有效期不同： Cookie 可设置为长时间保持，Session 一般失效时间较短；

- 存储大小不同： Cookie 保存的数据不能超过 4K；

> Session-Cookie 就是把 Session 存储在了客户端的 Cookie 中

### Session-Cookie 的认证流程图

- 客户端： 向服务器发送登录信息用户名/密码来请求登录校验；

- 服务器： 验证登录的信息，验证通过后自动创建 Session（将 Session 保存在内存中，也可以保存在 Redis 中），然后给这个 Session 生成一个唯一的标识字符串会话身份凭证  session_id(通常称为  sid)，并在响应头  **Set-Cookie**  中设置这个唯一标识符；

- 客户端： 收到服务器的响应后会解析响应头，并自动将  sid  保存在本地 Cookie 中，浏览器在下次 HTTP 请求时请求头会自动附带上该域名下的 Cookie 信息；

- 服务器： 接收客户端请求时会去解析请求头 Cookie 中的  sid，然后根据这个  sid  去找服务端保存的该客户端的  sid，然后判断该请求是否合法；

### 优缺点

可以看到，Session 机制需要 cookie 的配合才能实现，因此 cookie 的的缺点或特性也就会影响到 Session 鉴权，比如，cookie 是默认不支持跨域的，当前端跨域请求后端接口时，需要做很多额外的配置，这也就是为什么 Session 推荐在服务端使用。

#### 优点

- Cookie 简单易用
- Session 数据存储在服务端，相较于 JWT 方便进行管理，也就是当用户登录和主动注销，只需要添加删除对应的 Session 就可以了，方便管理
- 只需要后端操作即可，前端可以无感等进行操作；

#### 缺点

- 依赖 Cookie，一旦用户在浏览器端禁用 Cookie，完蛋；

- 非常不安全，Cookie 将数据暴露在浏览器中，增加了数据被盗的风险（容易被 CSRF 等攻击）；

- Session 存储在服务端，增大了服务端的开销，用户量大的时候会大大降低服务器性能；

- 对移动端的支持性不友好；

## TOKEN

Token 是一个令牌，客户端访问服务器时，验证通过后服务端会为其签发一张令牌，之后，客户端就可以携带令牌访问服务器，服务端只需要验证令牌的有效性即可。一句话概括；**访问资源接口（API）时所需要的资源凭证**

一般 Token 的组成： uid (用户唯一的身份标识) + time (当前时间的时间戳) + sign (签名，Token 的前几位以哈希算法压缩成的一定长度的十六进制字符串)

### Token 认证步骤解析：

客户端： 输入用户名和密码请求登录校验；服务器： 收到请求，去验证用户名与密码；验证成功后，**服务端会签发一个 Token** 并把这个 Token 发送给客户端；客户端： 收到 Token 以后需要把它存储起来，web 端一般会放在 localStorage 或 Cookie 中，移动端原生 APP 一般存储在本地缓存中；客户端发送请求： 向服务端请求 API 资源的时候，将 Token 通过 HTTP 请求头 **Authorization** 字段或者其它方式发送给服务端；服务器： 收到请求，然后去验证客户端请求里面带着的 Token ，如果验证成功，就向客户端返回请求的数据，否则拒绝返还（401）；

### Token 的优点：

- 服务端无状态化、可扩展性好： Token 机制在服务端不需要存储会话（Session）信息，因为 Token 自身包含了其所标识用户的相关信息，这有利于在多个服务间共享用户状态

- 支持 APP 移动端设备；

- 安全性好： 有效避免 CSRF 攻击（因为不需要 Cookie）

- 支持跨程序调用： 因为 Cookie 是不允许跨域访问的，而 Token 则不存在这个问题

### Token 的缺点：

- 配合： 需要前后端配合处理；

- 占带宽： 正常情况下比  sid  更大，消耗更多流量，挤占更多宽带

- 性能问题： 虽说验证 Token 时不用再去访问数据库或远程服务进行权限校验，但是需要对 Token 加解密等操作，所以会更耗性能；

- 有效期短： 为了避免 Token 被盗用，一般 Token 的有效期会设置的较短，所以就有了 **Refresh Token**；

## Refresh Token

业务接口用来鉴权的 Token，我们称之为 Access Token。为了安全，我们的 Access Token 有效期一般设置较短，以避免被盗用。但过短的有效期会造成 Access Token 经常过期，过期后怎么办呢？一种办法是：刷新 Access Token，让用户重新登录获取新 Token，会很麻烦；另外一种办法是：再来一个 Token，一个**专门生成 Access Token 的 Toke**n，我们称为 **Refresh Token**；

Access Token： 用来访问业务接口，由于有效期足够短，盗用风险小，也可以使请求方式更宽松灵活； Refresh Token： **用来获取 Access Token**，有效期可以长一些，通过独立服务和严格的请求方式增加安全性；由于不常验证，也可以如前面的 Session 一样处理；

### Refresh Token 认证步骤解析：

- 客户端： 输入用户名和密码请求登录校验；
- 服务端： 收到请求，验证用户名与密码；验证成功后，服务端会签发一个 Access Token 和 Refresh Token 并返回给客户端；
- 客户端： 把 Access Token 和 Refresh Token 存储在本地；
- 客户端发送请求： 请求数据时，携带 Access Token 传输给服务端；
- 服务端：

验证 Access Token 有效：正常返回数据验证 Access Token 过期：拒绝请求

- 客户端 ( Access Token 已过期) ： 则重新传输 Refresh Token 给服务端；
- 服务端 ( Access Token 已过期) ： 验证 Refresh Token ，验证成功后返回新的 Access Token 给客户端；
- 客户端： 重新携带新的 Access Token 请求接口；

## JWT 鉴权原理

JWT 原理和 Session 大致相同，不同的点在于，JWT 生成的 Token 字符串需要客户端手动存储在 localStorage 或 sessionStorage 中。再次请求时，客户端需要将 Token 放在请求头的 Authorization 字段中。

在目前前后端分离的开发过程中，使用 token 鉴权机制用于身份验证是最常见的方案，流程如下：

- 服务器当验证用户账号和密码正确的时候，给用户颁发一个令牌，这个令牌作为后续用户访问一些接口的凭证
- 后续访问会根据这个令牌判断用户时候有权限进行访问

Token，分成了三部分，头部（Header）、载荷（Payload）、签名（Signature），并以 **.** 进行拼接。其中头部和载荷都是以 JSON 格式存放数据，只是进行了编码

## JWT 原理

JWT 全称 **JSON Web Token**，是一种基于 JSON 的数据对象，通过技术手段将**数据对象**签名为一个可以被验证和信任的令牌（Token）在客户端和服务端之间进行安全的传输。

JWT Token 由三部分组成：**header（头信息）**、**payload（消息体）**、**signature（签名）**，三部分之间用 **.** 链接，构成如下所示：

```js
// jwt 签名后生成的 token
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IuW8oOS4iSIsInBhc3N3b3JkIjoxMjM0NTYsImlhdCI6MTY2MTg2OTQxMX0.3-60HUf_cKIo44hWUviNzqdUoUGngGQfrqffg0A6uqM';
```

### header

Header 部分由 JSON 对象 **{ typ, alg }** 两部分构成，使用 **base64url(header)** 算法转为字符串：

typ：表示令牌类型，JWT 令牌统一写为 **JWT**

alg：签名算法，默认为 **HS256**，支持的算法为 ['RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512', 'HS256', 'HS384', 'HS512', 'none'] 上面的令牌 base64Url 解码后：

```JSON
{
  "typ": "JWT",
  "alg": "HS256"
}
```

### payload

Payload 为**消息体**，用来存储需要传输的数据，同样也是一个 JSON 对象使用**base64url**(payload) 算法转为字符串，JWT 提供了 7 个可选字段供选择，也可以自定义字段：

- iss (issuer)：签发人
- exp (expiration time)：过期时间
- sub (subject)：主题
- aud (audience)：受众
- nbf (Not Before)：生效时间
- iat (Issued At)：签发时间
- jti (JWT ID)：编号

```JSON
{
  "name": "andy",
  "exp": 1655897100,
  "age": 30
}
```

### signature

Signature 是对 Header、Payload 两部分数据按照指定的算法做了一个**签名**，防止数据被篡改。需要指定一个 **sceret** 私钥密码，产生签名的公式如下：

```JS
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secretKey
)

// or
Signature = HMACSHA256(base64Url(header)+ "." + base64Url(payload), secretKey)
```

> 因为有密码， 所以是安全的，这也是密码要保护好的原因

生成签名后，将 header.payload.signature 三部分链接在一起，形成一个令牌（token）返回给客户端。 一旦前面两部分数据被篡改，只要服务器加密用的密钥没有泄露，得到的签名肯定和之前的签名不一致

### 签名时使用了 secret，为什么是明文？

header、payload 部分是使用 **base64** 算法进行的编码，并没有被加密，自然也可以被解码。但注意这里的 base64 算法有点不一样的地方在于，token 可能会被放在 url query 中传输，URL 里面有三个特殊字符会被替换。下面是 JWT 中 base64url 的实现方式：

```js
// https://github1s.com/auth0/node-jws/blob/HEAD/lib/sign-stream.js#L9-L16
function base64url(string, encoding) {
  return Buffer.from(string, encoding)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}
```

### 数据会不会被篡改？

数据一旦被篡改，到服务端也会认证失败的，服务端在生成签名时有一个重要的参数是 secret，只要保证这个密钥不被泄漏，就没问题，就算篡改也是无效的。

### Nodejs 示例

在 Node.js 中使用 JWT 需要用到 jsonwebtoken 这个库，API 很简单，主要用到两个方法：

sign()：生成签名 verify()：验证签名

```js
const crypto = require('node:crypto');
const jwt = require('jsonwebtoken');

const secret = crypto.createHmac('sha256', 'abcdefg').update('').digest('hex');

const payload = {
  username: 'cpp',
  password: 123456,
  iat: Date.now(),
};
const token = jwt.sign(payload, secret);
const res = jwt.verify(token, secret);

console.log(token, 'token');

console.log(res, 'res');

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNwcCIsInBhc3N3b3JkIjoxMjM0NTYsImlhdCI6MTY2MjM4ODM3MjI2OH0.2bdmTQ4wd3yo3uVB6XyZjZedHEdNu-wSWxNqkLj3hwI token

// { username: 'cpp', password: 123456, iat: 1662388372268 } res
```

### 优缺点

JWT 由服务端生成可以**存储在客户端**，对服务端来说是无状态的，可扩展性好。

上文我们也讲了 JWT 中传输数据的 payload 默认是使用 base64 算法进行的编码，看似一串乱码，实则是没有加密，因此不要将涉及到安全、用户隐私的数据存放在 payload 中，如果要存放也请先自己进行加密。

一旦 token 泄漏，任何人都可以使用，为了减少 token 被盗用，尽可能的使用 HTTPS 协议传输，token 的过期时间也要设置的尽可能短。

防止数据被篡改，服务端密钥（secret）很重要，一定要保管好。

优点：

- json 具有通用性，所以可以跨语言
- 组成简单，字节占用小，便于传输
- 服务端无需保存会话信息，很容易进行水平扩展
- 一处生成，多处使用，可以在分布式系统中，解决单点登录问题
- 可防护 CSRF 攻击

缺点：

- payload 部分仅仅是进行简单编码，所以只能用于存储逻辑必需的非敏感信息
- 需要保护好加密密钥，一旦泄露后果不堪设想
- 为避免 token 被劫持，最好使用 https 协议
