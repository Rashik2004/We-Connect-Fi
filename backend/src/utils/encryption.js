const CryptoJS = require('crypto-js');

const ENCRYPTION_SECRET = process.env.MESSAGE_SECRET || 'fallback-message-secret';

const deriveKey = (parts) => {
  return CryptoJS.SHA256(parts.filter(Boolean).join(':') + ENCRYPTION_SECRET).toString();
};

const getDirectKey = (userIdA, userIdB) => {
  const sorted = [userIdA.toString(), userIdB.toString()].sort();
  return deriveKey(sorted);
};

const getGroupKey = (groupId) => deriveKey([groupId.toString(), 'group']);

const encryptContent = (plaintext, key) => {
  if (!plaintext) return null;
  return CryptoJS.AES.encrypt(plaintext, key).toString();
};

const decryptContent = (ciphertext, key) => {
  if (!ciphertext) return null;
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = {
  getDirectKey,
  getGroupKey,
  encryptContent,
  decryptContent,
};

