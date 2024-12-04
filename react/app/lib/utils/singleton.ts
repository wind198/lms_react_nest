import axios from "axios";
import { WEB_API_URL } from "./constants";

const apiHttpClient = axios.create({
  baseURL: WEB_API_URL,
  withCredentials: true,
  withXSRFToken: true,
});

export default apiHttpClient;
