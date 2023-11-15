import JSEncrypt from "jsencrypt";

/**
 * RSA解密
 * @param privateKey 私钥
 * @param cipherText 密文
 * @returns {*} 明文
 */
export function decryptByRSA(privateKey: string, cipherText: string) {
	const decrypter = new JSEncrypt();
	decrypter.setPrivateKey(privateKey);
	return decrypter.decrypt(cipherText);
}
