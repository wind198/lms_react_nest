import { Button, Form, Input, notification, Typography } from "antd";
import { CSSProperties, useCallback, useTransition } from "react";
import useApiHttpClient from "../../../lib/hooks/useHttpClient";
import { IUser } from "@/lib/types/entities/user.entity";
import useAuthStore from "@/lib/store/useAuthStore";
import { useTranslation } from "react-i18next";

const LabelColumnStyles: CSSProperties = {
  minWidth: 100,
  textAlign: "left",
  padding: "0px 8px 0px",
};

type IFormData = { email: string; password: string };

type ILoginResponse = {
  userData: IUser;
  token: string;
};

export default function Login() {
  const login = useAuthStore((s) => s.login);

  const { t } = useTranslation();

  const [form] = Form.useForm<IFormData>();

  const { $post } = useApiHttpClient();

  const onFinish = useCallback(async (data: IFormData) => {
    const { data: resData } = await $post<ILoginResponse>("/auth/login", data);
    login({ jwtToken: resData.token, userData: resData.userData });
    notification.success({ message: t("messages.info.welcomeBack") });
  }, []);

  return (
    <Form
      onFinish={onFinish}
      form={form}
      style={{ width: "100%", maxWidth: 600 }}
    >
      <Typography>
        <Typography.Title level={2}>Welcome to LMS system</Typography.Title>
        <Typography.Paragraph>Please login to continue</Typography.Paragraph>
      </Typography>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true }]}
        labelCol={{ style: LabelColumnStyles }}
      >
        <Input type="email" />
      </Form.Item>
      <Form.Item
        labelCol={{ style: LabelColumnStyles }}
        name="password"
        label="Password"
        rules={[{ required: true }]}
      >
        <Input type="password" />
      </Form.Item>
      <Button htmlType="submit" type="primary" variant="solid">
        Login
      </Button>
    </Form>
  );
}
