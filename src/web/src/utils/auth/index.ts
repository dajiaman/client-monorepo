import store from "store";

export function getLoginToken() {
	return store.get("loginToken");
}

export function setLoginToken(token: string) {
	store.set("loginToken", token);
}

export function removeLoginToken() {
	store.remove("loginToken");
}

export function setUsername(username: string) {
	store.set("username", username);
}
