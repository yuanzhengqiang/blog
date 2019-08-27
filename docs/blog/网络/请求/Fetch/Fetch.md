# <center>Fetch</center>

```js
fetch('http://****')
  .then((res) => {return res.json()})
  .then((res) => {
  	console.log(res)
  })
  .catch((err) => {
  	console.log(err)
  })
```

>Fetch API 是近年来被提及将要取代 XHR 的技术新标准，是一个 HTML5 的 API。

>Fetch 并不是 XHR 的升级版本，而是从一个全新的角度来思考的一种设计。Fetch 是基于 Promise 语法结构，而且它的设计足够低阶，这表示它可以在实际需求中进行更多的弹性设计。对于 XHR 所提供的能力来说，Fetch 已经足够取代 XHR ，并且提供了更多拓展的可能性。


fetch 方法有两种调用方式:

- fetch(String url, [, Object options]) // 第一个参数是一个 url，第二个参数是配置信息(可选).
- fetch(Request req, [, Object options]) // 第一个参数是一个 Request 对象，第二个参数是配置信息(可选).


可选配置信息是一个 Object 对象，可以包含以下字段：

- method: 请求的方法，例如：GET, POST。
- headers: 请求头部信息，可以是一个简单的对象，也可以是 Headers 类实例化的一个对象。
- body: 需要发送的信息内容，可以是 Blob, BufferSource, FormData, URLSearchParams 或者 USVString。注意，GET, HEAD方法不能包含body。
- mode: 请求模式，分别有 cors, no-cors, same-origin, navigate 这几个可选值。
	- cors: 允许跨域，要求响应中 Acess-Control-Allow-Origin 这样的头部表示允许跨域。
	- no-cors: 只允许使用 HEAD, GET, POST方法。
	- same-origin: 只允许同源请求，否则直接报错。
	- navigate: 支持页面导航。
- credentials: 表示是否发送cookie，有三个选项
	- omit: 不发送cookie。
	- same-origin: 仅在同源时发送cookie。
	- include: 发送cookie。
- cache: 表示处理缓存的策略。
- redirect: 表示发生重定向时，有三个选项
	- follow: 跟随。
	- error: 发生错误。
	- manual: 需要用户手动跟随。
- integrity: 包含一个用于验证资资源完整性的字符串。


## 设置 Headers

fetch提供了 `Headers()` 构造函数来设置headers.

```js
const headers = new Headers({
  "Content-Type": "application/json; charset=utf-8",
  "Content-Length": content.length.toString()
});
headers.append("X-Custom-Header", "AnotherValue");
headers.has("Content-Type") // true
```

## 设置 Request
fetch提供了 `Request()` 构造函数来设置请求内容.

```js
const URL = 'api.***.com';
const headers = new Headers({
  "Content-Type": "application/json; charset=utf-8",
  "Content-Length": content.length.toString()
});
const getReq = new Request(URL, {method: 'GET', headers: headers});
fetch(getReq).then((res) => {
  return res.json();
}).catch((err) => {
  console.log('Fetch Error: ', err);
});
```

## 获取 Response

Response 实例是在fentch()处理完promises之后返回的。它的实例也可用通过JavaScript来创建，但只有在ServiceWorkers中才真正有用。

```js
const res = new Response(body, init);
```

- body 可以是 `Bolb`, `BufferSource`, `FormData`, `URLSearchParams`, `USVString` 这些类型的值;  
- init 是一个对象，可以包括以下这些字段

- status: 响应状态码
- statusText: 状态信息
- headers: 头部信息，可以是对象或者Headers实例



Response 实例提供了以下实例属性，均是只读属性。

- bodyUsed: 用于表示响应内容是否被使用过
- headers: 头部信息
- ok: 表明请求是否成功，响应状态为 200 ~ 299 时，值为 true
- status: 状态码
- statusText: 状态信息
- type: 响应类型
	- basic: 同源
	- cors: 跨域
	- error: 出错
	- opaque: Request mode 设置为 “no-cors”的响应
- url: 响应地址



Response 实例提供以下实例方法。

- clone: 复制一个响应对象。
- arrayBuffer: 将响应数据转换为 arrayBuffer 后 reslove 。
- bolb: 把响应数据转换为 Bolb 后 reslove 。
- formData: 把响应数据转换为 formData 后 reslove 。
- json: 把响应内容解析为对象后 reslove 。
- text: 把响应数据当做字符串后 reslove 。





<Valine></Valine>