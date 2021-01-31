# <center>new与构造函数</center>

## 没有return

```js
function Person(name) {
    this.name = name;
    console.log(this.name);
}
var a = Person('逆夏'); // 逆夏 
var b = new Person('ni'xia') // nixia
console.log(a) // undefined
console.log(b) // Person {name: "nixia"}
```

1.不使用 **new：this** 对象指向window，并且，不会默认返回任何对象
2.使用 **new： this** 对象指向的是 **Person** 实例

## 有**return**

1.简单数据类型：数值，字符串、布尔值、null、undefined

```javascript
function Person(name) {
  this.name = name;
  console.log(this.name);
  return 1
}
var a = Person('逆夏') // 逆夏
var b = new Person('nixia') // nixia 
console.log(a) // 1
console.log(b) // Person {name: "nixia"} 
console.log(a.name) // undefined
console.log(b.name) // nixia
```

2.复杂数据类型：对象即属性的集合（function、Array、Object）

```javascript
function Person(name) {
  this.name = name;
  console.log(this.name);
  return [1,2,3]
}
var a = Person('逆夏') // 逆夏
var b = new Person('nixia') // nixia 
console.log(a) // [1,2,3]
console.log(b) // [1,2,3]
console.log(a.name) // undefined
console.log(b.name) // undefined
```

- 不使用 **new**：**return **之后，得到的就是 **return** 的返回值
- 使用 **new**：**return **之后，就会出现两种情况，一种是返回的是简 单数据类型，这时返回值会被自动忽略，返回的还是原来的实例。另一种是返回的是复杂数据类型，此时得到的就是**return**的返回对象。

