export const isNull = (value) => value === 'undefined' || value === null;

export const hasSameProps = (obj1, obj2) => Object.keys(obj1).every((prop) => Object.prototype.hasOwnProperty.call(obj2, prop));

export const hasValidItemsType = (array = []) => array.every((item) => typeof item === 'string');

export const setStorageConfig = (config, settings = {}) => {
  if (Object.prototype.hasOwnProperty.call(config, 'localkey')) {
    settings.localkey = config.localkey;
  }

  if (Object.prototype.hasOwnProperty.call(config, 'blacklist')) {
    if (!hasValidItemsType(config.blacklist)) {
      throw new Error('Backlist item type should be string');
    }
    settings.blacklist = config.blacklist;
  }

  if (Object.prototype.hasOwnProperty.call(config, 'whitelist')) {
    if (!hasValidItemsType(config.whitelist)) {
      throw new Error('Whitelist item type should be string');
    }
    settings.whitelist = config.whitelist;
  }

  if (Object.prototype.hasOwnProperty.call(config, 'encrypt')) {
    settings.encrypt = config.encrypt;
  }

  if (Object.prototype.hasOwnProperty.call(config, 'decrypt')) {
    settings.decrypt = config.decrypt;
  }
};

const filterBlacklist = (state, settings) => {
  const localState = { ...state };
  const { blacklist } = settings;

  blacklist.forEach((key) => {
    localState[key] = undefined;
  });

  return localState;
};

const filterWhitelist = (state, settings) => {
  const localState = {};
  const { whitelist } = settings;

  if (whitelist.length) {
    whitelist.forEach((key) => {
      localState[key] = state[key];
    });
  }

  return localState;
};

export const getStoreToPersist = (store, settings) => {
  if (settings.whitelist) {
    return filterWhitelist(store.getState(), settings);
  }
  return filterBlacklist(store.getState(), settings);
};
