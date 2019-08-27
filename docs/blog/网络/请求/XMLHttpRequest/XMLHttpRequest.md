# <center>XMLHttpRequest</center>

基本用法:

```js
const xhr = new XMLHttpRequest();
xhr.open('GET', 'http://***', true); // 若设置false, 则为同步请求

xhr.onload = function (e) {
  if (this.status == 200) {
    console.log(this.response);
  }
}
xhr.send();

```

## 设置request header
在发送Ajax请求时,我们可能需要设置一些请求头部信息,比如`content-type、connection、cookie、accept-xxx`等。  
xhr提供了`setRequestHeader`来允许我们修改请求 header。

```js
void setRequestHeader(DOMString header, DOMString value);
```

- `setRequestHeader`方法的第一个参数不区分大小写;
- `setRequestHeader`方法要在`open()`和`send()`之间调用, 否则会报错;
- `setRequestHeader`方法可以多次调用, 最终的值不会采用覆盖override的方式, 而是采用追加append的方式。

## 获取response header
xhr提供了2个用来获取响应头部的方法: `getAllResponseHeaders`和`getResponseHeader`。前者是获取 response 中的所有header 字段, 后者只是获取某个指定 header 字段的值。另外, getResponseHeader(header)的header参数不区分大小写。

```js
DOMString getAllResponseHeaders();
DOMString getResponseHeader(DOMString header);
```
- [W3C的 xhr 标准](https://www.w3.org/TR/XMLHttpRequest/)中做了限制, 规定客户端无法获取 response 中的 Set-Cookie、Set-Cookie2这2个字段, 无论是同域还是跨域请求;
-  [W3C 的 cors 标准](https://www.w3.org/TR/cors/#access-control-allow-credentials-response-header)对于跨域请求也做了限制,规定对于跨域请求, 客户端允许获取的response header字段只限于“`simple response header`”和“`Access-Control-Expose-Headers`” ;

> "simple response header"包括的 header 字段有：Cache-Control,Content-Language,Content-Type,Expires,Last-Modified,Pragma;
"Access-Control-Expose-Headers"：首先得注意是"Access-Control-Expose-Headers"进行跨域请求时响应头部中的一个字段,对于同域请求,响应头部是没有这个字段的。这个字段中列举的 header 字段就是服务器允许暴露给客户端访问的字段。

## 指定xhr.response的数据类型

xhr中提供了两种方法:

- xhr.overrideMimeType()
- xhr.responseType

### xhr.overrideMimeType()

`overrideMimeType`是xhr level 1就有的方法, 所以浏览器兼容性良好。这个方法的作用就是用来重写response的content-type, 这样做有什么意义呢? 比如：server 端给客户端返回了一份document或者是 xml文档,我们希望最终通过`xhr.response`拿到的就是一个DOM对象, 那么就可以用`xhr.overrideMimeType('text/xml; charset = utf-8')`来实现。

### xhr.responseType
`responseType`是xhr level 2新增的属性, 用来指定xhr.response的数据类型, 目前还存在些兼容性问题, 

## 获取response数据

xhr提供了3个属性来获取请求返回的数据, 分别是：`xhr.response、xhr.responseText、xhr.responseXML`;

- xhr.response

	- 默认值：空字符串""

	- 当请求完成时,此属性才有正确的值

	- 请求未完成时,此属性的值可能是""或者 null,具体与 xhr.responseType有关：当responseType为""或"text"时,值为""；responseType为其他值时,值为 null

- xhr.responseText

	- 默认值为空字符串""

	- 只有当 responseType 为"text"、""时, xhr对象上才有此属性,此时才能调用xhr.responseText,否则抛错

	- 只有当请求成功时,才能拿到正确值。以下2种情况下值都为空字符串""：请求未完成、请求失败

- xhr.responseXML

	- 默认值为 null

	- 只有当 responseType 为"text"、""、"document"时,xhr对象上才有此属性,此时才能调用xhr.responseXML,否则抛错

	- 只有当请求成功且返回数据被正确解析时,才能拿到正确值。以下3种情况下值都为null：请求未完成、请求失败、请求成功但返回数据无法被正确解析时


## 追踪ajax请求状态
用`xhr.readyState`这个属性即可追踪到。这个属性是只读属性, 总共有5种可能值, 分别对应xhr不同的不同阶段。每次`xhr.readyState`的值发生变化时,都会触发`xhr.onreadystatechange`事件,我们可以在这个事件中进行相关状态判断。

| 值 | 状态 | 描述 |
| --- | --- | --- |
| 0	 | UNSENT (初始状态,未打开) |	此时xhr对象被成功构造,open()方法还未被调用|
|1	|OPENED (已打开,未发送)|	open()方法已被成功调用,send()方法还未被调用。注意：只有xhr处于OPENED状态,才能调用xhr.setRequestHeader()和xhr.send(),否则会报错|
|2	|HEADERS_RECEIVED (已获取响应头) |	send()方法已经被调用, 响应头和响应状态已经返回|
|3	|LOADING (正在下载响应体)|	响应体(response entity body)正在下载中,此状态下通过xhr.response可能已经有了响应数据|
|4|	DONE (整个数据传输过程结束)|	整个数据传输过程结束,不管本次请求是成功还是失败|

## 设置超时时间

```js
xhr.timeout
```

## 获取上传、下载进度

有时根据产品需求, 需要对上传或下载的文件显示实时进度, 这时我们可以通过 `onprogress` 事件来显示进度, 默认该事件每 50ms 触发一次. 

- 上传触发的是`xhr.upload`对象的`onprogress`事件
- 下载触发的是xhr对象的`onprogress`事件

```js
xhr.onprogress = updateProgress;
xhr.upload.onprogress = updateProgress;
function updateProgress(event) {
	if (event.lengthComputable) {
		  var completedPercent = event.loaded / event.total;
	}
}
```

## xhr.withCredentials与 CORS

> 我们都知道,在发同域请求时,浏览器会将cookie自动加在request header中。但大家是否遇到过这样的场景：在发送跨域请求时,cookie并没有自动加在request header中。


造成这个问题的原因是：在CORS标准中做了规定,默认情况下,浏览器在发送跨域请求时,不能发送任何认证信息（credentials）如"`cookies`"和"`HTTP authentication schemes`"。除非`xhr.withCredentials`为true（xhr对象有一个属性叫`withCredentials`,默认值为false）。

所以根本原因是cookies也是一种认证信息,在跨域请求中,client端必须手动设置`xhr.withCredentials=true`,且server端也必须允许request能携带认证信息（即response header中包含`Access-Control-Allow-Credentials:true`）,这样浏览器才会自动将cookie加在request header中。

另外,要特别注意一点,一旦跨域request能够携带认证信息,server端一定不能将`Access-Control-Allow-Origin`设置为*,而必须设置为请求页面的域名。


## xhr事件触发条件
|事件|	触发条件|
| --- | --- |
|onreadystatechange	|每当xhr.readyState改变时触发；但xhr.readyState由非0值变为0时不触发。|
|onloadstart|	调用xhr.send()方法后立即触发,若xhr.send()未被调用则不会触发此事件。|
|onprogress|	xhr.upload.onprogress在上传阶段(即xhr.send()之后,xhr.readystate=2之前)触发,每50ms触发一次；xhr.onprogress在下载阶段（即xhr.readystate=3时）触发,每50ms触发一次。|
|onload|	当请求成功完成时触发,此时xhr.readystate=4|
|onloadend|	当请求结束（包括请求成功和请求失败）时触发|
|onabort|	当调用xhr.abort()后触发|
|ontimeout|	xhr.timeout不等于0,由请求开始即onloadstart开始算起,当到达xhr.timeout所设置时间请求还未结束即onloadend,则触发此事件。|
|onerror|	在请求过程中,若发生Network error则会触发此事件（若发生Network error时,上传还没有结束,则会先触发xhr.upload.onerror,再触发xhr.onerror；若发生Network error时,上传已经结束,则只会触发xhr.onerror）。注意,只有发生了网络层级别的异常才会触发此事件,对于应用层级别的异常,如响应返回的xhr.statusCode是4xx时,并不属于Network error,所以不会触发onerror事件,而是会触发onload事件。|


### 触发顺序

- 触发`xhr.onreadystatechange` // 之后每次readyState变化时,都会触发一次

- 触发`xhr.onloadstart` // 上传阶段开始：

- 触发`xhr.upload.onloadstart`

- 触发`xhr.upload.onprogress`

- 触发`xhr.upload.onload`

- 触发`xhr.upload.onloadend` // 上传结束,下载阶段开始：

- 触发`xhr.onprogress`,

- 触发`xhr.onload`

- 触发`xhr.onloadend`


<Valine></Valine>