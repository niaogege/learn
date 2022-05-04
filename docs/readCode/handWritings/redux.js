/**
 * 手写redux 22/04/27
 */

const createStore = function (reducer, initState, rewriteCreateStoreFunc) {
  if (typeof initState === 'function') {
    initState = undefined;
    rewriteCreateStoreFunc = initState;
  }
  if (rewriteCreateStoreFunc) {
    const newCreateStore = rewriteCreateStoreFunc(createStore);
    return newCreateStore({ initState, reducer });
  }
  let state = initState;
  let listeners = [];

  // 订阅
  function subscribe(listener) {
    listeners.push(listener);
    return function unsubscribe() {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  // 改变状态
  function dispatch(action) {
    // state = { ...newState };
    state = reducer(state, action);
    for (let listener of listeners) {
      listener();
    }
  }
  // 得到state
  function getState() {
    return state;
  }

  function replaceReducer(nextReducer) {
    reducer = nextReducer;
    dispatch({ type: Symbol() });
  }
  // 用一个不匹配任何计划的type 来获取初始值
  dispatch({ type: Symbol() });
  return {
    subscribe,
    getState,
    dispatch,
    replaceReducer,
  };
};

// 运用
let initState = {
  count: 0,
};
let store = createStore({ initState });
store.subscribe(() => {
  let state = store.getState();
  console.log(state.count);
});

// store.changeState({
//   count: store.getState() + 1,
// });

// store.changeState({
//   count: store.getState() - 1,
// });

store.dispatch({
  type: 'INCREMENT',
});

store.dispatch({
  type: 'DECREMENT',
});

function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1,
      };
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1,
      };
    default:
      return state;
  }
}

function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers);
  return function combine(state = {}, action) {
    const nextState = {};
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i];
      const reducer = reducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      nextState[key] = nextStateForKey;
    }
    return nextState;
  };
}
function infoReducer(state, action) {
  switch (action.type) {
    case 'SET_NAME':
      return {
        ...state,
        name: action.name,
      };
    case 'SET_DESCRIPTION':
      return {
        ...state,
        description: action.description,
      };
    default:
      return state;
  }
}
const reduces = combineReducers({
  counter: counterReducer,
  info: infoReducer,
});

let initStates = {
  counter: {
    count: 0,
  },
  info: {
    name: 'cpp',
    description: 'WMH',
  },
};
let stores = createStore({ reduce: reduces, initState: initStates });

const next = store.dispatch;

const loggerMiddleWare = (store) => (next) => (action) => {
  console.log('this.state', store.getState());
  next(action);
  console.log('next state', store.getState());
};

store.dispatch = (action) => {
  try {
    loggerMiddleWare(action);
  } catch (e) {
    console.log(e);
  }
};

const exceptionMiddleware = (store) => (next) => {
  return (action) => {
    try {
      next(action);
    } catch (e) {
      console.log(e);
    }
  };
};
exceptionMiddleware(loggerMiddleWare(next));

const logger = loggerMiddleWare(store);
const exception = exceptionMiddleware(store);
store.dispatch = exception(logger(next));

const newCreateStore = applyMiddleware(exceptionMiddleware, loggerMiddleWare)(createStore);

const store = newCreateStore(reducer);

const applyMiddleware = function (...middlewares) {
  return function rewriteCreateStoreFunc(oldCreateStore) {
    return function newCreateStore(reducer, initState) {
      // generate store
      const { getState } = oldCreateStore(reducer, initState);
      // 每个middleware传參store
      const chain = middlewares.map((middleware) => middleware({ getState }));
      let dispatch = store.dispatch;
      /* 实现 exception(time((logger(dispatch))))*/
      chain.reverse().map((middleware) => {
        dispatch = middleware(dispatch);
      });
      store.dispatch = dispatch;
      return store;
    };
  };
};

const rewriteCreateStoreFunc = applyMiddleware(exceptionMiddleware, loggerMiddleWare);

const store = createStore({
  reducer,
  initState,
  rewriteCreateStoreFunc,
});

const compose = (...funs) => {
  if (funs.length === 1) return funs[0];
  return funs.reduce(
    (a, b) =>
      (...args) =>
        a(b(args)),
  );
};

function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(this, arguments));
  };
}

export function bindActionCreators(actionCreators, dispatch) {
  const keys = Object.keys(actionCreators);
  const boundActionCreators = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}
