import store from "store";

const cacheStorage = {
  setItem(key: string, value: any) {
    store.set(key, value);
  },
  getItem(key: string, defaultValue?: any) {
    return store.get(key, defaultValue);
  },
  removeItem(key: string) {
    store.remove(key);
  },
};

export default cacheStorage;
