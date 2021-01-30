import { createStore, combineReducers } from 'redux';
import { describe, it, expect } from '@jest/globals';

import storePersist, {
  getState,
  defineState,
  resetState,
} from '../dist/index.js';

const encryptMessage = (message) => btoa(message);

const decryptMessage = (message) => atob(message);

const testReducer = (state = {}, action) => {
  if (action.type === 'test') {
    return {
      data: action.payload,
    };
  }
  return state;
};

const rootReducer = combineReducers({
  testReducer,
});

const store = createStore(rootReducer);

storePersist(store);

describe('localStorage persist', () => {
  it('Should return the store content after dispatch', () => {
    store.dispatch({
      type: 'test',
      payload: 'testing',
    });

    expect(getState()).toEqual({
      testReducer: {
        data: 'testing',
      },
    });
  });

  it('Should pass initial state to reducer from localStore', () => {
    const defaultState = {
      data: 'Test',
    };

    const initialState = defineState(defaultState)('testReducer');

    const newReducer = (state = initialState, action) => {
      if (action.type === 'test') {
        return {
          data: action.payload,
        };
      }
      return state;
    };

    const newRootReducer = combineReducers({
      newReducer,
    });

    const newStore = createStore(newRootReducer);

    const newReducerState = {
      testReducer: newStore.getState().newReducer,
    };

    expect(getState()).not.toEqual(defaultState);
    expect(getState()).toEqual(newReducerState);
  });

  it('Should return the store empty after reset', () => {
    resetState();

    expect(getState()).toEqual({});
  });

  it('Should not persist reducer in the blacklist', () => {
    const newReducer = (state = {}, action) => {
      if (action.type === 'newReducer') {
        return { ...state, data: action.payload };
      }
      return state;
    };

    const blacklistReducer = (state = {}, action) => {
      if (action.type === 'blacklist') {
        return { ...state, data: action.payload };
      }
      return state;
    };

    const newRootReducer = combineReducers({
      newReducer,
      blacklistReducer,
    });

    const newStore = createStore(newRootReducer);
    storePersist(newStore, {
      blacklist: ['blacklistReducer'],
    });

    newStore.dispatch({
      type: 'newReducer',
      payload: 'newReducer',
    });

    newStore.dispatch({
      type: 'blacklist',
      payload: 'blacklistReducer',
    });

    expect(getState().newReducer.data).toBe('newReducer');
    expect(getState().blacklistReducer).toBeUndefined();
  });

  it('Should persist only reducers in the whitelist', () => {
    const newReducer = (state = {}, action) => {
      if (action.type === 'newReducer') {
        return { ...state, data: action.payload };
      }
      return state;
    };

    const whitelistReducer = (state = {}, action) => {
      if (action.type === 'whitelist') {
        return { ...state, data: action.payload };
      }
      return state;
    };

    const newRootReducer = combineReducers({
      newReducer,
      whitelistReducer,
    });

    const newStore = createStore(newRootReducer);
    storePersist(newStore, {
      whitelist: ['whitelistReducer'],
    });

    newStore.dispatch({
      type: 'newReducer',
      payload: 'newReducer',
    });

    newStore.dispatch({
      type: 'whitelist',
      payload: 'whitelistReducer',
    });

    expect(getState().whitelistReducer.data).toBe('whitelistReducer');
    expect(getState().newReducer).toBeUndefined();
  });
});
