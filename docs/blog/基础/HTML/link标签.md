# <center>link标签</center>

> HTML外部资源链接元素 (`<link>`) 规定了当前文档与外部资源的关系。该元素最常用于链接样式表，此外也可以被用来创建站点图标(比如PC端的“favicon”图标和移动设备上用以显示在主屏幕的图标) 。


## 用法

### 外部样式表
 ```
 <link href="main.css" rel="stylesheet">
 ```
`<link>` 使用了 href 属性设置外部资源的路径，并设置 rel 属性的值为“stylesheet”(样式表)。rel 表示“关系 (relationship) ”，它可能是<link>元素其中一个关键的特性——属性值表示<link>项的链接方式与包含它的文档之间的关系.


### 图标

```
// 网站图标
<link rel="icon" href="favicon.ico">

//移动平台上特殊的图标
<link rel="apple-touch-icon-precomposed" sizes="114x114"
      href="apple-icon-114.png" type="image/png">
```

sizes属性表示图标大小，type属性包含了链接资源的MIME类型。这些属性为浏览器选择最合适的图标提供了有用的提示。



### 设置媒体类型

```
<link href="print.css" rel="stylesheet" media="print">
<link href="mobile.css" rel="stylesheet" media="screen and (max-width: 600px)">

```

你也可以提供一个媒体类型，或者在media属性内部进行查询；这种资源将只在满足媒体条件的情况下才被加载进来。


### 设置CORS (跨域资源共享)

```
<link rel="preload" href="myFont.woff2" as="font"
      type="font/woff2" crossorigin="anonymous">
```

as属性表示获取特定的内容类。crossorigin属性表示该资源是否应该使用一个CORS请求来获取。

#### as
- audio: 音频文件
- document: 一个将要被嵌入到 `<frame>` 或 `<iframe>` 内部的 HTML 文档
- embed: 一个将要被嵌入到 `<embed>` 元素内部的资源
- fetch: 那些将要通过 fetch 和 XHR 请求来获取的资源，比如一个 - ArrayBuffer 或 JSON 文件
- font: 字体文件
- image: 图片文件
- object: 一个将会被嵌入到`<embed>`元素内的文件
- script: JavaScript 文件
- style: 样式表
- track: WebVTT 文件
- worker: 一个 JavaScript 的 web worker 或 shared worker
- video: 视频文件

#### crossorigin
此枚举属性指定在加载相关图片时是否必须使用 CORS. 启用 CORS 的图片 可以在 `<canvas>` 元素中使用, 并避免其被污染. 可取的值如下:

- anonymous

	会发起一个跨域请求(即包含 Origin: HTTP 头). 但不会发送任何认证信息 (即不发送 cookie, X.509 证书和 HTTP 基本认证信息). 如果服务器没有给出源站凭证 (不设置 Access-Control-Allow-Origin: HTTP 头), 这张图片就会被污染并限制使用.

- use-credentials	

	会发起一个带有认证信息 (发送 cookie, X.509 证书和 HTTP 基本认证信息) 的跨域请求 (即包含 Origin: HTTP 头). 如果服务器没有给出源站凭证 (不设置 Access-Control-Allow-Origin: HTTP 头), 这张图片就会被污染并限制使用.

当不设置此属性时, 资源将会不使用 CORS 加载 (即不发送 Origin: HTTP 头), 这将阻止其在 `<canvas>` 元素中进行使用. 若设置了非法的值, 则视为使用 anonymous.
### 

### 预操作

- dns-prefetch 型link提前对一个域名做dns查询,这样的link里面的
- preconnect型link 提前对一个服务器建立tcp链接
- prefetch型link提前取href指定的url的内容
- preload型link提前渲染href指定的url
- prerendner 型link提前渲染href 指定的url


#### DNS 预查询 (dns-prefetch)
提示浏览器应该预先进行 DNS 查询，这意味着当真正需要加载相关资源的时候已经预先完成了 DNS 查询，可以跳过这一步，直接向资源发起请求了。

```
<link rel="dns-prefetch" href="//example.com">
```
如果想要关闭 dns 预加载功能，可以使用 meta 标签：

```
<meta http-equiv="x-dns-prefetch-control" content="off">
```

#### 预连接 (preconnect)


我们访问一个站点时，浏览器建立连接，一般都会经过以下的步骤：

- DNS解析
- TCP握手
- 如果为Https站点，会进行TLS握手

这些过程都是需要相当的耗时的，dns-prefetch 预先进行了 dns 查找的步骤，而 preconnet 则进一步提前进行了握手的过程，当真正需要加载资源时，不需要再建立连接了，可以直接开始请求数据。

```
<link rel="preconnect" href="//example.com">
```

#### 预拉取 (prefetch)
通知浏览器进行预加载资源常见的资源包括图片、脚本、样式、HTML等，当用户跳转到其他页面时，可以减少资源的加载时间。但是注意，具体加载时间和是否加载是由浏览器决定的。

```
<link rel="prefetch" href="//example.com">
```
**资源虽然加载了但是并不会被解析，脚本也不会被执行。** 
 
此时，link 标签可以接受一个 as 属性，它指定了文件内容的类型，表示资源请求的优先级。

这是另一个预获取方式，这种方式指定的预获取资源具有最高的优先级，在所有 prefetch 项之前进行:

```
<link rel="subresource" href="styles.css">
```

#### 预加载 (preload)


```
<link rel="preload" href="//example.com" as="script">
```

preload 使用 as 指定预加载的内容的类型，将使得浏览器能够: 

- 更精确地优化资源加载优先级
- 匹配未来的加载需求，在适当的情况下，重复利用同一资源
- 为资源应用正确的内容安全策略
- 为资源设置正确的 Accept 请求头


###### 正确使用 preload/prefetch 不会造成二次下载

**当页面上使用到这个资源时候 preload 资源还没下载完，这时候不会造成二次下载，会等待第一次下载并执行脚本。**

**对于 preload 来说，一旦页面关闭了，它就会立即停止 preload 获取资源，而对于 prefetch 资源，即使页面关闭，prefetch 发起的请求仍会进行不会中断。**

###### 什么情况会导致二次获取
- 不要将 preload 和 prefetch 进行混用，它们分别适用于不同的场景，对于同一个资源同时使用 preload 和 prefetch 会造成二次的下载。
- preload 字体不带 crossorigin 也将会二次获取！ 确保你对 preload 的字体添加 crossorigin 属性，否则他会被下载两次，这个请求使用匿名的跨域模式。这个建议也适用于字体文件在相同域名下，也适用于其他域名的获取(比如说默认的异步获取)。


#### 预渲染 (prerender)

这个属性更进一步的，建议浏览器提前获取指定链接的资源，并且它还在预先在屏幕外渲染内容，以便在需要的时候可以快速呈现出来。

```
<link rel="prerender" href="//example.com">
```

chrome 地址栏实际上就进行了 prerender 的操作。


<Valine></Valine>