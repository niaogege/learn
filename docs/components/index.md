---
title: 介绍
order: 0
group:
  title: 介绍
nav:
  title: '组件'
  path: /components
---

组件库介绍

## 组件列表

#### 1. 基础组件

- Button
- Mask
- Divider
- Space
- HairLineBox
- Avatar
- Icon

#### 2. 操作反馈

- Drawer
- Modal
- Pullup
- AlertDialog
- Popover 
- Drag
- Tooltip
- PopConfirm
- Toast
- Notify
- ActionSheet
- FingerGestureElement
- Switch
- Skeleton
- CopyToClipboard
- Spin
- ScrollTop

#### 3. 导航组件

- Tabs (选项卡切换)
- Affix (将页面元素钉在可视范围)
- Steps (步骤条)
- PopMenu (弹出菜单)

### 4. 数据录入

- Checkbox
- CheckboxGroup
- Radio
- RadioGroup
- Input (单行/多行输入框)
- PasswordInput (移动端/pc, 密码输入框 )
- NumberKeyboardBase (数字键盘,非弹出 )
- NumberKeyboard (数字键盘)
- Picker (移动端选择器)
- PickerView (平铺选择器)
- Rate (评分/几颗星)
- FileInputTrigger (触发文件上传)
- DatePicker
- Calendar (移动端日历)

### 5. 数据展示

- Cell
- Badge 
- WaterMark
- Text
- ImageViewer (图片查看器)
- ProgressCircle (环形进度条)
- ProgressBar (直线性进度条)
- QRCode
- Collapse
- Slide
- NoticeBar
- NoticeList

### 6. 动画/过渡

- TransitionElement (给子元素添加出场过渡效果,出场包含 1.元素初次加载并可见 2.元素从不可见到可见的状态变化)
- AnimationElement(元素应用 animation 动画,和 TransitionElement 一样，只有在元素出现在视口才会执行动画,属性参照 css animation,也可以和 animate.css 配合使用,参考 https://animate.style/#usage using `@keyframes`)

### 7. 其他组件

- Player 
- ThemeProvider (全局主题色配置)
- LazyLoadElement（懒加载组件,在视口才渲染 children,不在则显示占位元素）
- LazyLoadImage (懒加载图片，当做 img 标签使用, 在视口才加载图片)
- WaitLoading (延时显示 Loading/Spin 防止闪烁)
- ErrorBoudary （错误边界）
- Waypoint （可见/不可见指示）
- AutoCenter (自动居中)

### 8. 工具函数

- debounce 
- throttle 
- loadResource(动态加载 js/css 文件)
- observe (使用 IntersectionObserver 监视 dom 元素在文档视口的可见性)
- unobserve (取消 observe 监控)
- 埋点函数

### 9. 常量

- isBrowser(是否是浏览器)
- isMobile (是否是移动端)
- isWeixin

### 10. Hooks

- useUpdateEffect (执行异步更新 effect)
- useUpdateLayoutEffect (执行同步更新 effect)
- usePrevious (使用前一个值)
- useDebounce （返回 memorized 防抖函数）
- useThrottle （返回 memorized 节流函数）
- useInViewport (监听元素是否在视口内)
- useVisibleObserve (监视元素在文档视口的可见性，可见性变化时触发回调)
- useCallbackRef (保存最新的值在 ref 中)
- useCountdown (倒计时，常用于获取验证码)
- useMount (组件加载执行回调)
- useUnmount (组件卸载执行回调)
