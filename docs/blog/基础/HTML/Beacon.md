# <center>Beacon API</center>

Beacon 它的初衷更多的情况是用于做前端埋点，监控用户活动。

## 语法

`navigator.sendBeacon(url, data);`  

>url 参数表明 data 将要被发送到的网络地址  POST 请求。  

>data 参数是将要发送的 ArrayBufferView 或 Blob, DOMString 或者 FormData 类型的数据。

>返回值 当用户代理成功把数据加入传输队列时，sendBeacon() 方法将会返回 true，否则返回 false。

### 举个例子:

```js
let result = navigator.sendBeacon('/***', data);
if (result) { 
  console.log('成功');
} else {
  console.log('失败');
}
```

### 浏览器支持:
浏览器支持：Edge：14+，Firefox：31+，Chrome：39+，Opera：26+，IE：不支持。  
虽然现在浏览器对sendBeacon的支持很好，我们对其做一下兼容性处理也是有必要的：  

```js
if (navigator.sendBeacon) {
  // Beacon 请求
} else {
 // 使用 XHR同步请求
}
```