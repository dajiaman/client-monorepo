import localforage from "localforage";
import { State } from "zustand";
import { PersistStorage } from "zustand/middleware";
import store from "store";

const storage = localforage.createInstance({
    name: `${store.get("username")}-store`,
});

const indexdbStorage: PersistStorage<State> = {
    async getItem(key: string) {
        return storage.getItem(key);
    },
    // @ts-ignore
    async setItem(key: string, value: any) {
        // console.log('setItem', 'key', key, 'value', value);
        return storage.setItem(key, JSON.parse(JSON.stringify(value)));
    },
    async removeItem(key: string) {
        return storage.removeItem(key);
    },
};

export default indexdbStorage;
