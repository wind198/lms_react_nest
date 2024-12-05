import {
  AppstoreOutlined,
  BookOutlined,
  ClusterOutlined,
  DesktopOutlined,
  ReadOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, MenuProps, theme } from "antd";
import React, { useMemo, useState } from "react";
import { Link, Outlet } from "react-router";

type MenuItem = Required<MenuProps>["items"][number];

export default function HomeLayout() {
  const tokens = theme.useToken();

  const [collapsed, setCollapsed] = useState(false);

  const siderW = useMemo(() => (collapsed ? 80 : 250), []);

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      popupClassName: "hello",
    } as MenuItem;
  }

  const items: MenuItem[] = [
    getItem("Human Managements", "human-managements", <TeamOutlined />, [
      getItem(
        <Link to={"/human-management/students"}>Students</Link>,
        "student",
        <UserOutlined />
      ),
      getItem(
        <Link to="/human-management/Teachers">Teachers</Link>,
        "teacher",
        <ReadOutlined />
      ),
      getItem(
        <Link to="/human-management/Admins">Admins</Link>,
        "admin",
        <DesktopOutlined />
      ),
    ]),
    getItem("Study", "study", <BookOutlined />, [
      getItem(
        <Link to="/study/majors">Majors</Link>,
        "major",
        <AppstoreOutlined />
      ),
      getItem(
        <Link to="/study/courses">Courses</Link>,
        "course",
        <ClusterOutlined />
      ),
      getItem(
        <Link to="/study/classes">Classes</Link>,
        "class",
        <SettingOutlined />
      ),
    ]),
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      ></Layout.Header>
      <Layout>
        <Layout.Sider
          style={{
            backgroundColor: tokens.token["colorBgBase"],
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            insetInlineStart: 0,
            top: 0,
            bottom: 0,
            scrollbarWidth: "thin",
            scrollbarGutter: "stable",
            paddingTop: `${64 + 16}px`,
          }}
          width={siderW}
          collapsible
          collapsed={collapsed}
          onCollapse={(collapsed) => setCollapsed(collapsed)}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={[]}
            defaultOpenKeys={[]}
            items={items}
            style={{
              borderInlineEnd: "none",
            }}
          />
        </Layout.Sider>
        <Layout.Content style={{ padding: `0 0 0 ${siderW}px` }}>
          <div style={{ padding: '12px 16px' }}>
            <Outlet />
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
