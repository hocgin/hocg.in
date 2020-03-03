------
title: React使用过程中的记录点
date: 2018-11-20 19:15:36
tags:
  - React
  - Tips
categories:
  - React
------
  React 使用过程中的一些记录..
<!--more-->
## 定义清晰可维护的接口
- 避免 `render`替代方式
```js
const SplitTimes = (props) => {
  //TODO: 返回JSX
}
```
- 回调类 props 属性使用前缀`on`
```html
<div onDone={}/>
```
- 尽量写 props-type

---
## 组件的内部实现
- 解构赋值
```js
  constructor() {
    super(...arguments); //永远正确！
  }
```
- 避免内联函数
```jsx
        <ControlButtons
          activated={this.state.isStarted}
          onStart={() => { /* TODO */}}
          onPause={() => { /* TODO */}}
          onReset={() => { /* TODO */}}
          onSplit={() => { /* TODO */}}
        />
```
- 利用**属性初始化**（property initializer）来定义 state 和成员函数。
```js
state = {
    isStarted: false,
    startTime: null,
    currentTime: null,
    splits: [],
  }

onReset = () => {
    this.setState({
      startTime: null,
      currentTime: null,
      splits: [],
    });
  }
```

---
## 组件化样式
- 避免内联 `style`
```jsx
 <h1 style={{
    'font-family': 'monospace'
  }}>{ms2Time(milliseconds)}</h1>
```

----
## 聪明组件和傻瓜组件
- 不用 PureComponent 写一个傻瓜组件
```js
const Joke = React.memo(() => (
    <div>
        <img src={SmileFace} />
        {this.props.value || 'loading...' }
    </div>
));
```

---
## render props 模式
- 高阶组件
> 可以是普通属性，也可以是`children`
```jsx
const Auth= (props) => {
  const userName = getUserName();

  if (userName) {
    const allProps = {userName, ...props};
    return (
      <React.Fragment>
        {props.login(allProps)}
      </React.Fragment>
    );
  } else {
    <React.Fragment>
      {props.nologin(props)}
    </React.Fragment>
  }
};

  <Auth
    login={({userName}) => <h1>Hello {userName}</h1>}
    nologin={() => <h1>Please login</h1>}
  />
```

---
## 提供者模式
* 新版-提供者模式
```jsx
const ThemeContext = React.createContext();

const ThemeProvider = ThemeContext.Provider;
const ThemeConsumer = ThemeContext.Consumer;

class Subject extends React.Component {
  render() {
    return (
      <ThemeConsumer>
        {
          (theme) => (
            <h1 style={{color: theme.mainColor}}>
              {this.props.children}
            </h1>
          )
        }
      </ThemeConsumer>
    );
  }
}
```

---
## 组合组件
> 模式 = 问题场景 + 解决办法

- 组合组件
```jsx
// 案例
    <Tabs>
      <TabItem>One</TabItem>
      <TabItem>Two</TabItem>
      <TabItem>Three</TabItem>
    </Tabs>

// TabItem
const TabItem = (props) => {
  const {active, onClick} = props;
  const tabStyle = {
    'max-width': '150px',
    color: active ? 'red' : 'green',
    border: active ? '1px red solid' : '0px',
  };
  return (
    <h1 style={tabStyle} onClick={onClick}>
      {props.children}
    </h1>
  );
};

// Tabs
class Tabs extends React.Component {
  state = {
    activeIndex:  0
  }

  render() {
    const newChildren = React.Children.map(this.props.children, (child, index) => {
      if (child.type) {
        return React.cloneElement(child, {
          active: this.state.activeIndex === index,
          onClick: () => this.setState({activeIndex: index})
        });
      } else {
        return child;
      }
    });

    return (
      <Fragment>
        {newChildren}
      </Fragment>
    );
  }
}
```


---
## React 单元测试
- 测试框架
	- Jest

---
## 组件状态
> props 是组件外传递进来的数据，state 代表的就是 React 组件的内部状态。

- 判断一个数据放在哪
	1. 如果数据由外部传入，放在 props 中；
	2. 如果是组件内部状态，是否这个状态更改应该立刻引发一次组件重新渲染？如果是，放在 state 中；不是，放在成员变量中。
- 函数参数的 state 更新
```jsx
// 1
function increment(state, props) {
  return {count: state.count + 1};
}
this.setState(increment);

// 2 
this.setState((preState, props) => ({})
```

## Redux 使用模式
- connect( mapStateToProps , mapDispatchToProps )
	1. 前者把 state 映射到 props 上
	2. 后者把 dispatch 映射到 props 上
```jsx
// 后续写法
connect(( state )=>({
	count: state.count,
}), ( dispatch )=>({
	 onIncrement: () => dispatch({type: 'INCREMENT'}),
   $fetch: ({payload, callback})=> dispatch({type: 'fetch', payload, callback}),
}))

// this.props.$fetch({})
```

## React Router
- 路由的种类
	- HashRouter `/#/about`
	- BrowserRouter `/about` **推荐**

## 拥抱异步渲染
-  在 `componentDidMount` 发起网络请求