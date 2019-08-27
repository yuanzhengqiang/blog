# <center>Vue Router</center>

> Vue Router 是 Vue.js 官方的路由管理器。它和 Vue.js 的核心深度集成，让构建单页面应用变得易如反掌。包含的功能有：
>
- 嵌套的路由/视图表
- 模块化的、基于组件的路由配置
- 路由参数、查询、通配符
- 基于 Vue.js 过渡系统的视图过渡效果
- 细粒度的导航控制
- 带有自动激活的 CSS class 的链接
- HTML5 历史模式或 hash 模式，在 IE9 中自动降级
- 自定义的滚动条行为


在 `vue-router.js`中给了三种模式可供选择:

- hash模式 (默认)
- history模式
- abstract模式 (node)


## 简单实现

通常我们在单页面中使用 `hash` 或者 `history` 模式进行开发, 前端路由实现原理本质上就是监听URL的变化, 然后匹配路有规则进行响应的页面展示, 下面对两种模式进行一个简单实现:

### hash 模式

```js
...

<ul>
	<li><a href="#hash1">hash1</a></li>
	<li><a href="#hash2">hash2</a></li>
</ul>
<div id='routerView'></div>
...

window.addEventListener('DOMContentLoaded', onLoad);
window.addEventListener('hashchange', onHashChange);

let routerView = '';

function onLoad() {
  routerView = document.querySelector('#routerView');
  onHashChange();
}

function onHashChange() {
  switch (location.hash) {
    case '#hash1': 
      routerView.innerHTML = 'hash1'
      return
    case '#hash2': 
      routerView.innerHTML = 'hash2'
      return
    default:
      return
 } 
}

```

### history 模式

```js
...

<ul>
	<li><a href="/hash1">hash1</a></li>
	<li><a href="/hash2">hash2</a></li>
</ul>
<div id='routerView'></div>
...


window.addEventListener('DOMContentLoaded', onLoad);
window.addEventListener('popstate', onPopState);
let defaultPathname = location.pathname
let routerView = '';

function onLoad() {
  routerView = document.querySelector('#routerView');
  onPopState();

  let linkList = document.querySelectorAll('a');
  linkList.forEach( el => el.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    window.history.pushState(null, '', defaultPathname + el.getAttribute('href'));
    onPopState();
  }))
}

function onPopState() {
  switch (location.pathname) {
    case '/hash1': 
      routerView.innerHTML = 'hash1'
      return
    case '/hash2': 
      routerView.innerHTML = 'hash2'
      return
    default:
      return
  } 
}

```

## 源码解析

### 路由注册
我们知道在使用路由的时候, 需要先调用 `Vue.use(VueRouter)` 才可以, 为了让插件可以使用vue:

在 **vue** 源码中:

```js
function initUse (Vue) {
    Vue.use = function (plugin) {
      // 判断是否已经安装过
      var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
      if (installedPlugins.indexOf(plugin) > -1) {
        return this
      }

      // additional parameters
      var args = toArray(arguments, 1);
      
      // 插入vue
      args.unshift(this);
      if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args);
      } else if (typeof plugin === 'function') {
        plugin.apply(null, args);
      }
      installedPlugins.push(plugin);
      return this
    };
}
```

接下来看 **vue-router** 源码的 `install` 函数实现:


```js
var _Vue;

function install (Vue) {
  // 判断是否安装过
  if (install.installed && _Vue === Vue) { return }
  install.installed = true;

  _Vue = Vue;

  var isDef = function (v) { return v !== undefined; };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };
	
  // 在 vue 的 beforeCreate 中初始化路由
  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (isDef(this.$options.router)) {
        // 将自己设为根路由
        this._routerRoot = this;
        this._router = this.$options.router;
        // 初始化路由
        this._router.init(this);
        
        // 为 '_route' 属性实现双向绑定, 触发组件渲染
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        // 用于 router-view 层级判断
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });
  
  将 '$router' 和 '$route' 添加到 vue 原型链上
  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this._routerRoot._router }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get () { return this._routerRoot._route }
  });
	
  // 全局注册组件 router-link 和 router-view
  Vue.component('RouterView', View);
  Vue.component('RouterLink', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
}

```

在 `install` 函数中, 核心就是给组件混入钩子函数和全局注册两个路由组件.

### VueRouter 实例化

在 `Vue.use(VueRouter)` 后, 就可以对 `VueRouter` 进行实例化了:

```js
const Home = { template: '<div>home</div>' }
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 3. Create the router
const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes: [
    { path: '/', component: Home }, // all paths are defined without the hash.
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
  ]
})
```

接下来看下 `VueRouter` 的构造函数:

