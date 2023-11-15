import store from "store";

export function getClientVersion() {
	return store.get("client-version");
}

export function setClientVersion(value: string) {
	store.set("client-version", value);
}
