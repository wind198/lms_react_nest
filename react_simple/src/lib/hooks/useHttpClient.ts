import { notification } from "antd";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import useAuthStore from "../store/useAuthStore";
import apiHttpClient from "@/lib/utils/singleton";

export default function useApiHttpClient() {
  const { t } = useTranslation();

  const logout = useAuthStore((s) => s.logout);

  const navigate = useNavigate();

  const extractAxiosErrMsg = (error: AxiosError) => {
    const unExpectedErrorMsg = t("messages.error.unexpectedError");
    if (error.response) {
      // If the server responded with a status code out of the range of 2xx
      // @ts-expect-error
      return error.response.data?.message || unExpectedErrorMsg;
    }

    return unExpectedErrorMsg;
  };

  const handleHttpErr = (error: any) => {
    const statusCode = (error as AxiosError)?.status;
    notification.error({
      message: "Error",
      description: extractAxiosErrMsg(error),
    });
    if (statusCode === 401) {
      logout();
      navigate("/auth/login");
    }
    throw error;
  };

  const $get = async <T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ) => {
    try {
      const data = await apiHttpClient.get<T, R, D>(url, config);
      return data;
    } catch (error) {
      return handleHttpErr(error);
    }
  };
  const $post = async <T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data: D,
    config?: AxiosRequestConfig<D>
  ) => {
    try {
      const res = await apiHttpClient.post<T, R, D>(url, data, config);
      return res;
    } catch (error) {
      return handleHttpErr(error);
    }
  };
  const $patch = async <T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ) => {
    try {
      const res = await apiHttpClient.patch<T, R, D>(url, data, config);
      return res;
    } catch (error) {
      return handleHttpErr(error);
    }
  };

  const $delete = <T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ) => {
    try {
      return apiHttpClient.delete<T, R, D>(url, config);
    } catch (error) {
      return handleHttpErr(error);
    }
  };

  return { $get, $post, $patch, $delete };
}
