import { IOrder } from "../types/common.type";

//CONFIGS.order

export const WEB_API_URL: string =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";
export const JWT_TOKEN_EXPIRATION = +(
  import.meta.env.VITE_JWT_TOKEN_EXPIRATION ?? 2 * 60
);
export const JWT_ENCRYPT_SECRET_KEY =
  import.meta.env.VITE_JWT_ENCRYPT_SECRET_KEY ?? "473F3839E6685DAC";

// CONSTATNS

export const TOKEN_KEY = "TOKEN_KEY";
export const RF_TOKEN_KEY = "RF_TOKEN_KEY";
export const X_XSRF_TOKEN = "X-XSRF-TOKEN";
export const USER_KEY = "USER_KEY";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PER_PAGE = 10;
export const DEFAULT_ORDER_BY = "created_at";
export const DEFAULT_ORDER = "desc" as IOrder;
export const DEFAULT_PER_PAGE_ITEMS = [10, 25, 50, 100];

export const IS_DEV = import.meta.env.DEV;
export const IS_PROD = import.meta.env.PROD;

export const MAX_FIRST_NAME_LENGTH = 20;
export const MAX_PHONE_LENGTH = 25;
export const MAX_EMAIL_LENGTH = 50;
export const MAX_ADDRESS_LENGTH = 500;
export const MAX_TITLE_LENGTH = 50;
export const MAX_DESCRIPTION_LENGTH = 500;