```js
var VueRouter = function VueRouter (options) {
  if ( options === void 0 ) options = {};

  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.resolveHooks = [];
  this.afterHooks = [];
  
  // 路由匹配对象
  this.matcher = createMatcher(options.routes || [], this);
	
  // 根据 mode 选择不同的路由模式, 默认为 hash 模式
  var mode = options.mode || 'hash';
  
  // 判断当前环境如果不支持 history 模式, 就改为 hash 模式
  this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;
  if (this.fallback) {
    mode = 'hash';
  }
  
  // 不在浏览器环境下就使用 abstract 模式
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break
    default:
      {
        assert(false, ("invalid mode: " + mode));
      }
  }
};
```
`VueRouter` 函数实例化的过程, 核心是创建一个路由匹配对象，并且根据 mode 来采取不同的路由方式.

### 创建路由匹配对象

```js
function createMatcher ( routes, router ) {
  // 创建路由映射表
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  function match (
    raw,
    currentRoute,
    redirectedFrom
  ) {
  	 var location = normalizeLocation(raw, currentRoute, false, router);
    var name = location.name;
    
    ...    
    
    return _createRoute(null, location)
  }

  ...
  return {
    match: match,
    addRoutes: addRoutes
  }
}
```
`createMatcher` 函数的作用就是创建路由映射表, 然后通过闭包的方式让 `addRoutes` 和 `match` 函数能够使用路由映射表的几个对象，最后返回一个 **Matcher** 对象.

接下来看下 `createRouteMap` 函数创建映射表的实现:

```js
function createRouteMap ( routes, oldPathList, oldPathMap, oldNameMap ) {

  // 创建映射表
  // the path list is used to control path matching priority
  var pathList = oldPathList || [];
  // $flow-disable-line
  var pathMap = oldPathMap || Object.create(null);
  // $flow-disable-line
  var nameMap = oldNameMap || Object.create(null);
  
  // 遍历路由配置，为每个配置添加路由记录
  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // 确保通配符在最后
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  }
}

// 添加路由记录
function addRouteRecord ( pathList, pathMap, nameMap, route, parent, matchAs ) {
  // 获取路由配置下的属性
  var path = route.path;
  var name = route.name;
  {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(
      typeof route.component !== 'string',
      "route config \"component\" for path: " + (String(path || name)) + " cannot be a " +
      "string id. Use an actual component instead."
    );
  }

  var pathToRegexpOptions = route.pathToRegexpOptions || {};
  
  // 格式化url , 替换 /
  var normalizedPath = normalizePath(
    path,
    parent,
    pathToRegexpOptions.strict
  );

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive;
  }
  
  // 生成记录对象
  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props: route.props == null
      ? {}
      : route.components
        ? route.props
        : { default: route.props }
  };

  if (route.children) {
    // Warn if route is named, does not redirect and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    {
      if (route.name && !route.redirect && route.children.some(function (child) { return /^\/?$/.test(child.path); })) {
        warn(
          false,
          "Named Route '" + (route.name) + "' has a default child route. " +
          "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " +
          "the default child route will not be rendered. Remove the name from " +
          "this route and use the name of the default child route for named " +
          "links instead."
        );
      }
    }
    
    // 递归遍历路由配置的 children 属性, 添加路由记录
    route.children.forEach(function (child) {
      var childMatchAs = matchAs
        ? cleanPath((matchAs + "/" + (child.path)))
        : undefined;
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
    });
  }
	
  // 判断路由有别名的话, 也添加到路由记录里
  if (route.alias !== undefined) {
    var aliases = Array.isArray(route.alias)
      ? route.alias
      : [route.alias];

    aliases.forEach(function (alias) {
      var aliasRoute = {
        path: alias,
        children: route.children
      };
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/' // matchAs
      );
    });
  }
	
  // 更新映射表
  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }
	
  // 为命名路由添加记录
  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if ("development" !== 'production' && !matchAs) {
      warn(
        false,
        "Duplicate named routes definition: " +
        "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
      );
    }
  }
}
```

创建理由匹配对象, 核心就是通过用户配置的路由规则来创建对应的路由映射表.

### 路由初始化

当组件调用 `beforeCreate` 函数时, 会执行路由初始化的方法 `this._router.init()`, 接下来看下 `init` 的实现:

