import useSetupTitleAndBreadcrumbs from "@/lib/hooks/useSetTitles";
import { Row, Col, Flex } from "antd";
import { theme } from "antd";
import { Outlet } from "react-router";

export default function AuthLayout() {
  const tokens = theme.useToken();
  useSetupTitleAndBreadcrumbs();

  return (
    <Row>
      <Col
        style={{ backgroundColor: tokens.token["blue-5"], height: "100vh" }}
        span={12}
      ></Col>
      <Col span={12}>
        <Flex
          vertical
          justify="center"
          align="flex-start"
          style={{ height: "100%", padding: "24px" }}
        >
          <Outlet />
        </Flex>
      </Col>
    </Row>
  );
}
