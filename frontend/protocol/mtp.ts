import crypto from "crypto";

export const keyObj = crypto.createECDH("secp256k1");

export const generateKeys = async (userId: string) => {
  keyObj.generateKeys();

  const publicKeyBase64 = keyObj.getPublicKey().toString("base64");
  const privateKeyBase64 = keyObj.getPrivateKey().toString("base64");

  localStorage.setItem(
    userId,
    JSON.stringify({
      privateKey: privateKeyBase64,
    })
  );

  try {
    const res = await fetch("/api/updateUserKey", {
      method: "post",
      body: JSON.stringify({
        userId: userId,
        publicKey: publicKeyBase64,
      }),
    });

    console.log(res.body);
  } catch (error) {
    console.log(error);
  }
};

export const encryptMessage = (conversationId: string, message: string) => {
  const iv = crypto.randomBytes(16);
  const sharedKeyString = localStorage.getItem(conversationId)!;
  const sharedKey = JSON.parse(sharedKeyString).sharedKey;
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(sharedKey, "hex"),
    iv
  );

  let encrypt = cipher.update(message, "utf8", "hex");
  encrypt += cipher.final("hex");

  const auth_tag = cipher.getAuthTag().toString("hex");

  const payload = iv.toString("hex") + encrypt + auth_tag;
  const payloadBase64 = Buffer.from(payload, "hex").toString("base64");

  return payloadBase64;
};

export const decryptMessage = (
  conversationId: string,
  encryptedMessage: string
) => {
  const payload = Buffer.from(encryptedMessage, "base64").toString("hex");

  const iv = payload.substr(0, 32);
  const encrypted = payload.substr(32, payload.length - 64);
  const auth_tag = payload.substr(payload.length - 32, 32);

  const sharedKeyString = localStorage.getItem(conversationId)!;
  const sharedKey = JSON.parse(sharedKeyString).sharedKey;

  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      Buffer.from(sharedKey, "hex"),
      Buffer.from(iv, "hex")
    );

    decipher.setAuthTag(Buffer.from(auth_tag, "hex"));

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error: any) {
    console.log(error.message);
  }
};
