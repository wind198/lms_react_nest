import AppAuthWrapper from "@/lib/components/AppAuthWrapper";
import HomeLayoutSider from "@/lib/components/HomeLayoutSider";
import useSetupTitleAndBreadcrumbs from "@/lib/hooks/useSetTitles";
import { Layout } from "antd";
import { useMemo, useState } from "react";
import { Outlet } from "react-router";

export default function HomeLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const siderW = useMemo(() => (collapsed ? 80 : 250), [collapsed]);

  useSetupTitleAndBreadcrumbs();

  return (
    <AppAuthWrapper>
      <Layout style={{ minHeight: "100vh" }}>
        <Layout.Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        ></Layout.Header>
        <Layout>
          <HomeLayoutSider
            siderW={siderW}
            collapsed={collapsed}
            onCollapse={(collapsed) => setCollapsed(collapsed)}
          ></HomeLayoutSider>
          <Layout.Content
            style={{
              padding: `0 0 0 ${siderW}px`,
              transition: `all 0.2s`,
            }}
          >
            <div style={{ padding: "12px 16px" }}>
              <Outlet />
            </div>
          </Layout.Content>
        </Layout>
      </Layout>
    </AppAuthWrapper>
  );
}
