---
title: 原生事件和合成事件
order: 10
group:
  title: react生态
  order: 0
---

### 解释下 react 中的合成事件(from gpt)

在 React 中，合成事件是由 React 自己实现的一种事件系统，用于处理浏览器原生事件（如 click，keydown 等）的跨浏览器兼容性和性能问题。

合成事件提供了与浏览器事件相同的接口，但是实现方式有所不同。在 React 中，当 DOM 元素触发事件时，React 会将该事件包装成一个合成事件对象并传递给事件处理函数，而不是将原生事件对象传递给事件处理函数。

合成事件对象包含与原生事件对象相同的属性和方法，例如 type、target、preventDefault()和 stopPropagation()等。但是，合成事件对象在不同浏览器和平台上的行为是一致的，因此开发者无需担心跨浏览器兼容性问题。

此外，React 还利用合成事件对象实现了一些性能优化技术，例如事件委托和事件池。事件委托允许开发者将事件处理程序注册到父元素上，从而减少注册事件处理程序的数量和内存占用。**事件池则允许 React 在事件处理程序执行完毕后，将合成事件对象重用，从而减少对象创建和垃圾回收的成本**(react17 已经废弃)。

```js
function handleChange(e) {
  // This won't work because the event object gets reused.
  setTimeout(() => {
    console.log(e.target.value); // Too late!
  }, 100);
}

// after
// If you need to access event object’s properties after the event handler has run, you need to call e.persist():
function handleChange(e) {
  // Prevents React from resetting its properties:
  e.persist();

  setTimeout(() => {
    console.log(e.target.value); // Works
  }, 100);
}
```

总之，React 中的合成事件是一种高性能、跨浏览器兼容的事件系统，可以帮助开发者更方便地处理 DOM 事件。

### 事件机制前置知识点

