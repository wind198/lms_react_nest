import { IUser } from "@/lib/types/entities/user.entity";
import Dexie, { EntityTable } from "dexie";

interface IUserData {
  key: string;
  value: IUser;
}
// Set up the IndexedDB database with Dexie
const userDataDb = new Dexie("user_data_db") as Dexie & {
  tokens: EntityTable<IUserData, "key">;
};
userDataDb.version(1).stores({
  tokens: "key, value", // 'key' is the primary key
});

// Storing the UserData in IndexedDB
export async function storeUserData(user: IUser) {
  await userDataDb.tokens.put({
    key: "user",
    value: user,
  });
  console.log("User data stored securely in IndexedDB");
}

export async function clearUserData() {
  await userDataDb.tokens.delete("jwt");
  console.log("User data cleared from IndexedDB");
}

// Retrieving the UserData from IndexedDB
export async function getUserData() {
  const record = await userDataDb.tokens.get("user");
  if (!record) {
    return null;
  }

  return record.value;
}
