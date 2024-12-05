import axios from "axios";
import { JWT_ENCRYPT_SECRET_KEY, WEB_API_URL } from "./constants";
import { getJWT } from "@/lib/utils/client-storage/jwt-token";

const apiHttpClient = axios.create({
  baseURL: WEB_API_URL,
  withCredentials: true,
  withXSRFToken: true,
});

apiHttpClient.interceptors.request.use(async function (config) {
  const jwt = await getJWT(JWT_ENCRYPT_SECRET_KEY);
  if (jwt) {
    config.headers.Authorization = "Bearer " + jwt;
  }
  return config;
});

export default apiHttpClient;
