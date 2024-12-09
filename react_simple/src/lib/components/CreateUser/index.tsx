import { NotificationContext } from "@/App";
import useApiHttpClient from "@/lib/hooks/useHttpClient";
import useIsEditPage from "@/lib/hooks/useIsEditPage";
import { IHasResource } from "@/lib/types/common.type";
import {
  EducationBackgroundList,
  GenderList,
  IUserCoreField,
  makeRandomUser,
  renderEducationBg,
  renderGender,
} from "@/lib/types/entities/user.entity";
import { IS_DEV } from "@/lib/utils/constants";
import { getOneUrl } from "@/lib/utils/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  notification,
  Row,
  Select,
  Space,
} from "antd";
import dayjs from "dayjs";
import { useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router";

type IProps = IHasResource;
type IFormData = IUserCoreField;

const CreateUser = ({ resource, resourcePlural = resource + "s" }: IProps) => {
  const [form] = Form.useForm<IFormData>();

  const { $post, $patch } = useApiHttpClient();

  const { state } = useLocation();

  const { isEdit } = useIsEditPage();

  const { id } = useParams();

  const sendStoreRequest = useCallback(
    async (payload: IFormData) => {
      if (!isEdit) {
        const { data } = await $post(resourcePlural, payload);
        return data;
      } else if (id) {
        const { data } = await $patch(getOneUrl(resourcePlural, id), payload);
        return data;
      }
    },
    [$patch, $post, id, isEdit, resourcePlural]
  );

  const { api } = useContext(NotificationContext);

  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: sendStoreRequest,
    onSuccess: () => {
      api?.success({
        message: t(`message.success.${isEdit ? "create" : "save"}`),
      });
    },
    onError: (error) => {
      console.error("store failed", error);
    },
    async onSettled(_, e) {
      await queryClient.invalidateQueries({ queryKey: [resourcePlural] });

      if (!e) {
        navigate("/human-management/" + resourcePlural);
      }
    },
  });

  const handleSubmit = (values: IFormData) => {
    // Format the DateTime field for dob
    const payload = {
      ...values,
      dob: dayjs(values.dob).toISOString(),
    };
    mutateAsync(payload);
  };

  const initialValues = useMemo(() => {
    if (!state?.recordData) {
      return;
    }
    return { ...state?.recordData, dob: dayjs(state.recordData.dob) };
  }, [state?.recordData]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues}
    >
      <Row gutter={8}>
        <Col span={12}>
          <Form.Item
            label="First Name"
            name="first_name"
            rules={[{ required: true, message: "First name is required" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[{ required: true, message: "Last name is required" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          {" "}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input type="email" />
          </Form.Item>
        </Col>
        <Col span={12}>
          {" "}
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { type: "string", message: "Please enter a valid phone number" },
            ]}
          >
            <Input type="phone" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={12}>
          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Gender is required" }]}
          >
            <Select placeholder="Select gender">
              {GenderList.map((g) => (
                <Select.Option key={g} value={g}>
                  {renderGender(g)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Date of Birth"
            name="dob"
            rules={[{ required: true, message: "Date of birth is required" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Address" name="address">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item
        label="Education Background"
        name="education_background"
        rules={[
          { required: true, message: "Education background is required" },
        ]}
      >
        <Select placeholder="Select education background">
          {EducationBackgroundList.map((g) => (
            <Select.Option key={g} value={g}>
              {renderEducationBg(g)}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Space size={"small"}>
        <Form.Item>
          {IS_DEV && (
            <Button
              loading={isPending}
              onClick={() => {
                form.setFieldsValue(makeRandomUser());
              }}
              type="default"
              htmlType="button"
            >
              Map data
            </Button>
          )}
        </Form.Item>
        <Form.Item>
          <Button loading={isPending} type="primary" htmlType="submit">
            {isEdit ? "Save" : "Submit"}
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );
};

export default CreateUser;
