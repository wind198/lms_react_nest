import { useRoutes } from "react-router";
import { allRoutes } from "./routes/allRoutes";
import useSetupTitleAndBreadcrumbs from "@/lib/hooks/useSetTitles";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { notification } from "antd";
import AppConfirmDialog from "@/lib/components/AppConfirmDialog/index";
import { createContext, useEffect } from "react";
import { NotificationInstance } from "antd/es/notification/interface";
import AppLongTextDialog from "@/lib/components/AppLongTextDialog/index";

export const NotificationContext = createContext<{
  api: null | NotificationInstance;
}>({
  api: null,
});

function App() {
  const routes = useRoutes(allRoutes);

  const [api, contextHolder] = notification.useNotification();

  return (
    <NotificationContext.Provider value={{ api }}>
      <div id="app">
        {routes}
        <ReactQueryDevtools />
        {contextHolder}
        <AppConfirmDialog />
        <AppLongTextDialog />
      </div>
    </NotificationContext.Provider>
  );
}

export default App;
