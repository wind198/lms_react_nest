import Dexie, { EntityTable } from "dexie";

interface IToken {
  key: string;
  value: { iv: number[]; encrypted: number[] };
}
// Set up the IndexedDB database with Dexie
const jwtTokenDb = new Dexie("jwt_token_db") as Dexie & {
  tokens: EntityTable<IToken, "key">;
};
jwtTokenDb.version(1).stores({
  tokens: "key, value", // 'key' is the primary key
});

// Encryption Helper Functions
const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function generateKey(secret: string) {
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptData(data: string, secret: string) {
  const key = await generateKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization Vector
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(data)
  );
  return { iv, encrypted };
}

async function decryptData(
  encryptedData: BufferSource,
  iv: BufferSource,
  secret: string
) {
  const key = await generateKey(secret);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encryptedData
  );
  return decoder.decode(decrypted);
}

// Storing the JWT in IndexedDB
export async function storeJWT(jwt: string, secret: string) {
  const { iv, encrypted } = await encryptData(jwt, secret);
  await jwtTokenDb.tokens.put({
    key: "jwt",
    value: {
      iv: Array.from(iv), // Convert to storable array
      encrypted: Array.from(new Uint8Array(encrypted)), // Convert buffer to array
    },
  });
  console.log("JWT stored securely in IndexedDB");
}

export async function clearJWT() {
  await jwtTokenDb.tokens.delete("jwt");
  console.log("JWT cleared from IndexedDB");
}

// Retrieving the JWT from IndexedDB
export async function getJWT(secret: string) {
  const record = await jwtTokenDb.tokens.get("jwt");
  if (!record) {
    return null;
  }

  const iv = new Uint8Array(record.value.iv);
  const encrypted = new Uint8Array(record.value.encrypted);
  const jwt = await decryptData(encrypted, iv, secret);
  return jwt;
}
