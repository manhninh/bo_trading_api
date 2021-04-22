import crypto from "crypto";

export const delay = (ms) => {
  new Promise((resolve) => {
    setTimeout(() => resolve(true), ms);
  });
};

export const encrypt = (id: string, value: string) => {
  const initialization_vector = crypto.randomBytes(16);
  const key = crypto.createHash('sha256').update(String(id)).digest('base64').substr(0, 32);

  const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(key), initialization_vector);

  const encrypted = Buffer.concat([cipher.update(value), cipher.final()]);

  return initialization_vector.toString('hex') + ':' + encrypted.toString('hex');
};

export const decrypt = (id: string, hash: string) => {
  const textParts = hash.split(':');
  const initialization_vector = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const key = crypto.createHash('sha256').update(String(id)).digest('base64').substr(0, 32);
  const decipher = crypto.createDecipheriv('aes-256-ctr', key, initialization_vector);

  const decrpyted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

  return decrpyted.toString();
};