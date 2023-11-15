import store from "store";
import { IUpdateInfo } from "../components/UpdateModal";

export function saveUpdateLog(updateInfo: IUpdateInfo) {
  store.set("updateLog", updateInfo);
}

export function getUpdateLog(): IUpdateInfo | null {
  return store.get("updateLog", null);
}

export function removeUpdateLog() {
  store.remove("updateLog");
}
