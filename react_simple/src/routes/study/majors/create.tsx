import { NotificationContext } from "@/App";
import useApiHttpClient from "@/lib/hooks/useHttpClient";
import useIsEditPage from "@/lib/hooks/useIsEditPage";
import {
  ICourseCoreField,
  makeRandomCourse,
} from "@/lib/types/entities/course.entity";
import { IS_DEV } from "@/lib/utils/constants";
import { getOneUrl } from "@/lib/utils/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Space } from "antd";
import dayjs from "dayjs";
import { useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router";

type IFormData = ICourseCoreField;

const resource = "course";
const resourcePlural = "courses";

const CreateCourse = () => {
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
    [$patch, $post, id, isEdit]
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
        navigate("/study/" + resourcePlural);
      }
    },
  });

  const handleSubmit = (values: IFormData) => {
    // Format the DateTime field for dob
    const payload = {
      ...values,
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
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Title is required" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Space size={"small"}>
        <Form.Item>
          {IS_DEV && (
            <Button
              loading={isPending}
              onClick={() => {
                form.setFieldsValue(makeRandomCourse());
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

export default CreateCourse;
