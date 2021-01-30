import {
  hasSameProps,
  isNull,
  setStorageConfig,
  getStoreToPersist,
} from '../../../src/utils';

const settings = {
  localkey: 'localStore',
  blacklist: [],
};

const getLocalStore = () => {
  const { localkey, decrypt } = settings;
  try {
    const storeString = window.sessionStorage.getItem(localkey);
    const store = decrypt ? decrypt(storeString) : storeString;
    return JSON.parse(store);
  } catch (e) {
    return {};
  }
};

const setLocalStore = (store) => {
  const { localkey, encrypt } = settings;
  try {
    const storeString = JSON.stringify(getStoreToPersist(store, settings));
    const storeToPersist = encrypt ? encrypt(storeString) : storeString;
    return window.sessionStorage.setItem(localkey, storeToPersist);
  } catch (e) {
    return {};
  }
};

export const getState = () => (!isNull(getLocalStore()) ? getLocalStore() : {});

export const defineState = (defaultState) => (reducer) => {
  if (Object.prototype.hasOwnProperty.call(getState(), reducer)) {
    const localReducer = getState()[reducer];
    return hasSameProps(defaultState, localReducer) ? localReducer : defaultState;
  }
  return defaultState;
};

export const resetState = () => {
  const { localkey } = settings;
  window.sessionStorage.removeItem(localkey);
};

export default (store, config = null) => {
  if (config) {
    setStorageConfig(config, settings);
  }
  return store.subscribe(() => setLocalStore(store));
};
