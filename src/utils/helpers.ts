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

export const generateString = (len) => {
  const MAXLEN = len; /* tweak this */
  const MINLEN = len;
  function genString() {
    let array = crypto.randomBytes(MAXLEN).toJSON().data;
    array = Array.apply([], array); /* turn into non-typed array */
    array = array.filter((x) => (x > 32 && x < 127));
    /* strip non-printables: if we transform into desirable range we have a propability bias, so I suppose we better skip this character */
    return String.fromCharCode.apply(String, array); // eslint-disable-line
  }
  let tmp = genString();
  while (tmp.length < MINLEN) {
    /* unlikely too loop more than once.. */
    tmp += genString();
  }
  return tmp.substr(0, len);
};
