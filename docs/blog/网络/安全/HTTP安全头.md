# <center>HTTP安全头</center>

## Content-Security-Policy

**内容安全策略**（CSP）常用来通过指定允许加载哪些资源来防止跨站点脚本攻击。在接下来所介绍的所有安全头信息中，CSP 可能是创建和维护花费时间最多的而且也是最容易出问题的。在配置你的网站 CSP 过程中，要小心彻底地测试它，因为阻止某些资源有可能会破坏你的网站的功能。

### 功能

CSP 的主要目标是减少和报告 XSS 攻击， XSS 攻击利用了浏览器对于从服务器所获取的内容的信任。使得恶意脚本有可能在用户的浏览器中执行，因为浏览器信任其内容来源，即使有时候这些脚本并非来自该站点的服务器当中。

CSP 通过指定允许浏览器加载和执行那些资源，使服务器管理者有能力减少或消除 XSS 攻击的可能性。一个 CSP 兼容的浏览器将会仅执行从白名单域获取得到的脚本文件，忽略所有其他的脚本（包括内联脚本）。

### 示例

一个最佳的 CSP 可能是下面这样(注释按照配置值的顺序)，在站点包含的每一部分资源请求相关都加入域名限制。

- 所有的内容(比如: JavaScript,image,css,fonts,ajax request, frams, html5 Media等)均来自和站点的同一个源（不包括其子域名）
- 允许加载当前源的图片和特定源图片
- 不允许 objects（比如 Flash 和 Java）
- 仅允许当前源的脚本下载和执行
- 仅允许当前源的 CSS 文件下载和执行
- 仅允许当前源的 frames
- 限制 `<base>` 标签中的 URL 与当前站点同源
- 仅允许表单提交到当前站点

```js
Content-Security-Policy: default-src 'self'; img-src 'self' https://img.com; object-src 'none'; 
script-src 'self'; style-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self';
```

## Strict-Transport-Security

Strict-Transport-Security(HSTS) 告诉浏览器该站点只能通过 HTTPS 访问，如果使用了子域，也建议对任何该站点的子域强制执行此操作。

### 功能

一个站点如果接受了一个 HTTP 请求，然后跳转到 HTTPS，用户可能在开始跳转前，通过没有加密的方式和服务器对话。这样就存在中间人攻击的潜在威胁，跳转过程可能被恶意网站利用来直接接触用户信息，而不是原来的加密信息。

网站通过HTTP Strict Transport Security通知浏览器，这个网站禁止使用HTTP方式加载，浏览器应该自动把所有尝试使用HTTP的请求自动替换为HTTPS请求。

### 示例

- 浏览器接受到这个请求后的 3600 秒内的时间，凡是访问这个域名下的请求都是用https请求
- 指定 includeSubDomains 此规则适用该站点下的所有子域名

```js
Strict-Transport-Security: max-age=3600; includeSubDomains
```

## X-Content-Type-Options

X-Content-Type-Options 响应头相当于一个提示标志，被服务器用户提示浏览器一定要遵循 Content-Type 头中 MIME 类型的设定，而不能对其进行修改。

### 功能

它减少了浏览器可能“猜测”某些内容不正确的意外应用程序行为，例如当开发人员将一个页面标记为“HTML”，但浏览器认为它看起来像JavaScript并试图将其呈现为JavaScript时。这个头将确保浏览器始终按照服务器设置的MIME类型来解析。

### 示例

```js
X-Content-Type-Options: nosniff
```

## Cache-Control

Cache-Control 通用消息头字段，被用于在 http 请求和响应中，通过指定指令来实现缓存机制。缓存指令是单向的，这意味着在请求中设置的指令，不一定被包含在响应中。

### 功能

这一个比其他的稍微复杂一些，因为你可能需要针对不同的内容类型使用不同的缓存策略。

任何包含有敏感信息的网页，例如用户个人信息页面或客户结帐页面，都应该设置为 no-cache。原因是防止共享计算机上的某人按下后退按钮或浏览历史并查看个人信息。

示例

```js
Cache-Control: no-cache
```


## X-Frame-Options

X-Frame-Options 响应头是用来给浏览器指示允许一个页面可否在 `<frame>`, `<iframe>`, `<embed>` 或者 `<object>` 中展现的标记。站点可以通过确保网站没有被嵌入到别人的站点里面，从而避免点击劫持攻击。

功能

如果恶意的站点将你的网页嵌入到 iframe 标签中, 在你不知道的情况下打开并点击恶意网站的某个按钮，恶意网站能够执行一个攻击通过运行一些 JavaScript 将捕获点击事件到 iframe 中,然后代表你与网站交互。

将 X-Frame-Options 设置为 deny 可以禁止该页面在任何域中的 ifram 标签中展示。

X-Frame-Options 设置可以由 CSP 的 frame-ancestors 配置所代替。

示例

```js
X-Frame-Options: DENY # 表示该页面不允许在 frame 中展示，即便是在相同域名的页面中嵌套也不允许。

X-Frame-Options: SAMEORIGIN # 表示该页面可以在相同域名页面的 frame 中展示。

X-Frame-Options: ALLOW-FROM uri # 表示该页面可以在指定来源的 frame 中展示。
```

## Access-Control-Allow-Origin

Access-Control-Allow-Origin 响应头指定了该响应的资源是否被允许与给定的 origin 共享。

### 功能

可以被用来可解决浏览器的跨域请求。

比如一个站点 A 页面中发起一个 AJAX 请求到 站点 B， A B 不同源。正常情况下因为浏览器的同源策略将不会把 B 的响应结果返回给 A, 除非 B 在响应头中设置允许 A 站点发起请求。

### 示例

```js
Access-Control-Allow-Origin: * # 允许所有域请求                  
Access-Control-Allow-Origin: http://someone.com # 允许特定域请求
```

## Set-Cookie

Set-Cookie 响应头被用来由服务器端向客户端发送 cookie。

### 示例

- domain: 指定 cookie 可以送达的域名，默认为当前域名（不包含子域名）
- Secure: 只有在 https 协议时才会被发送到服务端。然而，保密或敏感信息永远不要在 HTTP cookie 中存储或传输，因为整个机制从本质上来说都是不安全的
- HttpOnly: cookie 不能使用 JavaScript代码获取到

```js
Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>; Secure; HttpOnly
```

### X-XSS-Protection

X-XSS-Protection 响应头是Internet Explorer，Chrome和Safari的一个功能，当检测到跨站脚本攻击 (XSS)时，浏览器将停止加载页面。

### 示例

```js
X-XSS-Protection: 1; mode=block  # 启用XSS过滤。如果检测到 XSS 攻击，浏览器将不会清除页面，而是阻止页面加载。
```
