import store from "store";

export function getLang() {
  return store.get("language", "zh-CN");
}
