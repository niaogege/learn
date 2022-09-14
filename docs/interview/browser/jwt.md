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

## 参考大佬

[Web 安全 - 同事告诉我 JWT 是明文的...](https://mp.weixin.qq.com/s/eVaHk_YVxtmNs470p02I2g)

## JWT 原理

JWT 全称 **JSON Web Token**，是一种基于 JSON 的数据对象，通过技术手段将**数据对象**签名为一个可以被验证和信任的令牌（Token）在客户端和服务端之间进行安全的传输。

JWT Token 由三部分组成：**header（头信息）**、**payload（消息体）**、**signature（签名）**，之间用 **.** 链接，构成如下所示：

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

iss (issuer)：签发人 exp (expiration time)：过期时间 sub (subject)：主题 aud (audience)：受众 nbf (Not Before)：生效时间 iat (Issued At)：签发时间 jti (JWT ID)：编号

```JSON
{
  "name": "andy",
  "exp": 1655897100,
  "age": 30
}
```

### signature

Signature 是对 Header、Payload 两部分数据按照指定的算法做了一个**签名**，防止数据被篡改。需要指定一个 sceret 私钥密码，产生签名的公式如下：

```JSON
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  your-256-bit-secret
)
```

> 因为有密码， 所以是安全的，这也是密码要保护好的原因

生成签名后，将 header.payload.signature 三部分链接在一起，形成一个令牌（token）返回给客户端。

### 签名时使用了 secret，为什么是明文？

header、payload 部分是使用 base64 算法进行的编码，并没有被加密，自然也可以被解码。但注意这里的 base64 算法有点不一样的地方在于，token 可能会被放在 url query 中传输，URL 里面有三个特殊字符会被替换。下面是 JWT 中 base64url 的实现方式：

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

### 总结

JWT 由服务端生成可以**存储在客户端**，对服务端来说是无状态的，可扩展性好。

上文我们也讲了 JWT 中传输数据的 payload 默认是使用 base64 算法进行的编码，看似一串乱码，实则是没有加密，因此不要将涉及到安全、用户隐私的数据存放在 payload 中，如果要存放也请先自己进行加密。

一旦 token 泄漏，任何人都可以使用，为了减少 token 被盗用，尽可能的使用 HTTPS 协议传输，token 的过期时间也要设置的尽可能短。

防止数据被篡改，服务端密钥（secret）很重要，一定要保管好。