```js
VueRouter.prototype.init = function init (app /* Vue component instance */) {
    var this$1 = this;

  "development" !== 'production' && assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
  );

  // 保存组件实例
  this.apps.push(app);

  // set up app destroyed handler
  // https://github.com/vuejs/vue-router/issues/2639
  app.$once('hook:destroyed', function () {
    // clean out app from this.apps array once destroyed
    var index = this$1.apps.indexOf(app);
    if (index > -1) { this$1.apps.splice(index, 1); }
    // ensure we still have a main app or null if no apps
    // we do not release the router so it can be reused
    if (this$1.app === app) { this$1.app = this$1.apps[0] || null; }
  });

  // main app previously initialized
  // return as we don't need to set up new history listener
  if (this.app) {
    return
  }

  this.app = app;
	
  // 设置路由模式
  var history = this.history;
	
  // 判断模式并添加事件监听
  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation());
  } else if (history instanceof HashHistory) {
    var setupHashListener = function () {
      history.setupListeners();
    };
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    );
  }
	
  // 该回调会在 transitionTo 中调用
  // 对组件的 _route 属性进行赋值，触发组件渲染
  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};
```
在路由初始化时, 核心就是进行路由的跳转，改变 URL 然后渲染对应的组件. 

### 路由跳转

接下来看下路由跳转的实现:

```js
History.prototype.transitionTo = function transitionTo (location, onComplete, onAbort) {
    var this$1 = this;

  // 获取对应的路由信息
  var route = this.router.match(location, this.current);
  
  // 确认切换路由
  this.confirmTransition(route, function () {
  
    // 更新路由信息, 对组件的 _route 属性进行赋值, 触发组件渲染
    this$1.updateRoute(route);
    // 添加监听事件
    onComplete && onComplete(route);
    // 更新 URL
    this$1.ensureURL();

    // 只执行一次 ready 回调
    if (!this$1.ready) {
      this$1.ready = true;
      this$1.readyCbs.forEach(function (cb) { cb(route); });
    }
  }, function (err) {
  	// 异常处理
    if (onAbort) {
      onAbort(err);
    }
    if (err && !this$1.ready) {
      this$1.ready = true;
      this$1.readyErrorCbs.forEach(function (cb) { cb(err); });
    }
  });
};
```

接下来看下如何获取对应的路由信息:


```js
function match ( raw, currentRoute, redirectedFrom ) {

	// 序列化 url
    // 比如对于该 url 来说 /abc?foo=bar&baz=qux#hello
    // 会序列化路径为 /abc
    // 哈希为 #hello
    // 参数为 foo: 'bar', baz: 'qux'
    var location = normalizeLocation(raw, currentRoute, false, router);
    var name = location.name;
    
	// 如果是命名路由，就判断记录中是否有该命名路由配置
    if (name) {
      var record = nameMap[name];
      {
        warn(record, ("Route with name '" + name + "' does not exist"));
      }
      if (!record) { return _createRoute(null, location) }
      
      var paramNames = record.
      regex.keys
        .filter(function (key) { return !key.optional; })
        .map(function (key) { return key.name; });

      if (typeof location.params !== 'object') {
        location.params = {};
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (var key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        }
      }

      location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
      return _createRoute(record, location, redirectedFrom)
    } else if (location.path) {
    
      // 非命名路由处理
      location.params = {};
      for (var i = 0; i < pathList.length; i++) {
      	// 查找记录
        var path = pathList[i];
        var record$1 = pathMap[path];
        
        // 如果匹配成功, 则创建路由
        if (matchRoute(record$1.regex, location.path, location.params)) {
          return _createRoute(record$1, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }
```


接下来看下创建路由 `_createRoute` 的实现:

```js
function _createRoute ( record, location, redirectedFrom ) {
	if (record && record.redirect) {
	  return redirect(record, redirectedFrom || location)
	}
	if (record && record.matchAs) {
	  return alias(record, location, record.matchAs)
	}
	return createRoute(record, location, redirectedFrom, router)
}


function createRoute ( record, location, redirectedFrom, router ) {
  var stringifyQuery$$1 = router && router.options.stringifyQuery;

  var query = location.query || {};
  try {
    query = clone(query);
  } catch (e) {}
	
  // 创建路由对象
  var route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery$$1),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$$1);
  }
  
  // 设置路由对象不可修改
  return Object.freeze(route)
}

function formatMatch (record) {
  var res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res
}
```

接下来我们看下 `transitionTo` 函数中的 `confirmTransition` 是如何实现的:

