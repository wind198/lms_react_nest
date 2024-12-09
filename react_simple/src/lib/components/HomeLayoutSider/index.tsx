import React, { ReactNode, useLayoutEffect, useState } from "react";
import { Layout, Menu, theme } from "antd";
import type { MenuProps } from "antd";
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
import { NavLink, useLocation } from "react-router";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { maxBy } from "lodash-es";

type MenuItem = {
  label: ReactNode;
  key: string;
  icon: ReactNode;
  children?: MenuItem[];
  to?: string;
};

interface SiderComponentProps {
  siderW: number;
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const renderMenuItem = (i: MenuItem): ItemType<MenuItemType> => {
  const { icon, key, label, children, to } = i;

  return {
    key,
    icon,
    label: !to ? (
      label
    ) : (
      <NavLink to={to} data-key={key}>
        {label}
      </NavLink>
    ),
    children: !children?.length
      ? undefined
      : children?.map((k) => renderMenuItem(k)),
  } as ItemType<MenuItemType>;
};

const menuItems = [
  {
    label: "Human Managements",
    key: "human-managements",
    icon: <TeamOutlined />,
    children: [
      {
        label: "Students",
        to: "/human-management/students",
        key: "student",
        icon: <UserOutlined />,
      },
      {
        label: "Teachers",
        to: "/human-management/teachers",
        key: "teacher",
        icon: <ReadOutlined />,
      },
      {
        label: "Admins",
        to: "/human-management/admins",
        key: "admin",
        icon: <DesktopOutlined />,
      },
    ],
  },
  {
    label: "Study",
    key: "study",
    icon: <BookOutlined />,
    children: [
      {
        label: "Majors",
        key: "major",
        to: "/study/majors",
        icon: <AppstoreOutlined />,
      },
      {
        label: "Courses",
        key: "course",
        to: "/study/courses",
        icon: <ClusterOutlined />,
      },
      {
        label: "Rooms",
        key: "room",
        to: "/study/rooms",
        icon: <BookOutlined />,
      },
      {
        label: "Room settings",
        key: "room-setting",
        to: "/study/room-settings",
        icon: <SettingOutlined />,
      },
    ],
  },
] as MenuItem[];

const menuItemsNodes = menuItems.map(renderMenuItem);

const HomeLayoutSider: React.FC<SiderComponentProps> = ({
  siderW,
  collapsed,
  onCollapse,
}) => {
  const tokens = theme.useToken();

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const getLinks = (i: MenuItem[], parents: string[] = []) => {
      const output = [] as { to: string; key: string; groups?: string[] }[];
      i.forEach(({ key, to, children }) => {
        if (to) {
          output.push({ key, to, groups: [...parents] });
        }
        if (children?.length) {
          output.push(...getLinks(children, [...parents, key]));
        }
      });
      return output;
    };

    const allLinks = getLinks(menuItems);
    const active = maxBy(
      allLinks.filter(({ to }) => pathname.startsWith(to)),
      (i) => i.to.length
    );
    if (active) {
      setSelectedKeys([active.key]);
      if (active.groups?.length) {
        setOpenKeys(active.groups);
      }
    }
  }, []);

  return (
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
      onCollapse={onCollapse}
    >
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        onSelect={({ selectedKeys }) => {
          setSelectedKeys(selectedKeys);
        }}
        openKeys={openKeys}
        onOpenChange={(v) => setOpenKeys(v)}
        style={{
          borderInlineEnd: "none",
        }}
        items={menuItemsNodes}
      ></Menu>
    </Layout.Sider>
  );
};

export default HomeLayoutSider;
