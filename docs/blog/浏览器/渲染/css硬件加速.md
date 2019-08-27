# <center>CSS 硬件加速</center>

## 介绍

**硬件加速** : 就是将浏览器的渲染过程交给GPU处理，而不是使用自带的比较慢的渲染器。这样就可以使得animation与transition更加顺畅。

我们可以在浏览器中用css开启硬件加速，使GPU (Graphics Processing Unit) 发挥功能，从而提升性能.

### 示例

虽然我们可能不想对元素应用3D变换，可我们一样可以开启3D引擎。例如我们可以用 `transform: translateZ(0);` 来开启硬件加速 。

```css
.cube {

   -webkit-transform: translateZ(0);

   -moz-transform: translateZ(0);

   -ms-transform: translateZ(0);

   -o-transform: translateZ(0);

   transform: translateZ(0);

   /* Other transform properties here */

}
```

在 Chrome and Safari中，当我们使用CSS `transforms` 或者 `animations`时可能会有页面闪烁的效果，下面的代码可以修复此情况：

```css
.cube {

   -webkit-backface-visibility: hidden;

   -moz-backface-visibility: hidden;

   -ms-backface-visibility: hidden;

   backface-visibility: hidden;

   -webkit-perspective: 1000;

   -moz-perspective: 1000;

   -ms-perspective: 1000;

   perspective: 1000;

   /* Other transform properties here */

}
```


在webkit内核的浏览器中，另一个行之有效的方法是:

```css
.cube {

   -webkit-transform: translate3d(0, 0, 0);

   -moz-transform: translate3d(0, 0, 0);

   -ms-transform: translate3d(0, 0, 0);

   transform: translate3d(0, 0, 0);

  /* Other transform properties here */

}
```

## 原理

浏览器接收到页面文档后，会将文档中的标记语言解析为DOM树。DOM树和CSS结合后形成浏览器构建页面的渲染树。渲染树中包含了大量的渲染元素，每一个渲染元素会被分到一个图层中，每个图层又会被加载到GPU形成渲染纹理，而图层在GPU中transform 是不会触发 repaint 的，最终这些使用 transform 的图层都会由独立的合成器进程进行处理。

CSS transform 会创建了一个新的复合图层，可以被GPU直接用来执行 transform 操作。

浏览器什么时候会创建一个独立的复合图层呢？事实上一般是在以下几种情况下：

- 3D 或者透视变换（`perspective，transform`） 的 CSS 属性。
- 使用加速视频解码的 `video` 元素。
- 拥有 3D（`WebGL`） 上下文或者加速 2D 上下文的 `canvas` 元素。
- 混合插件（`Flash`)。
- 对自己的 `opacity` 做 CSS 动画或使用一个动画 webkit 变换的元素。
- 拥有加速 CSS 过滤器的元素。
- 元素有一个包含复合层的后代节点(换句话说，就是一个元素拥有一个子元素，该子元素在自己的层里)。
- 元素有一个兄弟元素在复合图层渲染，并且该兄弟元素的 `z-index` 较小，那这个元素也会被应用到复合图层。

使用3D硬件加速提升动画性能时，最好给元素增加一个z-index属性，人为干扰复合层的排序，可以有效减少chrome创建不必要的复合层，提升渲染性能，移动端优化效果尤为明显。

## 为什么要用它?

**因为 transform 属性不会触发浏览器的 repaint（重绘），而绝对定位absolute中的 left 和 top 则会一直触发 repaint（重绘）。**   

transform 动画由GPU控制，支持硬件加速，并不需要软件方面的渲染。

可以触发GPU硬件加速的CSS属性:

- transform
- opacity
- filter
- will-change

## 注意

使用硬件加速并不是十全十美的事情，比如：

- 内存。如果GPU加载了大量的纹理，那么很容易就会发生内容问题，这一点在移动端浏览器上尤为明显，所以，一定要牢记不要让页面的每个元素都使用硬件加速。

- 使用GPU渲染会影响字体的抗锯齿效果。这是因为GPU和CPU具有不同的渲染机制。即使最终硬件加速停止了，文本还是会在动画期间显示得很模糊。


<Valine></Valine>