(window.webpackJsonp=window.webpackJsonp||[]).push([[45],{472:function(t,s,r){"use strict";r.r(s);var a=r(43),e=Object(a.a)({},(function(){var t=this,s=t.$createElement,r=t._self._c||s;return r("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[r("h1",{attrs:{id:"内容安全策略"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#内容安全策略"}},[t._v("#")]),t._v(" "),r("center",[t._v("内容安全策略")])],1),t._v(" "),r("blockquote",[r("p",[t._v("内容安全策略   (CSP) 是一个额外的安全层，用于检测并削弱某些特定类型的攻击，包括跨站脚本 (XSS) 和数据注入攻击等。无论是数据盗取、网站内容污染还是散发恶意软件，这些攻击都是主要的手段。")])]),t._v(" "),r("h2",{attrs:{id:"原理"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#原理"}},[t._v("#")]),t._v(" 原理")]),t._v(" "),r("p",[t._v("CSP 通过告诉浏览器一系列规则，严格规定页面中哪些资源允许有哪些来源， 不在指定范围内的统统拒绝。相比同源策略，CSP 可以说是很严格了。")]),t._v(" "),r("p",[t._v("其实施有两种途径：")]),t._v(" "),r("ul",[r("li",[t._v("服务器添加 Content-Security-Policy 响应头来指定规则")]),t._v(" "),r("li",[t._v("HTML 中添加 标签来指定 Content-Security-Policy 规则")])]),t._v(" "),r("p",[t._v("CSP 规则")]),t._v(" "),r("p",[t._v("无论是 header 中还是 ")]),r("meta"),t._v(" 标签中指定，其值的格式都是统一的，由一系列 CSP 指令（directive）组合而成。"),r("p"),t._v(" "),r("div",{staticClass:"language-js extra-class"},[r("pre",{pre:!0,attrs:{class:"language-js"}},[r("code",[t._v("Content"),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("Security"),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("Policy"),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("policy"),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("directive"),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("policy"),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("directive"),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n")])])]),r("p",[t._v("这里 directive，即指令，是 CSP 规范中规定用以详细详述某种资源的来源，比如前面示例中使用的 script-src，指定脚本可以有哪些合法来源，img-src 则指定图片，以下是常用指令：")]),t._v(" "),r("ul",[r("li",[r("strong",[t._v("base-uri")]),t._v(" 限制可出现在页面 "),r("base"),t._v(" 标签中的链接。")]),t._v(" "),r("li",[r("strong",[t._v("child-src")]),t._v(" 列出可用于 worker 及以 frame 形式嵌入的链接。 譬如: child-src https://youtube.com 表示只能从 Youtube 嵌入视频资源。")]),t._v(" "),r("li",[r("strong",[t._v("connect-src")]),t._v(" 可发起连接的地址 (通过 XHR, WebSockets 或 EventSource)。")]),t._v(" "),r("li",[r("strong",[t._v("font-src")]),t._v(" 字体来源。譬如，要使用 Google web fonts 则需要添加 font-src https://themes.googleusercontent.com 规则。")]),t._v(" "),r("li",[r("strong",[t._v("form-action")]),t._v(" "),r("form",[t._v(" 标签可提交的地址。")])]),t._v(" "),r("li",[r("strong",[t._v("frame-ancestors")]),t._v(" 当前页面可被哪些来源所嵌入（与 child-src 正好相反）。作用于 frame, iframe, embed 及 applet。 该指令不能通过 "),r("meta"),t._v(" 指定且只对非 HTML文档类型的资源生效。")]),t._v(" "),r("li",[r("strong",[t._v("frame-src")]),t._v(" 该指令已在 level 2 中废弃但会在 level 3 中恢复使用。未指定的情况下回退到 tochild-src 指令。")]),t._v(" "),r("li",[r("strong",[t._v("img-src")]),t._v(" 指定图片来源。")]),t._v(" "),r("li",[r("strong",[t._v("media-src")]),t._v(" 限制音视频资源的来源。")]),t._v(" "),r("li",[r("strong",[t._v("object-src")]),t._v(" Flash 及其他插件的来源。")]),t._v(" "),r("li",[r("strong",[t._v("plugin-types")]),t._v(" 限制页面中可加载的插件类型。")]),t._v(" "),r("li",[r("strong",[t._v("report-uri")]),t._v(" 指定一个可接收 CSP 报告的地址，浏览器会在相应指令不通过时发送报告。不能通过 "),r("meta"),t._v(" 标签来指定。")]),t._v(" "),r("li",[r("strong",[t._v("style-src")]),t._v(" 限制样式文件的来源。")]),t._v(" "),r("li",[r("strong",[t._v("upgrade-insecure-requests")]),t._v(" 指导客户端将页面地址重写，HTTP 转 HTTPS。用于站点中有大量旧地址需要重定向的情形。")]),t._v(" "),r("li",[r("strong",[t._v("worker-src")]),t._v(" CSP Level 3 中的指令，规定可用于 worker, shared worker, 或 service worker 中的地址。")])]),t._v(" "),r("table",[r("thead",[r("tr",[r("th",[t._v("指令名")]),t._v(" "),r("th",[t._v("demo")]),t._v(" "),r("th",[t._v("说明")])])]),t._v(" "),r("tbody",[r("tr",[r("td",[t._v("default-src")]),t._v(" "),r("td",[t._v("'self' cdn.example.com")]),t._v(" "),r("td",[t._v("默认策略,可以应用于js文件/图片/css/ajax请求等所有访问")])]),t._v(" "),r("tr",[r("td",[t._v("script-src")]),t._v(" "),r("td",[t._v("'self' js.example.com")]),t._v(" "),r("td",[t._v("定义js文件的过滤策略")])]),t._v(" "),r("tr",[r("td",[t._v("style-src")]),t._v(" "),r("td",[t._v("'self' css.example.com")]),t._v(" "),r("td",[t._v("定义css文件的过滤策略")])]),t._v(" "),r("tr",[r("td",[t._v("img-src")]),t._v(" "),r("td",[t._v("'self' img.example.com")]),t._v(" "),r("td",[t._v("定义图片文件的过滤策略")])]),t._v(" "),r("tr",[r("td",[t._v("connect-src")]),t._v(" "),r("td",[t._v("'self'")]),t._v(" "),r("td",[t._v("定义请求连接文件的过滤策略")])]),t._v(" "),r("tr",[r("td",[t._v("font-src")]),t._v(" "),r("td",[t._v("font.example.com")]),t._v(" "),r("td",[t._v("定义字体文件的过滤策略")])]),t._v(" "),r("tr",[r("td",[t._v("object-src")]),t._v(" "),r("td",[t._v("'self'")]),t._v(" "),r("td",[t._v("定义页面插件的过滤策略,如 "),r("object",[t._v(", "),r("embed"),t._v(" 或者"),r("applet",[t._v("等元素")])],1)])]),t._v(" "),r("tr",[r("td",[t._v("media-src")]),t._v(" "),r("td",[t._v("media.example.com")]),t._v(" "),r("td",[t._v("定义媒体的过滤策略,如 HTML6的 "),r("audio",[t._v(", "),r("video",[t._v("等元素")])])])]),t._v(" "),r("tr",[r("td",[t._v("frame-src")]),t._v(" "),r("td",[t._v("'self'")]),t._v(" "),r("td",[t._v("定义加载子frmae的策略")])]),t._v(" "),r("tr",[r("td",[t._v("sandbox")]),t._v(" "),r("td",[t._v("allow-forms allow-scripts")]),t._v(" "),r("td",[t._v("沙盒模式,会阻止页面弹窗/js执行等,你可以通过添加allow-forms allow-same-origin allow-scripts allow-popups, allow-modals, allow-orientation-lock, allow-pointer-lock, allow-presentation, allow-popups-to-escape-sandbox, and allow-top-navigation 策略来放开相应的操作")])]),t._v(" "),r("tr",[r("td",[t._v("report-uri")]),t._v(" "),r("td",[t._v("/some-report-uri")]),t._v(" "),r("td")])])]),t._v(" "),r("blockquote",[r("p",[r("strong",[t._v("child-src")]),t._v(" 与 "),r("strong",[t._v("frame-ancestors")]),t._v(" 看起来比较像。前者规定的是页面中可加载哪些 iframe，后者规定谁可以以 iframe 加载本页。 比如来自不同站点的两个网页 A 与 B，B，B 中有 iframe 加载了 A。那么")])]),t._v(" "),r("blockquote",[r("p",[t._v("A 的 frame-ancestors 需要包含 B"),r("br"),t._v("\nB 的 child-src 需要包含 A")])]),t._v(" "),r("h2",{attrs:{id:"nonce"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#nonce"}},[t._v("#")]),t._v(" nonce")]),t._v(" "),r("p",[t._v("CSP2开始支持nonce-来解决Inline JavaScript的问题，在HTTP Header中声明一个随机字符串，在HTML中的JavaScript标签上带了nonce属性，nonce的值和Header指定的一致才会执行对应的JavaScript代码。")]),t._v(" "),r("p",[t._v("通常nonce是由服务器生成的一个随机数，在客户端第一次请求页面时将其发回客户端；客户端拿到这个nonce，将其与用户密码串联在一起并进行非可逆加密（MD5、SHA1等等），然后将这个加密后的字符串和用户名、nonce、加密算法名称一起发回服务器；服务器使用接收到的用户名到数据库搜索密码，然后跟客户端使用同样的算法对其进行加密，接着将其与客户端提交上来的加密字符串进行比较，如果两个字符串一致就表示用户身份有效。这样就解决了用户密码明文被窃取的问题，攻击者就算知道了算法名和nonce也无法解密出密码。")]),t._v(" "),r("p",[t._v("举个例子:")]),t._v(" "),r("div",{staticClass:"language-js extra-class"},[r("pre",{pre:!0,attrs:{class:"language-js"}},[r("code",[r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("!")]),r("span",{pre:!0,attrs:{class:"token constant"}},[t._v("DOCTYPE")]),t._v(" html"),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n"),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("html"),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n"),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("title"),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("Hello "),r("span",{pre:!0,attrs:{class:"token constant"}},[t._v("CSP2")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("title"),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n\n"),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("script nonce"),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),r("span",{pre:!0,attrs:{class:"token string"}},[t._v('"abc"')]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("document"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),r("span",{pre:!0,attrs:{class:"token function"}},[t._v("write")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),r("span",{pre:!0,attrs:{class:"token string"}},[t._v('"abc"')]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("script"),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n\n"),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("script nonce"),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),r("span",{pre:!0,attrs:{class:"token string"}},[t._v('"def"')]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("document"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),r("span",{pre:!0,attrs:{class:"token function"}},[t._v("write")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),r("span",{pre:!0,attrs:{class:"token string"}},[t._v('"def"')]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("script"),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n\n"),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("html"),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n")])])]),r("p",[t._v("在返回的html的响应头中声明csp的nonce属性:")]),t._v(" "),r("div",{staticClass:"language-js extra-class"},[r("pre",{pre:!0,attrs:{class:"language-js"}},[r("code",[t._v("Content"),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("security"),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("policy"),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("'nonce-abc'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),r("p",[t._v("这时候我们加载页面，发现页面中只打印了abc，通过注入nonce，从根本上杜绝了inline-script造成xss的可能, 但是csp的实现成本还是不小的，它需要解析网站内部的script标签，可能会带来一些额外的模板引擎的性能成本。")]),t._v(" "),r("Valine")],1)}),[],!1,null,null,null);s.default=e.exports}}]);