```js
History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
    var this$1 = this;

  var current = this.current;
  
  // 中断路由跳转函数
  var abort = function (err) {
    if (isError(err)) {
      if (this$1.errorCbs.length) {
        this$1.errorCbs.forEach(function (cb) { cb(err); });
      } else {
        warn(false, 'uncaught error during route navigation:');
        console.error(err);
      }
    }
    onAbort && onAbort(err);
  };
  
  // 判断相同路由不跳转
  if ( isSameRoute(route, current) &&
    // in the case the route map has been dynamically appended to
    route.matched.length === current.matched.length
  ) {
    this.ensureURL();
    return abort()
  }
	
	
  // 通过对比路由解析出可复用、需要渲染和失活的组件
  var ref = resolveQueue(this.current.matched, route.matched);
  var updated = ref.updated;
  var deactivated = ref.deactivated;
  var activated = ref.activated;

  // 导航守卫组件
  var queue = [].concat(
    // 失活的组件钩子
    extractLeaveGuards(deactivated),
    // 全局 beforeEach 钩子
    this.router.beforeHooks,
    // 在当前路由改变，但是该组件被复用时调用
    extractUpdateHooks(updated),
    // 需要渲染组件 enter 守卫钩子
    activated.map(function (m) { return m.beforeEnter; }),
    // 解析异步路由组件
    resolveAsyncComponents(activated)
  );
  
  // 保存路由
  this.pending = route;
  
  // 迭代器，用于执行 queue 中的导航守卫钩子
  var iterator = function (hook, next) {
  	// 路由不相等就不跳转路由
    if (this$1.pending !== route) {
      return abort()
    }
    try {
      // 执行钩子
      hook(route, current, function (to) {
      
      	// 只有执行了钩子函数中的 next，才会继续执行下一个钩子函数, 否则会暂停跳转
        if (to === false || isError(to)) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(to);
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' && (
            typeof to.path === 'string' ||
            typeof to.name === 'string'
          ))
        ) {
          // next('/') or next({ path: '/' }) -> redirect
          abort();
          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  // 同步执行异步函数
  runQueue(queue, iterator, function () {
    var postEnterCbs = [];
    var isValid = function () { return this$1.current === route; };
    
    // 当所有异步组件加载完成后，会执行这里的回调，也就是 runQueue 中的 cb()
    // 接下来执行 需要渲染组件的导航守卫钩子
    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      // 跳转完成 
      if (this$1.pending !== route) {
        return abort()
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) { cb(); });
        });
      }
    });
  });
};

function runQueue (queue, fn, cb) {
  var step = function (index) {
	// 队列中的函数都执行完毕，就执行回调函数
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
      	// 执行迭代器，用户在钩子函数中执行 next() 回调
      	// 回调中判断传参，没有问题就执行 next()，也就是 fn 函数中的第二个参数
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  // 取出队列中第一个钩子函数
  step(0);
}

```
### 导航守卫

最后我们看下 **导航守卫** 的实现:

```js
var queue = [].concat(
    // 失活的组件钩子
    extractLeaveGuards(deactivated),
    // 全局 beforeEach 钩子
    this.router.beforeHooks,
    // 在当前路由改变，但是该组件被复用时调用
    extractUpdateHooks(updated),
    // 需要渲染组件 enter 守卫钩子
    activated.map(function (m) { return m.beforeEnter; }),
    // 解析异步路由组件
    resolveAsyncComponents(activated)
);
```

#### extractLeaveGuards

```js
function extractLeaveGuards (deactivated) {
  // 传入需要执行的钩子函数
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

function extractGuards ( records, name, bind, reverse ) {
  var guards = flatMapComponents(records, function (def, instance, match, key) {
  
  	// 找出组件中对应的钩子函数
    var guard = extractGuard(def, name);
    if (guard) {
      // 为每个钩子函数添加组件自身的上下文对象
      return Array.isArray(guard)
        ? guard.map(function (guard) { return bind(guard, instance, match, key); })
        : bind(guard, instance, match, key)
    }
  });
  
  // 数组降维，并且判断是否需要翻转数组
  // 因为某些钩子函数需要从子执行到父
  return flatten(reverse ? guards.reverse() : guards)
}

function flatMapComponents ( matched, fn ) {
  // 数组降维
  return flatten(matched.map(function (m) {
    // 将组件中的对象传入回调函数中，获得钩子函数数组
    return Object.keys(m.components).map(function (key) { return fn(
      m.components[key],
      m.instances[key],
      m, key
    ); })
  }))
}

```

#### beforeEach

```js
VueRouter.prototype.beforeEach = function beforeEach (fn) {
  return registerHook(this.beforeHooks, fn)
};

function registerHook (list, fn) {
  list.push(fn);
  return function () {
    var i = list.indexOf(fn);
    if (i > -1) { list.splice(i, 1); }
  }
}
```

由此可见, 每当给 `VueRouter` 实例添加 `beforeEach` 函数时就会将函数 push 进 `beforeHooks` 中.


