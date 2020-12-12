# <center>scroll滚动优化</center>

## 滚动优化的由来

滚动优化其实也不仅仅指滚动（scroll 事件），还包括了例如 resize 这类会频繁触发的事件。

在绑定 scroll 、resize 这类事件时，当它发生时，它被触发的频次非常高，间隔很近。如果事件中涉及到大量的位置计算、DOM 操作、元素重绘等工作且这些工作无法在下一个 scroll 事件触发前完成，就会造成浏览器掉帧。加之用户鼠标滚动往往是连续的，就会持续触发 scroll 事件导致掉帧扩大、浏览器 CPU 使用率增加、用户体验受到影响。

在滚动事件中绑定回调应用场景也非常多，在图片的懒加载、下滑自动加载数据、侧边浮动导航栏等中有着广泛的应用。

当用户浏览网页时，拥有平滑滚动经常是被忽视但却是用户体验中至关重要的部分。当滚动表现正常时，用户就会感觉应用十分流畅，令人愉悦，反之，笨重不自然卡顿的滚动，则会给用户带来极大不舒爽的感觉。

## 简化 scroll 内的操作

但是从本质上而言，我们应该尽量去精简 scroll 事件的 handler ，将一些变量的初始化、不依赖于滚动位置变化的计算等都应当在 scroll 事件外提前就绪。

建议如下：

**避免在scroll 事件中修改样式属性 / 将样式操作从 scroll 事件中剥离**

![TCP-handshake](./images/scroll-render.jpg)

输入事件处理函数，比如 scroll / touch 事件的处理，都会在 requestAnimationFrame 之前被调用执行。

因此，如果你在 scroll 事件的处理函数中做了修改样式属性的操作，那么这些操作会被浏览器暂存起来。然后在调用 requestAnimationFrame 的时候，如果你在一开始做了读取样式属性的操作，那么这将会导致触发浏览器的强制同步布局。

## 滑动过程中尝试使用 pointer-events: none 禁止鼠标事件

 [**pointer-events**](https://developer.mozilla.org/zh-CN/docs/Web/CSS/pointer-events) 是一个 CSS 属性，可以有多个不同的值，属性的一部分值仅仅与 SVG 有关联，这里我们只关注 pointer-events: none 的情况，大概的意思就是禁止鼠标行为，应用了该属性后，譬如鼠标点击，hover 等功能都将失效，即是元素不会成为鼠标事件的 target。

可以就近 F12 打开开发者工具面板，给 <body> 标签添加上 pointer-events: none 样式，然后在页面上感受下效果，发现所有鼠标事件都被禁止了。

那么它有什么用呢？

pointer-events: none 可用来提高滚动时的帧频。的确，当滚动时，鼠标悬停在某些元素上，则触发其上的 hover 效果，然而这些影响通常不被用户注意，并多半导致滚动出现问题。对 body 元素应用 pointer-events: none ，禁用了包括 hover 在内的鼠标事件，从而提高滚动性能。

```css
.disable-hover {
    pointer-events: none;
}
```
大概的做法就是在页面滚动的时候, 给 <body> 添加上 .disable-hover 样式，那么在滚动停止之前, 所有鼠标事件都将被禁止。当滚动结束之后，再移除该属性。

上面说 pointer-events: none 可用来提高滚动时的帧频 的这段话摘自 [pointer-events-MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/pointer-events) ，还专门有文章讲解过这个技术：


[使用pointer-events:none实现60fps滚动](https://www.thecssninja.com/javascript/pointer-events-60fps)

这就完了吗？没有，张鑫旭有一篇专门的文章，用来探讨 pointer-events: none 是否真的能够加速滚动性能，并提出了自己的质疑：

[pointer-events:none提高页面滚动时候的绘制性能？](https://www.zhangxinxu.com/wordpress/2014/01/pointer-events-none-avoiding-unnecessary-paints/)

结论见仁见智，使用 pointer-events: none 的场合要依据业务本身来定夺，拒绝拿来主义，多去源头看看，动手实践一番再做定夺。