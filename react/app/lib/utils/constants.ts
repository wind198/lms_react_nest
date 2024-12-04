import { IOrder } from "../types/common.type";

export const TOKEN_KEY = "TOKEN_KEY";
export const RF_TOKEN_KEY = "RF_TOKEN_KEY";
export const X_XSRF_TOKEN = "X-XSRF-TOKEN";
export const USER_KEY = "USER_KEY";

export const WEB_API_URL: string = import.meta.env.VITE_API_URL || "";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PER_PAGE = 10;
export const DEFAULT_ORDER_BY = "created_at";
export const DEFAULT_ORDER = "desc" as IOrder;
export const DEFAULT_PER_PAGE_ITEMS = [10, 25, 50, 100];

export const GENDER_LIST = ["FEMALE", "MALE"] as const;
export const EDUCATION_BACKGROUND_LIST = [
  "HIGH_SCHOOL",
  "UNIVERSITY_STUDENT",
  "GRADUATED",
  "MASTER",
  "PHD",
] as const;

export type IGender = (typeof GENDER_LIST)[number];
export type IEducationBackground = (typeof EDUCATION_BACKGROUND_LIST)[number];

export const IS_DEV = import.meta.env.DEV;

export const MAX_FIRST_NAME_LENGTH = 20;
export const MAX_PHONE_LENGTH = 25;
export const MAX_EMAIL_LENGTH = 50;
export const MAX_ADDRESS_LENGTH = 500;
export const MAX_TITLE_LENGTH = 50;
export const MAX_DESCRIPTION_LENGTH = 500;
export const JWT_ENCRYPT_SECRET_KEY = process.env.VITE_JWT_ENCRYPT_SECRET_KEY;
