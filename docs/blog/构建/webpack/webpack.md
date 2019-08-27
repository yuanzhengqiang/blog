# <center>webpack</center>

## Tree Shaking

>Tree-shaking的本质是消除无用的js代码。无用代码消除在广泛存在于传统的编程语言编译器中，编译器可以判断出某些代码根本不影响输出，然后消除这些代码，这个称之为DCE（dead code elimination;   
>
>Tree-shaking 是 DCE 的一种新的实现，Javascript同传统的编程语言不同的是，javascript绝大多数情况需要通过网络进行加载，然后执行，加载的文件大小越小，整体执行时间更短，所以去除无用代码以减少文件体积，对javascript来说更有意义。  
>
>Tree-shaking 和传统的 DCE的方法又不太一样，传统的DCE 消灭不可能执行的代码，而Tree-shaking 更关注宇消除没有用到的代码。

Tree-shaking是依赖ES6模块静态分析的，ES6 module的特点如下:

- 只能作为模块顶层的语句出现;
- import 的模块名只能是字符串常量
- import binding 是 immutable的

### 副作用
副作用在我们项目中，也同样是频繁的出现。知道函数式编程的朋友都会知道这个名词。所谓模块(这里模块可称为一个函数)具有副作用，就是说这个模块是不纯的。这里可以引入纯函数的概念。

>对于相同的输入就有相同的输出，不依赖外部环境，也不改变外部环境。

符合上述就可以称为纯函数，不符合就是不纯的，是具有副作用的，是可能对外界造成影响的。  


#### no plugin
当不使用插件的时候，我们来看一下会不会Tree-shaking，预期是会被Tree-shaking。

```js
// test.js
class Test{
  init(value){
      console.log('test init');
  }
}
export { Test }

// index.js
import Test from './test';
const fun = function () {
    console.log('测试');
};
fun();

```
结果:  和预期相同.

```js
//...
function (e, t, r) {
  "use strict";
  r.r(t);
  console.log("测试")
}
```

#### no plugin + 副作用

当我们在不适用插件的情况下，并且引入副作用，观察一下会不会打包，预期是不会打包。

```js
// test.js
import {debounce} from 'lodash-es'
class Test{
  init(value){
      console.log('test init');
      return debounce();
  }
}
export { Test }

// index.js
import Test from './test';
const fun = function () {
    console.log('测试');
};
fun();

```

结果:  和预期相同, 并没有触发Tree-shaking.

```js
//...
function (e, t, r) {
  "use strict";
  n.r(e);
  var r = n(0),
    o = "object" == typeof self && self && self.Object === Object && self,
    u = r.a || o || Function("return this")(),
    i = u.Symbol,
    c = Object.prototype;
  c.hasOwnProperty, c.toString, i && i.toStringTag;
  Object.prototype.toString;
  i && i.toStringTag;
  parseInt;
  Math.max, Math.min;
  console.log("测试")
}
```

#### plugin + 副作用

当我们使用插件并且代码中存在副作用的情况下，观察打包情况, 我们预期是可以Tree-shaking的。

```js
// test.js
import {debounce} from 'lodash-es'
class Test{
  init(value){
      console.log('test init');
      return debounce();
  }
}
export { Test }

// index.js
import Test from './test';
const fun = function () {
    console.log('测试');
};
fun();

// package.json 添加 "sideEffects": false

```

结果:  和预期相同.


```js
//...
function (e, t, r) {
  "use strict";
  r.r(t);
  console.log("测试")
}
```
###小结
- 尽量使用ES6 的import/export;
- 如果代码确实有些副作用, 在package.json里添加"sideEffects"属性指定有副作用的脚本


## Scope Hoisting

在webpack 3 版本提供了一个新的功能：Scope Hoisting，又译作“作用域提升”。只需在配置文件中添加一个新的插件，就可以让 Webpack 打包出来的代码文件更小、运行的更快：

```js
module.exports = {
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
}
```

使用 Scope Hoisting 带来的好处:
- 文件体积比之前更小。
- 运行代码时创建的函数作用域也比之前少了，开销也随之变小。

然后在webpack4中提供了两种构建模式可供选择 development 和 production, 默认开启部分功能, 就包括`ModuleConcatenationPlugin`;

| 选项 | 描述 |
| ---- | ---- |
| development | 会将 process.env.NODE_ENV 的值设为 development。启用 NamedChunksPlugin(固化 runtime 内以及在使用动态加载时分离出的 chunk 的 chunk id) 和 NamedModulesPlugin(开启 HMR[热重载]的时候使用该插件会显示模块的相对路径)。|
| production | 会将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin. |



<Valine></Valine>