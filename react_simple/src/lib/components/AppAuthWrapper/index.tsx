import { NotificationContext } from "@/App";
import useApiHttpClient from "@/lib/hooks/useHttpClient";
import useIntervalHook from "@/lib/hooks/useInterval";
import useAuthStore from "@/lib/store/useAuthStore";
import { getJWT } from "@/lib/utils/client-storage/jwt-token";
import { getUserData } from "@/lib/utils/client-storage/user-data";
import {
  JWT_ENCRYPT_SECRET_KEY,
  JWT_TOKEN_EXPIRATION,
} from "@/lib/utils/constants";
import { Flex, notification, Spin } from "antd";
import React, { PropsWithChildren, useCallback, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";

/**
 * This component is a wrapper to the app that handle authentication when user first navigates to the website
 */
export default function AppAuthWrapper({ children }: PropsWithChildren<{}>) {
  const {
    login,
    logout,
    setUserData,
    isAuthenticated,
    userData: currentUserDataInStore,
  } = useAuthStore();

  const { t } = useTranslation();

  const { api } = useContext(NotificationContext);

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const { $post } = useApiHttpClient();

  const refreshToken = useCallback(
    async (jwtToken: string) => {
      const {
        data: { token, userData },
      } = await $post("auth/refresh-token", { token: jwtToken });

      await login({ jwtToken: token, userData });
    },
    [$post, login]
  );
  const runOnInterval = useCallback(async () => {
    const [userDataFromDb, jwtToken] = await Promise.all([
      getUserData(),
      getJWT(JWT_ENCRYPT_SECRET_KEY),
    ]);
    if (!userDataFromDb || !jwtToken) {
      await logout();
      navigate("/login", { state: { from: pathname } });
      api?.info({ message: t("messages.info.pleaseLogin") });
      return;
    }
    if (!currentUserDataInStore) {
      setUserData(userDataFromDb);
    }
    await refreshToken(jwtToken);
  }, [
    api,
    currentUserDataInStore,
    logout,
    navigate,
    pathname,
    refreshToken,
    setUserData,
    t,
  ]);

  useIntervalHook({
    callback: runOnInterval,
    interval: Math.round(JWT_TOKEN_EXPIRATION * 0.9) * 1000,
    shouldRunImmediately: true,
  });

  if (!isAuthenticated) {
    return (
      <Flex
        className="app-auth-wrapper"
        style={{ width: "100vw", height: "100vh" }}
        justify="center"
        align="center"
      >
        <Spin></Spin>
      </Flex>
    );
  }

  return <div className="app-auth-wrapper">{children}</div>;
}
