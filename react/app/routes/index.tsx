import { Route } from ".react-router/types/app/+types/root";
import { ConfigProvider, App as AntdApp, theme, notification } from "antd";
import { Outlet } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <ConfigProvider theme={{ cssVar: true }}>
      <AntdApp>
        <Outlet />
      </AntdApp>
    </ConfigProvider>
  );
}
