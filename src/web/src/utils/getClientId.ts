import { customAlphabet } from "nanoid";
import store from "store";

export function getClientId() {
  const clientId = store.get("globalClientId");
  if (clientId) {
    return clientId;
  }

  const generatedClientId = generateClientId();
  store.set("globalClientId", generatedClientId);
  return generatedClientId;
}

function generateClientId() {
  const nanoid = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    32
  );
  return nanoid();
}
