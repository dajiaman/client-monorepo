import { customAlphabet } from "nanoid";

/**
 * 生成sessionId
 * @returns
 */
export function buildSessionId(): string {
  const nanoid = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    16
  );
  return nanoid();
}
