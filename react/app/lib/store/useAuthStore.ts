import { IUser } from "@/lib/types/entities/user.entity";
import { JWT_ENCRYPT_SECRET_KEY } from "@/lib/utils/constants";
import {
  clearJWT,
  getJWT,
  storeJWT,
} from "@/lib/utils/client-storage/jwt-token";
import { create } from "zustand";
import { getUserData } from "@/lib/utils/client-storage/user-data";
type IAuthStoreData = {
  userData?: IUser;
  isAuthenticated?: boolean;
  login: (p: ILoginPayload) => void;
  logout: () => void;
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
      set({ isAuthenticated: true, userData: payload.userData });

      await storeJWT(payload.jwtToken, JWT_ENCRYPT_SECRET_KEY);
    },
    logout: async () => {
      set({ isAuthenticated: false, userData: undefined });
      await clearJWT();
    },
    fetchData: async () => {
      const userData = (await getUserData()) ?? undefined;
      set({ userData });
    },
  };
});

export default useAuthStore;