![事件传播机制](https://www.bythewayer.com/img/event.webp)

一般的事件触发都会经历三个阶段：

- 捕获阶段，事件从 window 开始，自上而下一直传播到目标元素的阶段。

- 目标阶段，事件真正的触发元素处理事件的阶段。

- 冒泡阶段，从目标元素开始，自下而上一直传播到 window 的阶段。

如果想阻止事件的传播，可以在指定节点的事件监听器通过 **event.stopPropagation()或 event.cancelBubble = true**阻止事件传播。

> 有些事件是没有冒泡阶段的，如 scroll、blur、及各种媒体事件等。

#### 绑定事件的方法

- 行内事件绑定

```js
<div onclick="handleClick()">
  test
</div>
<script>
  let handleClick = function(){
    // 一些处理代码..
  }
  // 移除事件
  handleClick = function(){}
</script>
```

缺点：js 和 html 代码耦合了。

- 事件处理器属性(DOM0)

```js
<div id="test">
  test
</div>
<script>
  let target = document.getElementById('test')
  // 绑定事件
  target.onclick = function(){
    // 一些处理代码..
  }
  target.onclick = function(){
    // 另外一些处理代码...会覆盖上面的
  }
  // 移除事件
  target.onclick = null
</script>
```

缺点：作为属性使用，一次只能绑定一个事件，多次赋值会覆盖，只能处理冒泡阶段。

- addEventListener(DOM2)

```js
<div id="test">
  test
</div>
<script>
  let target = document.getElementById('test')
  // 绑定事件
  let funcA = function(){
    // 一些处理代码..
  }
  let funcB = function(){
    // 一些处理代码..
  }
  // 添加冒泡阶段监听器
  target.addEventListener('click',funcA,false)
  // 添加捕获阶段监听器
  target.addEventListener('click',funcB,true)
  // 移除监听器
  target.removeEventListener('click', funcA)
</script>
```

#### 事件委托

当节点的数量较多时，如果给每个节点都进行事件绑定的话，内存消耗大，可将事件绑定到其父节点上统一处理，减少事件绑定的数量。

```js
<ul id="parent">
  <li>1</li>
  <li>2</li>
  <li>3</li>
  ....
  <li>999</li>
  <li>1000</li>
</ul>
<script>
  let parent = document.getElementById('parent')
  parent.addEventListener('click',(e)=>{
    // 根据e.target进行处理
  })
</script>
```

#### 浏览器事件差异

由于浏览器厂商的实现差异，在事件的属性及方法在不同浏览器及版本上略有不同，开发者为兼容各浏览器及版本之间的差异，需要编写兼容代码，要么重复编写模板代码，要么将磨平浏览器差异的方法提取出来。

```js
// 阻止事件传播
function stopPropagation(e) {
  if (typeof e.stopPropagation === 'function') {
    e.stopPropagation();
  } else {
    // 兼容ie
    e.cancelBubble = true;
  }
}
// 阻止默认事件
function preventDefault(e) {
  if (typeof e.preventDefault === 'function') {
    e.preventDefault();
  } else {
    // 兼容ie
    e.returnValue = false;
  }
}
// 获取事件触发元素
function getEventTarget(e) {
  let target = e.target || e.srcElement || window;
}
```

### 为什么 React 实现了自己的事件机制

将事件都代理到了根节点上，减少了事件监听器的创建，节省了内存。

磨平浏览器差异，开发者无需兼容多种浏览器写法。如想阻止事件传播时需要编写 event.stopPropagation() 或 event.cancelBubble = true，在 React 中只需编写 event.stopPropagation()即可。

对开发者友好。只需在对应的节点上编写如 onClick、onClickCapture 等代码即可完成 click 事件在该节点上冒泡节点、捕获阶段的监听，统一了写法。

### 实现细节

#### 事件分类

React 对在 React 中使用的事件进行了分类，具体通过各个类型的事件处理插件分别处理：

SimpleEventPlugin 简单事件，代表事件 onClick

BeforeInputEventPlugin 输入前事件，代表事件 onBeforeInput

ChangeEventPlugin 表单修改事件，代表事件 onChange

EnterLeaveEnventPlugin 鼠标进出事件，代表事件 onMouseEnter

SelectEventPlugin 选择事件，代表事件 onSelect

#### 事件收集

#### 事件代理

### 合成事件

合成事件**SyntheticEvent**是 React 事件系统对于**原生事件跨浏览器包装器**。它除了兼容所有浏览器外，它还拥有和浏览器原生事件相同的接口，包括 **stopPropagation() 和 preventDefault()**。

如果因为某些原因，当你需要使用浏览器的底层事件时，只需要使用 **nativeEvent** 属性来获取即可。

#### 合成事件的使用

- React 事件的命名采用小驼峰式（camelCase），而不是纯小写。以 click 事件为例，冒泡阶段用 onClick，捕获阶段用 onClickCapture。

- 使用 JSX 语法时你需要传入一个函数作为事件处理函数，而不是一个字符串。

```js
// 传统html绑定事件
<button onclick="activateLasers()">
  test
</button>

// 在React中绑定事件
<button onClick={activateLasers}>
  test
</button>
```

在 React 事件中不同通过返回 false 阻止默认行为，必须显式调用 **event.preventDefault()**。

#### 磨平浏览器差异

React 通过事件**normalize**以让他们在不同浏览器中拥有一致的属性。

React 声明了各种事件的接口，以此来磨平浏览器中的差异：

- 如果接口中的字段值为 0，则直接使用原生事件的值。

- 如果接口中字段的值为函数，则会以原生事件作为入参，调用该函数来返回磨平了浏览器差异的值。

```js
// 基础事件接口，timeStamp需要磨平差异
const EventInterface = {
  eventPhase: 0,
  bubbles: 0,
  cancelable: 0,
  timeStamp: function (event) {
    return event.timeStamp || Date.now();
  },
  defaultPrevented: 0,
  isTrusted: 0,
};
// UI事件接口，继承基础事件接口
const UIEventInterface: EventInterfaceType = {
  ...EventInterface,
  view: 0,
  detail: 0,
};
// 鼠标事件接口，继承UI事件接口，getModifierState，relatedTarget、movementX、movementY等字段需要磨平差异
const MouseEventInterface: EventInterfaceType = {
  ...UIEventInterface,
  screenX: 0,
  screenY: 0,
  clientX: 0,
  clientY: 0,
  pageX: 0,
  pageY: 0,
  ctrlKey: 0,
  shiftKey: 0,
  altKey: 0,
  metaKey: 0,
  getModifierState: getEventModifierState,
  button: 0,
  buttons: 0,
  relatedTarget: function (event) {
    if (event.relatedTarget === undefined)
      return event.fromElement === event.srcElement ? event.toElement : event.fromElement;

    return event.relatedTarget;
  },
  movementX: function (event) {
    if ('movementX' in event) {
      return event.movementX;
    }
    updateMouseMovementPolyfillState(event);
    return lastMovementX;
  },
  movementY: function (event) {
    if ('movementY' in event) {
      return event.movementY;
    }
    // Don't need to call updateMouseMovementPolyfillState() here
    // because it's guaranteed to have already run when movementX
    // was copied.
    return lastMovementY;
  },
};
// 指针类型，继承鼠标事件接口。还有很多其他事件类型接口。。。。。。
const PointerEventInterface = {
  ...MouseEventInterface,
  pointerId: 0,
  width: 0,
  height: 0,
  pressure: 0,
  tangentialPressure: 0,
  tiltX: 0,
  tiltY: 0,
  twist: 0,
  pointerType: 0,
  isPrimary: 0,
};
```

由于不同的类型的事件其字段有所不同，所以 React 实现了针对事件接口的**合成事件构造函数**的工厂函数。 通过传入不一样的事件接口返回对应事件的合成事件构造函数，然后在**事件触发回调**时根据触发的事件类型判断使用哪种类型的合成事件构造函数来实例化合成事件。

```js
// 辅助函数，永远返回true
function functionThatReturnsTrue() {
  return true;
}
// 辅助函数，永远返回false
function functionThatReturnsFalse() {
  return false;
}
// 合成事件构造函数的工厂函数，根据传入的事件接口返回对应的合成事件构造函数
function createSyntheticEvent(Interface: EventInterfaceType) {
  // 合成事件构造函数
  function SyntheticBaseEvent(
    reactName: string | null,
    reactEventType: string,
    targetInst: Fiber,
    nativeEvent: { [propName: string]: mixed },
    nativeEventTarget: null | EventTarget,
  ) {
    // react事件名
    this._reactName = reactName;
    // 当前执行事件回调时的fiber
    this._targetInst = targetInst;
    // 真实事件名
    this.type = reactEventType;
    // 原生事件对象
    this.nativeEvent = nativeEvent;
    // 原生触发事件的DOM target
    this.target = nativeEventTarget;
    // 当前执行回调的DOM
    this.currentTarget = null;

    // 下面是磨平字段在浏览器间的差异
    for (const propName in Interface) {
      if (!Interface.hasOwnProperty(propName)) {
        // 该接口没有这个字段，不拷贝
        continue;
      }
      // 拿到事件接口对应的值
      const normalize = Interface[propName];
      // 如果接口对应字段函数，进入if分支，执行函数拿到值
      if (normalize) {
        // 获取磨平了浏览器差异后的值
        this[propName] = normalize(nativeEvent);
      } else {
        // 如果接口对应值是0，则直接取原生事件对应字段值
        this[propName] = nativeEvent[propName];
      }
    }
    // 磨平defaultPrevented的浏览器差异，即磨平e.defaultPrevented和e.returnValue的表现
    const defaultPrevented =
      nativeEvent.defaultPrevented != null
        ? nativeEvent.defaultPrevented
        : nativeEvent.returnValue === false;
    if (defaultPrevented) {
      // 如果在处理事件时已经被阻止默认操作了，则调用isDefaultPrevented一直返回true
      this.isDefaultPrevented = functionThatReturnsTrue;
    } else {
      // 如果在处理事件时没有被阻止过默认操作，则先用返回false的函数
      this.isDefaultPrevented = functionThatReturnsFalse;
    }
    // 默认执行时间时，还没有被阻止继续传播，所以调用isPropagationStopped返回false
    this.isPropagationStopped = functionThatReturnsFalse;
    return this;
  }
  // 合成事件重要方法的包装
  Object.assign(SyntheticBaseEvent.prototype, {
    preventDefault: function () {
      // 调用后设置defaultPrevented
      this.defaultPrevented = true;
      const event = this.nativeEvent;
      if (!event) {
        return;
      }
      // 下面是磨平e.preventDefault()和e.returnValue=false的浏览器差异，并在原生事件上执行
      if (event.preventDefault) {
        event.preventDefault();
        // $FlowFixMe - flow is not aware of `unknown` in IE
      } else if (typeof event.returnValue !== 'unknown') {
        event.returnValue = false;
      }
      // 然后后续回调判断时都会返回true
      this.isDefaultPrevented = functionThatReturnsTrue;
    },

    stopPropagation: function () {
      const event = this.nativeEvent;
      if (!event) {
        return;
      }
      // 磨平e.stopPropagation()和e.calcelBubble = true的差异，并在原生事件上执行
      if (event.stopPropagation) {
        event.stopPropagation();
        // $FlowFixMe - flow is not aware of `unknown` in IE
      } else if (typeof event.cancelBubble !== 'unknown') {
        // The ChangeEventPlugin registers a "propertychange" event for
        // IE. This event does not support bubbling or cancelling, and
        // any references to cancelBubble throw "Member not found".  A
        // typeof check of "unknown" circumvents this issue (and is also
        // IE specific).
        event.cancelBubble = true;
      }
      // 然后后续判断时都会返回true，已停止传播
      this.isPropagationStopped = functionThatReturnsTrue;
    },
    /**
     * We release all dispatched `SyntheticEvent`s after each event loop, adding
     * them back into the pool. This allows a way to hold onto a reference that
     * won't be added back into the pool.
     */
    // react16的保留原生事件的方法，react17里已无效
    persist: function () {
      // Modern event system doesn't use pooling.
    },

    /**
     * Checks if this event should be released back into the pool.
     *
     * @return {boolean} True if this should not be released, false otherwise.
     */
    isPersistent: functionThatReturnsTrue,
  });
  // 返回根据接口类型包装的合成事件构造器
  return SyntheticBaseEvent;
}
// 使用通过给工厂函数传入基础事件接口获取基本事件合成事件构造函数
/**
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
const EventInterface = {
  eventPhase: 0,
  bubbles: 0,
  cancelable: 0,
  timeStamp: function (event) {
    return event.timeStamp || Date.now();
  },
  defaultPrevented: 0,
  isTrusted: 0,
};
export const SyntheticEvent = createSyntheticEvent(EventInterface);

// 使用通过给工厂函数传入拖拽事件接口获取拖拽事件合成事件构造函数
const DragEventInterface: EventInterfaceType = {
  ...MouseEventInterface,
  dataTransfer: 0,
};
export const SyntheticDragEvent = createSyntheticEvent(DragEventInterface);
// *** 很多合成事件构造函数
export const SyntheticTouchEvent = createSyntheticEvent(TouchEventInterface);
export const SyntheticWheelEvent = createSyntheticEvent(WheelEventInterface);
```

可以看到，合成事件的实例，其实就是**根据事件类型对原生事件的属性做浏览器的磨平，以及关键方法的包装**。

#### 合成事件触发

当页面上触发了特定的事件时，如点击事件 click，就会触发**绑定在根元素上的事件回调函数**，也就是之前绑定了参数的 dispatchEvent，而 dispatchEvent 在内部最终会调用 dispatchEventsForPlugins，看一下**dispatchEventsForPlugins**具体做了哪些事情。

```js
function dispatchEventsForPlugins(
  domEventName: DOMEventName,
  eventSystemFlags: EventSystemFlags,
  nativeEvent: AnyNativeEvent,
  targetInst: null | Fiber,
  targetContainer: EventTarget,
): void {
  // 磨平浏览器差异 拿到真正的目标元素
  const nativeEventTarget = getEventTarget(nativeEvent);
  // 要处理事件回调的队列
  const dispatchQueue: DispatchQueue = [];
  // 将fiber树上的回调收集
  extractEvents(
    dispatchQueue,
    domEventName,
    targetInst,
    nativeEvent,
    nativeEventTarget,
    eventSystemFlags,
    targetContainer,
  );
  // 根据收集到的回调及事件标记处理事件
  processDispatchQueue(dispatchQueue, eventSystemFlags);
}
```

重点在 extractEvents 和 processDispatchQueue 两个方法，分别进行了**事件对应回调的收集**及**处理回调**。

- 事件对应回调的收集 extractEvents

```js
function extractEvents(
  dispatchQueue: DispatchQueue,
  domEventName: DOMEventName,
  targetInst: null | Fiber,
  nativeEvent: AnyNativeEvent,
  nativeEventTarget: null | EventTarget,
  eventSystemFlags: EventSystemFlags,
  targetContainer: EventTarget,
) {
  SimpleEventPlugin.extractEvents(
    dispatchQueue,
    domEventName,
    targetInst,
    nativeEvent,
    nativeEventTarget,
    eventSystemFlags,
    targetContainer,
  );
  const shouldProcessPolyfillPlugins =
    (eventSystemFlags & SHOULD_NOT_PROCESS_POLYFILL_EVENT_PLUGINS) === 0;
  if (shouldProcessPolyfillPlugins) {
    EnterLeaveEventPlugin.extractEvents(
      dispatchQueue,
      domEventName,
      targetInst,
      nativeEvent,
      nativeEventTarget,
      eventSystemFlags,
      targetContainer,
    );
    ChangeEventPlugin.extractEvents(
      dispatchQueue,
      domEventName,
      targetInst,
      nativeEvent,
      nativeEventTarget,
      eventSystemFlags,
      targetContainer,
    );
    SelectEventPlugin.extractEvents(
      dispatchQueue,
      domEventName,
      targetInst,
      nativeEvent,
      nativeEventTarget,
      eventSystemFlags,
      targetContainer,
    );
    BeforeInputEventPlugin.extractEvents(
      dispatchQueue,
      domEventName,
      targetInst,
      nativeEvent,
      nativeEventTarget,
      eventSystemFlags,
      targetContainer,
    );
  }
}
```

我们可以发现回调的收集也是根据事件的类型分别处理的，将 extractEvents 的入参分别给各个事件处理插件的 extractEvents 进行分别处理。

以**SimpleEventPlugin.extractEvents**为例看看如何进行收集：

```js
function extractEvents(
  dispatchQueue: DispatchQueue,
  domEventName: DOMEventName,
  targetInst: null | Fiber,
  nativeEvent: AnyNativeEvent,
  nativeEventTarget: null | EventTarget,
  eventSystemFlags: EventSystemFlags,
  targetContainer: EventTarget,
): void {
  const reactName = topLevelEventsToReactNames.get(domEventName);
  if (reactName === undefined) {
    return;
  }
  let SyntheticEventCtor = SyntheticEvent;
  let reactEventType: string = domEventName;
  switch (domEventName) {
    case 'keypress':
      // Firefox creates a keypress event for function keys too. This removes
      // the unwanted keypress events. Enter is however both printable and
      // non-printable. One would expect Tab to be as well (but it isn't).
      if (getEventCharCode(((nativeEvent: any): KeyboardEvent)) === 0) {
        return;
      }
    /* falls through */
    case 'keydown':
    case 'keyup':
      SyntheticEventCtor = SyntheticKeyboardEvent;
      break;
    case 'focusin':
      reactEventType = 'focus';
      SyntheticEventCtor = SyntheticFocusEvent;
      break;
    case 'focusout':
      reactEventType = 'blur';
      SyntheticEventCtor = SyntheticFocusEvent;
      break;
    case 'beforeblur':
    case 'afterblur':
      SyntheticEventCtor = SyntheticFocusEvent;
      break;
    case 'click':
      // Firefox creates a click event on right mouse clicks. This removes the
      // unwanted click events.
      if (nativeEvent.button === 2) {
        return;
      }
    /* falls through */
    case 'auxclick':
    case 'dblclick':
    case 'mousedown':
    case 'mousemove':
    case 'mouseup':
    // TODO: Disabled elements should not respond to mouse events
    /* falls through */
    case 'mouseout':
    case 'mouseover':
    case 'contextmenu':
      SyntheticEventCtor = SyntheticMouseEvent;
      break;
    case 'drag':
    case 'dragend':
    case 'dragenter':
    case 'dragexit':
    case 'dragleave':
    case 'dragover':
    case 'dragstart':
    case 'drop':
      SyntheticEventCtor = SyntheticDragEvent;
      break;
    case 'touchcancel':
    case 'touchend':
    case 'touchmove':
    case 'touchstart':
      SyntheticEventCtor = SyntheticTouchEvent;
      break;
    case ANIMATION_END:
    case ANIMATION_ITERATION:
    case ANIMATION_START:
      SyntheticEventCtor = SyntheticAnimationEvent;
      break;
    case TRANSITION_END:
      SyntheticEventCtor = SyntheticTransitionEvent;
      break;
    case 'scroll':
      SyntheticEventCtor = SyntheticUIEvent;
      break;
    case 'wheel':
      SyntheticEventCtor = SyntheticWheelEvent;
      break;
    case 'copy':
    case 'cut':
    case 'paste':
      SyntheticEventCtor = SyntheticClipboardEvent;
      break;
    case 'gotpointercapture':
    case 'lostpointercapture':
    case 'pointercancel':
    case 'pointerdown':
    case 'pointermove':
    case 'pointerout':
    case 'pointerover':
    case 'pointerup':
      SyntheticEventCtor = SyntheticPointerEvent;
      break;
    default:
      // Unknown event. This is used by createEventHandle.
      break;
  }

  const inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;
  if (enableCreateEventHandleAPI && eventSystemFlags & IS_EVENT_HANDLE_NON_MANAGED_NODE) {
  } else {
    // 如果不是捕获阶段且事件名为scroll，则只处理触发事件的节点
    const accumulateTargetOnly = !inCapturePhase && domEventName === 'scroll';
    // 在fiber树上收集事件名对应的props
    const listeners = accumulateSinglePhaseListeners(
      targetInst,
      reactName,
      nativeEvent.type,
      inCapturePhase,
      accumulateTargetOnly,
    );
    if (listeners.length > 0) {
      // Intentionally create event lazily.
      // 则构建一个react合成事件
      const event = new SyntheticEventCtor(
        reactName,
        reactEventType,
        null,
        nativeEvent,
        nativeEventTarget,
      );
      // 并收集到队列中
      dispatchQueue.push({ event, listeners });
    }
  }
}

// 遍历fiber树的收集函数
export function accumulateSinglePhaseListeners(
  targetFiber: Fiber | null,
  reactName: string | null,
  nativeEventType: string,
  inCapturePhase: boolean,
  accumulateTargetOnly: boolean,
): Array<DispatchListener> {
  const captureName = reactName !== null ? reactName + 'Capture' : null;
  const reactEventName = inCapturePhase ? captureName : reactName;
  const listeners: Array<DispatchListener> = [];

  let instance = targetFiber;
  let lastHostComponent = null;

  // Accumulate all instances and listeners via the target -> root path.
  while (instance !== null) {
    const { stateNode, tag } = instance;
    // Handle listeners that are on HostComponents (i.e. <div>)
    if (tag === HostComponent && stateNode !== null) {
      lastHostComponent = stateNode;

      // createEventHandle listeners
      if (enableCreateEventHandleAPI) {
        const eventHandlerListeners = getEventHandlerListeners(lastHostComponent);
        if (eventHandlerListeners !== null) {
          eventHandlerListeners.forEach((entry) => {
            if (entry.type === nativeEventType && entry.capture === inCapturePhase) {
              listeners.push(
                createDispatchListener(instance, entry.callback, (lastHostComponent: any)),
              );
            }
          });
        }
      }

      if (reactEventName !== null) {
        const listener = getListener(instance, reactEventName);
        if (listener != null) {
          listeners.push(createDispatchListener(instance, listener, lastHostComponent));
        }
      }
    } else if (
      enableCreateEventHandleAPI &&
      enableScopeAPI &&
      tag === ScopeComponent &&
      lastHostComponent !== null &&
      stateNode !== null
    ) {
      // Scopes
      const reactScopeInstance = stateNode;
      const eventHandlerListeners = getEventHandlerListeners(reactScopeInstance);
      if (eventHandlerListeners !== null) {
        eventHandlerListeners.forEach((entry) => {
          if (entry.type === nativeEventType && entry.capture === inCapturePhase) {
            listeners.push(
              createDispatchListener(instance, entry.callback, (lastHostComponent: any)),
            );
          }
        });
      }
    }
    if (accumulateTargetOnly) {
      break;
    }
    instance = instance.return;
  }
  return listeners;
}
```

可以看到 SimpleEventPlugin.extractEvents 的主要处理逻辑：

- 根据原生事件名，得到对应的 React 事件名。

- 根据原生事件名，判断需要使用的合成事件构造函数。

- 根据绑定的事件标记得出事件是否捕获阶段。

- 判断事件名是否为 scoll 且不是捕获阶段，如果是则只收集事件触发节点。

从触发事件的 DOM 实例对应的 fiber 节点开始，向上遍历 fiber 树，判断遍历到的 fiber 是否宿主类型 fiber 节点，是的话判断在其 props 上是否存在 React 事件名同名属性，如果存在，则 push 到数组中，遍历结束即可收集由叶子节点到根节点的回调函数。

如果收集的回调数组不为空，则实例化对应的合成事件，并与收集的回调函数一同收集到**dispatchQueue**中。

- processDispatchQueue 处理回调

```js
// 分别处理事件队列
export function processDispatchQueue(
  dispatchQueue: DispatchQueue,
  eventSystemFlags: EventSystemFlags,
): void {
  const inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;
  for (let i = 0; i < dispatchQueue.length; i++) {
    const { event, listeners } = dispatchQueue[i];
    processDispatchQueueItemsInOrder(event, listeners, inCapturePhase);
  }
}
// 根据事件是捕获阶段还是冒泡阶段，来决定是顺序执行还是倒序执行
// 并且如果事件被调用过event.stopPropagation则退出执行
function processDispatchQueueItemsInOrder(
  event: ReactSyntheticEvent,
  dispatchListeners: Array<DispatchListener>,
  inCapturePhase: boolean,
): void {
  let previousInstance;
  if (inCapturePhase) {
    // 捕获阶段逆序执行
    for (let i = dispatchListeners.length - 1; i >= 0; i--) {
      const { instance, currentTarget, listener } = dispatchListeners[i];
      if (instance !== previousInstance && event.isPropagationStopped()) {
        // 如果被阻止过传播，则退出
        return;
      }
      // 执行
      executeDispatch(event, listener, currentTarget);
      previousInstance = instance;
    }
  } else {
    for (let i = 0; i < dispatchListeners.length; i++) {
      const { instance, currentTarget, listener } = dispatchListeners[i];
      if (instance !== previousInstance && event.isPropagationStopped()) {
        return;
      }
      executeDispatch(event, listener, currentTarget);
      previousInstance = instance;
    }
  }
}

// 执行事件回调
function executeDispatch(
  event: ReactSyntheticEvent,
  listener: Function,
  currentTarget: EventTarget,
): void {
  const type = event.type || 'unknown-event';
  // 设置合成事件执行到当前DOM实例时的指向
  event.currentTarget = currentTarget;
  invokeGuardedCallbackAndCatchFirstError(type, listener, undefined, event);
  // 不在事件的回调中时拿不到currentTarget
  event.currentTarget = null;
}
```

### React17 与 React16 事件系统的差别

- 绑定位置

事件委托的节点从 React16 的 document 更改为 React17 的 React 树的根 DOM 容器这一改动的出发点是如果页面中存在多个 React 应用，由于他们都会在顶层 document 注册事件处理器，如果你在一个 React 子应用的 React 事件中调用了 e.stopPropagation()，无法阻止事件冒泡到外部树，因为真实的事件早已传播到 document。

而将事件委托在 React 应用的**根 DOM 容器**则可以避免这样的问题，减少了多个 React 应用并存可能产生的问题，并且事件系统的运行也更贴近现在浏览器的表现。

- 事件代理阶段

在 React16 中，对 document 的事件委托都委托在冒泡阶段，当事件冒泡到 document 之后触发绑定的回调函数，在回调函数中重新模拟一次 捕获-冒泡 的行为，所以 React 事件中的 e.stopPropagation()无法阻止原生事件的捕获和冒泡，因为原生事件的捕获和冒泡已经执行完了。

在 React17 中，对 React 应用根 DOM 容器的事件委托分别在捕获阶段和冒泡阶段。即：

当根容器接收到捕获事件时，先触发一次 React 事件的捕获阶段，然后再执行原生事件的捕获传播。所以 React 事件的捕获阶段调用 e.stopPropagation()能阻止原生事件的传播。

当根容器接受到冒泡事件时，会触发一次 React 事件的冒泡阶段，此时原生事件的冒泡传播已经传播到根了，所以 React 事件的冒泡阶段调用 e.stopPropagation()不能阻止原生事件向根容器的传播，但是能阻止根容器到页面顶层的传播。

- 去除事件池事件池 – React（https://zh-hans.reactjs.org/docs/legacy-event-pooling.html）

- scroll 事件不再冒泡在原生 scroll 里，scroll 是不存在冒泡阶段的，但是 React16 中模拟了 scroll 的冒泡阶段，React17 中将此特性去除，避免了当一个嵌套且可滚动的元素在其父元素触发事件时造成混乱。

### 参考

- [弄懂 React 事件机制](https://mp.weixin.qq.com/s/aihwEeiZPY9aBOmhY78iWw)
