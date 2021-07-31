# <center>React面试题</center>

### 1、react中key的作用，有key没key有什么区别，比较同一层级节点什么意思？

```javascript
Keys是React用于追踪哪些列表中元素被修改、被添加或者被移除的辅助标识。
```

### 2、你对虚拟dom和diff算法的理解，实现render函数

`虚拟DOM`本质上是`JavaScript`对象,是对`真实DOM`的抽象表现。 状态变更时，记录新树和旧树的差异 最后把差异更新到真正的`dom`中 **render函数:**

1. 根据`tagName`生成父标签,读取`props`，设置属性，`如果有content`，设置`innerHtml或innerText`,
2. 如果存在子元素，遍历子元素递归调用`render`方法，将生成的子元素依次添加到父元素中，并返回根元素。

### 3、React组件之间通信方式？

1. 父子组件,父->子直接用`Props`,子->父用`callback`回调
2. 非父子组件,用发布订阅模式的`Event`模块
3. 项目复杂的话用`Redux、Mobx`等全局状态管理管库
4. `Context Api context` 会使组件复用性变差

`Context` 提供了一个无需为每层组件手动添加 `props`，就能在组件树间进行数据传递的方法.如果你只是想避免层层传递一些属性，组件组合（`component composition`）有时候是一个比 context 更好的解决方案。 5. 组件组合缺点：会使高层组件变得复杂

### 4、如何解析jsx

```javascript
调用React.createElement函数创建对象
```

### 5、生命周期都有哪几种，分别是在什么阶段做哪些事情？为什么要废弃一些生命周期？

componentWillMount、componentWillReceiveProps、componentWillUpdate在16版本被废弃，在17版本将被删除，需要使用UNSAVE_前缀使用，目的是向下兼容。

### 6、关于react的优化方法

- 代码层面：

使用return null而不是CSS的display:none来控制节点的显示隐藏。保证同一时间页面的DOM节点尽可能的少。

- props和state的数据尽可能简单明了，扁平化。

不要使用数组下标作为key 利用 `shouldComponentUpdate` 和 `PureComponent` 避免过多 `render function`; `render`里面尽量减少新建变量和bind函数，传递参数是尽量减少传递参数的数量。 尽量将 `props` 和 `state` 扁平化，只传递 `component `需要的 `props`（传得太多，或者层次传得太深，都会加重`shouldComponentUpdate`里面的数据比较负担），慎将 `component` 当作 `props` 传入

- 代码体积：

使用 `babel-plugin-import` 优化业务组件的引入，实现按需加载 使用 `SplitChunksPlugin `拆分公共代码 使用动态 `import`，懒加载 `React` 组件

### 7、绑定this的几种方式

```javascript
bind/箭头函数
```

### 8、对fiber的理解

```javascript
React Fiber 是一种基于浏览器的单线程调度算法.
```

### 9、setState是同步还是异步的

1. `setState`只在合成事件和钩子函数中是“异步”的，在原生事件和 setTimeout 中都是同步的。
2. `setState`的“异步”并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形式了所谓的“异步”，当然可以通过第二个参数 setState(partialState, callback) 中的callback拿到更新后的结果。
3. `setState` 的批量更新优化也是建立在“异步”（合成事件、钩子函数）之上的，在原生事件和setTimeout 中不会批量更新，在“异步”中如果对同一个值进行多次 setState ， setState 的批量更新策略会对其进行覆盖，取最后一次的执行，如果是同时 setState 多个不同的值，在更新时会对其进行合并批量更新。

### 10、Redux、React-Redux

**Redux的实现流程**

用户页面行为触发一个`Action`，然后`Store`调用`Reducer`，并且传入两个参数：当前`State`和收到的`Action`。`Reducer`会返回新的`State`。每当`state`更新之后，`view`会根据`state`触发重新渲染。

**React-Redux:**

`Provider`：从最外部封装了整个应用，并向`connect`模块传递`store`。 `Connect`：

1. 包装原组件，将`state`和`action`通过`props`的方式传入到原组件内部。
2. 监听`store tree`变化，使其包装的原组件可以响应`state`变化

### 11、对高阶组件的理解

高阶组件是参数为组件，返回值为新组件的函数。`HOC`是纯函数，没有副作用。`HOC`在`React`的第三方库中很常见，例如`Redux`的`connect`组件。

高阶组件的作用：

- 代码复用，逻辑抽象，抽离底层准备（`bootstrap`）代码
- 渲染劫持
- `State` 抽象和更改
- `Props` 更改

### 12、可以用哪些方式创建`React`组件？

`React.createClass()、ES6 class`和无状态函数

### 13、`React`元素与组件的区别？

组件是由元素构成的。元素数据结构是普通对象，而组件数据结构是类或纯函数。

## Vue与React对比？

**数据流：**

**react**主张函数式编程，所以推崇纯组件，数据不可变，单向数据流，

**vue**的思想是响应式的，也就是基于是数据可变的，通过对每一个属性建立Watcher来监听，当属性变化的时候，响应式的更新对应的虚拟dom。

**监听数据变化实现原理**：

- `Vue` 通过 `getter/setter` 以及一些函数的劫持，能精确知道数据变化，不需要特别的优化就能达到很好的性能
- `React` 默认是通过比较引用的方式进行的，如果不优化(`PureComponent/shouldComponentUpdate`)可能导致大量不必要的VDOM的重新渲染。

组件通信的区别：jsx和.vue模板。

- `HoC和Mixins`(在Vue中我们组合不同功能的方式是通过`Mixin`，而在`React`中我们通过`HoC`(高阶组件))。

**性能优化**

- `React: shouldComponentUpdate`
- `Vue`:内部实现`shouldComponentUpdate`的优化，由于依赖追踪系统存在，通过`watcher`判断是否需要重新渲染(当一个页面数据量较大时，`Vue`的性能较差，造成页面卡顿，所以一般数据比较大的项目倾向使用`React`)。

## vuex 和 redux 之间的区别？

从实现原理上来说，最大的区别是两点：

**Redux**使用的是不可变数据，而`Vuex`的数据是可变的。`Redux`每次都是用新的`state`替换旧的`state`，而`Vuex`是直接修改

**Redux**在检测数据变化的时候，是通过`diff`的方式比较差异的，而`Vuex`其实和Vue的原理一样，是通过 `getter/setter`来比较的(如果看`Vuex`源码会知道，其实他内部直接创建一个`Vue`实例用来跟踪数据变化)