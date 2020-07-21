# <center>Arguments 对象</center>



## 定义

`arguments`对象是所有（非箭头）函数中都可用的**局部变量**。你可以使用`arguments`对象在函数中引用函数的参数。此对象包含传递给函数的每个参数，第一个参数在索引0处。

`arguments`对象不是一个 [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Array) 。它类似于`Array`，但除了length属性和索引元素之外没有任何`Array`属性。



## 注意

> 注意: 在严格模式下，`arguments`对象已与过往不同。`arguments[@@iterator]`不再与函数的实际形参之间共享，同时caller属性也被移除。

当非严格模式中的函数「有」包含剩余参数、默认参数和解构赋值，那么arguments对象中的值「不会」跟踪参数的值（反之亦然）

例子如下：

```js
// 无默认参数
function test(a, b, c) {
  console.log(a, b, c) // 1 2 3
  b = 10
  console.log(arguments[1]) // 10
  console.log(a, b, c) // 1 10 3
  console.log(arguments) // [Arguments] { '0': 1, '1': 10, '2': 3 }
}
test(1,2,3)
```

```javascript
// 有默认参数
function test(a, b, c = 1) {
  console.log(a, b, c) // 1 2 3
  b = 10
  console.log(arguments[1]) // 2
  console.log(a, b, c) // 1 10 3
  console.log(arguments) // [Arguments] { '0': 1, '1': 2, '2': 3 }
}
test(1,2,3)
```



具体 可以去看 MDN的  [Arguments对象]('https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments')

