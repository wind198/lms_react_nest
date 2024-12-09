import { NotificationContext } from "@/App";
import { IUser } from "@/lib/types/entities/user.entity";
import { IS_DEV } from "@/lib/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, Typography } from "antd";
import { CSSProperties, useCallback, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import useApiHttpClient from "../../../lib/hooks/useHttpClient";
import useAuthStore from "../../../lib/store/useAuthStore";

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

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { api } = useContext(NotificationContext);

  const { t } = useTranslation();

  const [form] = Form.useForm<IFormData>();

  const { $post } = useApiHttpClient();

  const { state = {} } = useLocation();

  const navigate = useNavigate();

  // Run only once on initialization
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, []);

  const sendLoginRequest = useCallback(
    async (data: IFormData) => {
      const { data: resData } = await $post<ILoginResponse>(
        "/auth/login",
        data
      );
      await login({ jwtToken: resData.token, userData: resData.userData });
      api?.success({ message: t("messages.info.welcomeBack") });
      navigate(state?.from ?? "/");
    },
    [$post, api, login, navigate, state?.from, t]
  );

  const { mutateAsync, isPending } = useMutation({
    mutationFn: sendLoginRequest,
  });

  return (
    <Form
      onFinish={async (data) => {
        mutateAsync(data);
      }}
      form={form}
      style={{ width: "100%", maxWidth: 600 }}
      initialValues={
        !IS_DEV
          ? undefined
          : { email: "tuanbk1908@gmail.com", password: "password" }
      }
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
      <Button
        loading={isPending}
        htmlType="submit"
        type="primary"
        variant="solid"
      >
        Login
      </Button>
    </Form>
  );
}
