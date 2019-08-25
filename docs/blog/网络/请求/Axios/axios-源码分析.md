# <center>axios——源码分析</center>

## 请求流程

```js
axios.get('/get?name=xmz')
.then((response)=>{
    console.log('response', response)
})
.catch((error)=>{
    console.log('error', error)
})

```

在 `axios/lib/axios.js`找到`var axios`

```js
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);
axios.Axios = Axios;
```

再去`axios/lib/helps/bind.js`中 找到bind方法做了什么;

```js
module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};
```
由此可见, bind返回一个改变了this指向的函数, 然后去找axios.get属性;  
最终在`axios/lib/core/Axios.js`中的Axios.prototype上找到了:

```js
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});
```
然后继续去寻找 `Axios.prototype.request`的实现;

```js
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);
  config.method = config.method ? config.method.toLowerCase() : 'get';

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};
```
在request方法中, 返回一个promise, 通过while循环执行 dispatchRequest();  
然后继续到 axios/lib/core/dispatchRequest.js 中找`dispatchRequest`的实现;

```js
module.exports = function dispatchRequest(config) {
  ...
  // 对baseURL、headers、data数据进行处理
  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    // 对 response 返回数据进行处理

    return response;
  }, function onAdapterRejection(reason) {
    ...
  });
};
```
由此可见 adapter 是一个peomise 对象, 并且它执行了发送请求的方法;  
由于 `config.adapter ` 没有找到, 那么就去 axios/lib/default.js 中找 `defaults.adapter`;

```js
function getDefaultAdapter() {
  var adapter;
  // Only Node.JS has a process variable that is of [[Class]] process
  if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  } else if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  }
  return adapter;
}
```

由此可见, adapter提供了两种环境的请求方式(浏览器、node); 然后在 axios/lib/adapter/xhr.js 中实现了基于 `XMLHttpRequest` 的请求方式;



## 请求拦截
```js
axios.interceptors.request.use(function(config){
    // ...
    return config;
}, function(err){
    // ...
    return Promise.reject(err)
})
```


上文在 `Axios.prototype.request` 里调用了 `interceptors`

```js
this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
	chain.unshift(interceptor.fulfilled, interceptor.rejected);
});

this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
	chain.push(interceptor.fulfilled, interceptor.rejected);
});
```
那么我们去 `axios/lib/core/Axios.js`中找一下 `interceptors` 的实现:

```js
function Axios(instanceConfig) {
  ...
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}
```
我们发现 `interceptors` 返回两个由 `InterceptorManager` 实例化后的属性;  
进而我们去 `axios/lib/core/InterceptorManager.js` 中看下`InterceptorManager`这个构造函数;  

```js
function InterceptorManager() {
  this.handlers = [];
}

InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};
```
由此可见, `use()`是定义在InterceptorManager原型上的方法, 所以经过实例化后`interceptors`可以访问;  
这里的 `fulfilled、rejected` 就是上文提到的`interceptor.fulfilled、interceptor.rejected`:  

```js
	...
	chain.unshift(interceptor.fulfilled, interceptor.rejected);
	...
	chain.push(interceptor.fulfilled, interceptor.rejected);

```
那个 `this.interceptors.request.forEach、 this.interceptors.response.forEach` 就是去遍历 `handlers`数组, 然后把回调函数加到`chain`的首部.  

综上所述,  request拦截返回的promise就是我们发送请求后的promise, 发送请求之前先执行拦截器(interceptors)的`fulfilled、rejected`组成的promise, 这个promise执行完, 并且状态为resolve, 那么才会去执行`dispatchRequest(config)`, 否则就执行
reject并被axios.get().catch()捕获; 响应拦截同理, 只是将拦截器(interceptors)的`fulfilled、rejected`放在数组`chain`后面.

> interceptors.request -> request -> interceptors.response -> response



## 请求取消
```js
var CancelToken = axios.CancelToken;
var source = CancelToken.source();
axios.get('/get?name=xmz', {
    cancelToken : source.token
}).then((response)=>{
    console.log('response', response)
}).catch((error)=>{
    if(axios.isCancel(error)){
        console.log('取消请求传递的消息', error.message)
    }else{
        console.log('error', error)
    }
})
// 取消请求
source.cancel('取消请求传递这条消息');
```

在 `axios/lib/cancel/CancelToken.js`文件中看看这个source方法到底是干什么的?

```js
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};
```
CancelToken.source()方法就是返回一个具有token和cancel属性的对象, 但是token和cancel都是通过CancelToken这个构造函数来的，那么还在这个文件中向上看，找到CancelToken函数。

```js
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}
```
由此可以看出, `source.cancel`是一个函数, `source.token`是一个实例化对象;  
`source.cancel()`就是用来触发取消请求的函数; `cancel()`执行后, 给token添加一个`reason`属性;  
在`axios/lib/cancel/Cancel.js`文件中找到`Cancel`构造函数;

```js
function Cancel(message) {
  this.message = message;
}
```
由此可见, Cancel()就是给实例化对象添加一个message属性;  

然后执行`resolvePromise`函数, `token.promise` 由 未完成状态 变成 成功状态, 并将`token.reason`传入;  

然而这个cancelToken怎么实现的请求取消, 在 `axios/lib/adapters/xhr.js`中我们找到了:
```js
if (config.cancelToken) {
  // Handle cancellation
  config.cancelToken.promise.then(function onCanceled(cancel) {
    if (!request) {
      return;
    }

    request.abort();
    reject(cancel);
    // Clean up request
    request = null;
  });
}
```
进而看下触发请求取消执行`request.abort()`, 内部做了什么:

```js
request.onabort = function handleAbort() {
  if (!request) {
    return;
  }

  reject(createError('Request aborted', config, 'ECONNABORTED', request));

  // Clean up request
  request = null;
};
```

综上所述, 执行取消函数, 就是让`token.promise`变成成功状态; 在真正发起请求之前, 判断token的状态是否已经改变, 如果是就将request置为null, 从而实现取消请求;
