#### beforeRouteUpdate

`extractUpdateHooks ` 钩子函数和 `extractLeaveGuards` 实现相同, 只是传入的函数名不同, 在该函数中可以访问到 `this` 对象.

#### beforeEnter

`beforeEnter` 钩子函数时路由独享的钩子函数.


#### resolveAsyncComponents

```js
function resolveAsyncComponents (matched) {
  return function (to, from, next) {
    var hasAsync = false;
    var pending = 0;
    var error = null;

    flatMapComponents(matched, function (def, _, match, key) {
      // 判断是否是异步组件
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending++;
		// 确保异步组件只执行一次
        var resolve = once(function (resolvedDef) {
          if (isESModule(resolvedDef)) {
            resolvedDef = resolvedDef.default;
          }
          
          // 判断是否是构造函数
          // 不是的话通过 Vue 来生成组件构造函数
          def.resolved = typeof resolvedDef === 'function'
            ? resolvedDef
            : _Vue.extend(resolvedDef);
            
          // 赋值组件
          // 如果组件全部解析完毕，继续下一步
          match.components[key] = resolvedDef;
          pending--;
          if (pending <= 0) {
            next();
          }
        });
        
		// 失败回调
        var reject = once(function (reason) {
          var msg = "Failed to resolve async component " + key + ": " + reason;
          "development" !== 'production' && warn(false, msg);
          if (!error) {
            error = isError(reason)
              ? reason
              : new Error(msg);
            next(error);
          }
        });

        var res;
        try {
          // 执行异步组件函数
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }
        if (res) {
          // 下载完成执行回调
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            // new syntax in Vue 2.3
            var comp = res.component;
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });
	// 不是异步组件直接下一步
    if (!hasAsync) { next(); }
  }
}
```

以上是第一个 `runQueue` 中的逻辑, 之后会进行 `runQueue` 函数的回调:

```js
	// 该回调用于保存 beforeRouteEnter 钩子中的回调函数{
    var postEnterCbs = [];
    var isValid = function () { return this$1.current === route; };
    // beforeRouteEnter 导航守卫钩子
    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    // beforeResolve 导航守卫钩子
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      if (this$1.pending !== route) {
        return abort()
      }
      this$1.pending = null;
      // 这里会执行 afterEach 导航守卫钩子
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) { cb(); });
        });
      }
    });
});
```
`beforeRouteEnter` 钩子不能访问 `this` 对象，因为钩子在导航确认前被调用，需要渲染的组件还没被创建。但是该钩子函数是唯一一个支持在回调中获取 `this` 对象的函数，回调会在路由确认执行。

```js

beforeRouteEnter (to, from, next) {
  next(vm => {
    // 通过 `vm` 访问组件实例
  })
}
```
接下来看下是如何支持在回调中拿到 `this` 对象:

```js
function extractEnterGuards ( activated, cbs, isValid ) {
  return extractGuards(activated, 'beforeRouteEnter', function (guard, _, match, key) {
    return bindEnterGuard(guard, match, key, cbs, isValid)
  })
}

function bindEnterGuard ( guard, match, key, cbs, isValid ) {
  return function routeEnterGuard (to, from, next) {
    return guard(to, from, function (cb) {
      // 判断 cb 是否是函数, 是的话就 push 进 cbs
      if (typeof cb === 'function') {
        cbs.push(function () {
          // 循环直到拿到组件实例
          poll(cb, match.instances, key, isValid);
        });
      }
      next(cb);
    })
  }
}

// 该函数是为了解决 issus #750
// 当 router-view 外面包裹了 mode 为 out-in 的 transition 组件 
// 会在组件初次导航到时获得不到组件实例对象
function poll ( cb, instances, key, isValid ) {
  if (
    instances[key] &&
    !instances[key]._isBeingDestroyed // do not reuse being destroyed instance
  ) {
    cb(instances[key]);
  } else if (isValid()) {
    // setTimeout 16ms 作用和 nextTick 基本相同
    setTimeout(function () {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}
```

接下来会执行 `beforeResolve` (如果注册了) 和 `afterEach` 导航钩子, 执行完成, 会触发组件的渲染:

```js
history.listen(route => {
      this.apps.forEach(app => {
        app._route = route
      })
})

// 以上回调会在 updateRoute 中调用

History.prototype.updateRoute = function updateRoute (route) {
  var prev = this.current;
  this.current = route;
  this.cb && this.cb(route);
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev);
  });
};
```

路由跳转的核心就是判断需要跳转的路由是否存在于记录中，然后执行各种导航守卫函数，最后完成 URL 的改变和组件的渲染。







<Valine></Valine>