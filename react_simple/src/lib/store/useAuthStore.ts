import { IUser } from "@/lib/types/entities/user.entity";
import { clearJWT, storeJWT } from "@/lib/utils/client-storage/jwt-token";
import {
  clearUserData,
  getUserData,
  storeUserData,
} from "@/lib/utils/client-storage/user-data";
import { JWT_ENCRYPT_SECRET_KEY } from "@/lib/utils/constants";
import { create } from "zustand";
type IAuthStoreData = {
  userData?: IUser;
  isAuthenticated?: boolean;
  login: (p: ILoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  setUserData: (i: IUser) => void;
};

type ILoginPayload = {
  userData: IUser;
  jwtToken: string;
};
const useAuthStore = create<IAuthStoreData>((set) => {
  return {
    userData: undefined,
    isAuthenticated: false,
    login: async (payload: ILoginPayload) => {
      if (!JWT_ENCRYPT_SECRET_KEY) {
        throw new Error("JWT_ENCRYPT_SECRET_KEY is not defined");
      }
      await Promise.all([
        storeJWT(payload.jwtToken, JWT_ENCRYPT_SECRET_KEY),
        storeUserData(payload.userData),
      ]);
      set({ isAuthenticated: true, userData: payload.userData });
    },
    logout: async () => {
      set({ isAuthenticated: false, userData: undefined });
      await Promise.all([clearJWT(), clearUserData()]);
    },
    setUserData(i) {
      set({ userData: i });
    },
  };
});

export default useAuthStore;
