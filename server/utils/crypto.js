import sha256 from "crypto-js/sha256.js";
import aes256 from "crypto-js/aes.js";
import encHex from "crypto-js/enc-hex.js";
import utf8 from "crypto-js/enc-utf8.js";
import blockCipherMode from "crypto-js/mode-cfb.js";
import paddingPKCS7 from "crypto-js/pad-pkcs7.js  ";
import { v4 } from "uuid";

export const toSHA256 = (plainText) => {
  const utfString = utf8.parse(plainText);
  return sha256(utfString).toString(encHex);
};

export const stableStringify = (obj) => {
  // import stringify from "json-stable-stringify";
  // return stringify(obj);
  return JSON.stringify(obj);
};

export const toBase64 = (plainText) => {
  return Buffer.from(plainText).toString("base64");
};

export const fromBase64 = (hash) => {
  return Buffer.from(hash, "base64").toString("ascii");
};

export const getSignatureHash = (body, apiKey) => {
  try {
    const plainText = `${stableStringify(body)}${apiKey}`;
    return toSHA256(plainText);
  } catch (error) {
    console.log(error);
    return "";
  }
};

export const getAuthorizationHash = (merchantKey, merchantPassphrase) => {
  return `Basic ${toBase64(`${merchantKey}:${merchantPassphrase}`)}`;
};

export const getMerchantKeyAndPassphrase = (authorizationHash = "") => {
  try {
    const hash = fromBase64(authorizationHash.split(" ")?.[1]);
    const merchantKey = hash.split(":")?.[0];
    const merchantPassphrase = hash.split(":")?.[1];
    return { merchantKey, merchantPassphrase };
  } catch (error) {
    return { merchantKey: "", merchantPassphrase: "" };
  }
};

export const aesEncrypt = (data, iv) => {
  const key = utf8.parse(process.env.AES_ENCRYPTION_SECRET_KEY);
  const parsedIv = utf8.parse(iv);
  const cipher = aes256.encrypt(data, key, {
    iv: parsedIv,
    mode: blockCipherMode,
    padding: paddingPKCS7
  });
  return cipher.toString();
};

export const aesDecrypt = (data, iv) => {
  const key = utf8.parse(process.env.AES_ENCRYPTION_SECRET_KEY);
  const parsedIv = utf8.parse(iv);
  const cipher = aes256.decrypt(data, key, {
    iv: parsedIv,
    mode: blockCipherMode,
    padding: paddingPKCS7
  });
  return cipher.toString(utf8);
};

export const getUniquePassphrase = () => {
  const uuid = v4();
  return uuid.replace(/-/g, "").toUpperCase();
};

export const verifySignature = (signature, body, ApiKeyHash, passphrase) => {
  const generatedSignature = generateSignatureHash(ApiKeyHash, passphrase, body);
  return generatedSignature === signature;
};

export const generateSignatureHash = (ApiKeyHash, passphrase, body) => {
  const apiKey = aesDecrypt(ApiKeyHash, passphrase);
  const generatedSignature = getSignatureHash(body, apiKey);
  return generatedSignature;
};
