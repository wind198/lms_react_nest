import { notification } from "antd";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import useAuthStore from "../store/useAuthStore";
import apiHttpClient from "@/lib/utils/singleton";
import { useContext } from "react";
import { NotificationContext } from "@/App";

export default function useApiHttpClient() {
  const { t } = useTranslation();

  const { api } = useContext(NotificationContext);

  const logout = useAuthStore((s) => s.logout);

  const navigate = useNavigate();

  const { pathname } = useLocation();

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
    api?.error({
      message: "Error",
      description: extractAxiosErrMsg(error),
    });
    if (statusCode === 401) {
      logout();
      if (pathname !== "/login") {
        navigate("/login", { state: { from: pathname } });
      }
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
