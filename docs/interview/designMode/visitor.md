---
title: 设计模式之访问者模式
order: 1
group:
  order: 10
  title: js Basic
  path: /interview/designMode
nav:
  order: 3
  title: 'interview'
  path: /interview
---

熟悉模式和套路，码代码更高效

## 访问者模式

visitor 模式（访问者模式）是 23 种经典设计模式中的一种。当被操作的对象结构比较稳定，而操作对象的逻辑经常变化的时候，通过分离逻辑和对象结构，使得他们能独立扩展。这就是 visitor 模式的思想。

特点：

- 操作对象的**结构稳定**
- 操作对象的**逻辑频繁变化**

意图：表示一个作用于某对象结构中的各元素的操作。它使你可以在**不改变各元素的类**的前提下定义作用于这些元素的新操作。

假设你用了访问者模式，会发现，每天因为迭代而新增的那几个方法，都会放到一个新 Visitor 文件下，比如一种纳米材料的门板在游戏 V1.5 版本被引进，它对材料的使用会体现在新增一个 Visitor 文件，资源本身的类不会被修改，这既不会引发协同问题，也使功能代码按照场景聚合，不论维护还是删除的心智负担都非常小。

访问者模式背后的思考本质还是，**基础的元素数量一般不会随着程序迭代产生太大变化，而对这些基础元素的使用方式或组合使用会随着程序迭代不断更新，我们将变化更快的通过 Visitor 打包提取出来，自然会更利于维护**。

什么情况下考虑使用访问者模式？

- 一个对象结构包含很多类对象，他们有不同接口，而你想对这些对象实施一些依赖于其具体类的操作

- 需要对一个对象结构中的对象进行很多不同的并且不相关的操作，而你想避免让这些操作“污染”这些对象的类。Visitor 使得你可以将相关的操作集中起来定义在一个类中。

- 定义对象结构的类很少改变，但经常需要在此结构上定义新的操作(但是操作对象的逻辑经常发生变化)

访问者模式的特点：

- 在类的内部结构不变的情况下，不同的访问者访问这个对象都会呈现出不同的处理方式

- 加入新的操作，相对容易，而无需改变结构本身

- 访问者所进行的操作，其代码是集中在一起的

- 当采用访问者模式的时候，就会打破组合类的封装

### babel 的 Visitor

对应到 **babel traverse** 的实现，就是 AST 和 visitor 分离，在 traverse（遍历）AST 的时候，调用注册的 **visitor** 来对其进行处理。

访问者模式其实是在把**对象结构**和**操作逻辑**分开，使得两者可以独立拓展。对应到 babel traverse 阶段的实现，就是将遍历 AST 和操作节点两部分逻辑分离，**在 traverse AST 的时候，调用注册的 visitor 来对其进行处理**。这样使得 AST 的结构和遍历算法固定，visitor 可以通过插件独立扩展。

babel 在遍历 AST 树的时候，处理一个节点时，是以访问者的形式获取节点信息，并进行相关操作，这种方式是通过一个 visitor 对象来完成的，在 visitor 对象中定义了对于各种节点的访问函数，这样就可以针对不同的节点做出不同的处理。我们编写的 Babel 插件其实也是通过定义一个实例化 visitor 对象处理一系列的 AST 节点来完成我们对代码的修改操作。

### 代码实现

```ts
interface CElement {
  accept: (arg: any) => void;
}
interface Visitor {
  visit: (arg: any) => void;
}
class ConcreteElement implements CElement {
  public accept(visitor: Visitor) {
    visitor.visit(this);
  }
}
class ConcreteVisitorX implements Visitor {
  public visit(element: CElement) {
    element.accept(this);
  }

  public visit(concreteElementA: ConcreteElementA) {
    console.log('X 操作 A');
  }

  public visit(concreteElementB: ConcreteElementB) {
    console.log('X 操作 B');
  }
}
class ConcreteVisitorY implements Visitor {
  public visit(element: ELement) {
    element.accept(this);
  }

  public visit(concreteElementA: ConcreteElementA) {
    console.log('Y 操作 A');
  }

  public visit(concreteElementB: ConcreteElementB) {
    console.log('Y 操作 B');
  }
}

// 先创建元素
const element = new ConcreteElement();

// 访问者 X
const visitorX = new ConcreteVisitorX();

// 访问者 Y
const visitorY = new ConcreteVisitorY();

// 然后让访问者 visit 观察一下元素
visitorX.visit(element as CElement);
visitorY.visit(element as CElement);
```
