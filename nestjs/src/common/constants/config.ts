export const FE_ORIGIN = process.env.FE_ORIGIN ?? 'https://localhost:5173';
export const NODE_ENV = process.env.NODE_ENV ?? 'development';
export const JWT_SECRET = process.env.JWT_SECRET ?? 'secret';
export const GMAIL_APP_PASSWORD =
  process.env.GMAIL_APP_PASSWORD ?? 'cnoq utrs attq anmz';
export const GMAIL = process.env.GMAIL ?? 'tuanbk1908@gmail.com';
export const PUBLIC_PATH = process.env.PUBLIC_PATH ?? 'public';
export const ROOT_USER_EMAIL =
  process.env.ROOT_USER_EMAIL ?? 'tuanbk1908@gmail.com';
export const ROOT_USER_PASSWORD = process.env.ROOT_USER_PASSWORD ?? '123123';
export const JWT_TOKEN_EXPIRATION = +(
  process.env.JWT_TOKEN_EXPIRATION ?? 60 * 2
);
export const RESET_PASS_EXPIRATION = +(
  process.env.RESET_PASS_EXPIRATION ?? 60 * 5
);
export const REFRESH_TOKEN_EXPIRATION =
  process.env.REFRESH_TOKEN_EXPIRATION ?? '7 days';
