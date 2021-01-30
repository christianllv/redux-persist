# Synchronize Redux state with sessionStorage

Subscribe the Redux Store and replicate to `sessionStorage`. The user could refresh page and keep the redux state.

### Store config

Import the **_default method_** (you can call storePersist as the example below) from `'@redux-persist/sessionStorage'` and pass store as parameter

```javascript
import { createStore, combineReducers } from 'redux';
import storePersist from '@redux-persist/sessionStorage';

const combineReducer = combineReducers({
  Category,
  Post
});

export const store = createStore(combineReducer);

storePersist(store); // the default config synchronizes the entire store
```

### Blacklist

If you need to ignore some reducer, you can use the **blacklist** configuration.

The **blacklist** allows an array of strings (reducers keys).

```javascript
storePersist(store, {
  blacklist: ['Category']
});
```

### Whitelist

If you want to sync just specific reducers, you can use the **whitelist** configuration.

The **whitelist** allows an array of strings (reducers keys).

```javascript
storePersist(store, {
  whitelist: ['Post']
});
```

### Reducer example

To populate the initalState from browser storage, import **_defineState_** method from `'@redux-persist/sessionStorage'`, pass your `initialState` as first parameter and the reducer key as the second. (note that it's using currying)

```javascript
import { defineState } from '@redux-persist/sessionStorage';

const defaultState = {
  data: null
};

const initialState = defineState(defaultState)('Post');

export default (state = initialState, action) => {
  switch (action.type) {
    case 'ACTION1':
      return {
        ...state,
        data: action.payload
      };
    case 'ACTION2':
      return {
        ...state,
        data: null
      };
    default:
      return state;
  }
};
```

### Encrypt local state

In some situations you may want to encrypt the local state information. For that, you can pass your encrypt and decrypt methods.

```javascript
const encryptMethod = btoa(state);
const decryptMethod = atob(state);

storePersist(store, {
  encrypt: encryptMethod,
  decrypt: decryptMethod,
}); 
```

### Getting local state

This method gets the persisted state. It shouldn't be actually necessary, since the state from your redux store is supposed to be the same.

```javascript
import { getState } from '@redux-persist/sessionStorage';

const state = getState();
```

### If you need to reset the local store

```javascript
import { resetState } from '@redux-persist/sessionStorage';

resetState();
```
