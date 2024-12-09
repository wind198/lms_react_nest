import AppBreadcrumbs from "@/lib/components/AppBreadcrumbs";
import usePageMetaStore from "@/lib/store/usePageMetaStore";
import { Card, Flex, Typography } from "antd";
import { Outlet } from "react-router";

export default function HumanManagementLayout() {
  const { pageTitle } = usePageMetaStore();

  return (
    <Card
      title={
        <Flex
          justify="space-between"
          style={{ padding: "8px 0" }}
          align="flex-start"
        >
          <Flex vertical style={{ width: "100%" }}>
            <AppBreadcrumbs />
            <Flex justify="space-between" align="center">
              <Typography.Title level={2} style={{ margin: 0 }}>
                {pageTitle}
              </Typography.Title>
            </Flex>
          </Flex>
        </Flex>
      }
    >
      <Outlet />
    </Card>
  );
}
