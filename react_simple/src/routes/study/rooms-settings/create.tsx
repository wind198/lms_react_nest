import { NotificationContext } from "@/App";
import FillSpace from "@/lib/components/common/FillSpace/index";
import SelectWeekdays from "@/lib/components/common/SelectWeekdays/index";
import useApiHttpClient from "@/lib/hooks/useHttpClient";
import useIsEditPage from "@/lib/hooks/useIsEditPage";
import { IStringOrNumber } from "@/lib/types/common.type";
import { IRoomOpenTimeCoreField } from "@/lib/types/entities/room-open-time.entity";
import {
  IRoomSettingCoreField,
  makeRandomRoomSetting,
} from "@/lib/types/entities/room-setting.entity";
import { IS_DEV } from "@/lib/utils/constants";
import { countMinuteFromHourString, getOneUrl } from "@/lib/utils/helpers";
import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  TimePicker,
  Typography,
} from "antd";
import FormItem from "antd/es/form/FormItem/index";
import dayjs, { Dayjs } from "dayjs";
import { range } from "lodash-es";
import { Fragment, useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router";

type IFormData = Pick<
  IRoomSettingCoreField,
  "title" | "description" | "capacity"
> & {
  room_open_times: {
    week_days: IStringOrNumber[];
    start_time: Dayjs;
    end_time: Dayjs;
  }[];
  dates_off: {
    value: Dayjs;
    repeat?: boolean;
  }[];
};

const resource = "room-setting";
const resourcePlural = "room-settings";

const CreateRoomSetting = () => {
  const [form] = Form.useForm<IFormData>();

  const { $post, $patch } = useApiHttpClient();

  const { state } = useLocation();

  const { isEdit } = useIsEditPage();

  const { id } = useParams();

  const sendStoreRequest = useCallback(
    async (payload: any) => {
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

  const handleSubmit = useCallback(
    async (values: IFormData) => {
      const { dates_off, room_open_times, ...o } = values;
      const payload = {
        ...o,
        dates_off: dates_off
          .filter((i) => i.repeat)
          .map((i) => {
            return dayjs(i.value).format("MM-DD");
          }),
        dates_off_once: dates_off
          .filter((i) => !i.repeat)
          .map((i) => {
            return dayjs(i.value).format("YYYY-MM-DD");
          }),
        openTimes: room_open_times.map(
          ({ end_time, start_time, week_days }) => {
            return {
              week_days: week_days
                .map((i) => {
                  if (typeof i === "number") {
                    return i;
                  }
                  const [start, end] = i.split(",").map((i) => parseInt(i));
                  return range(end - start + 1).map(
                    (_, index) => start + index
                  );
                })
                .flat()
                .map((i) => parseInt(i)),
              start_time: countMinuteFromHourString(
                dayjs(start_time).format("HH:mm")
              ),
              end_time: countMinuteFromHourString(
                dayjs(end_time).format("HH:mm")
              ),
            } as IRoomOpenTimeCoreField;
          }
        ),
      };

      await mutateAsync(payload);
    },
    [mutateAsync]
  );

  const initialValues = useMemo(() => {
    if (!state?.recordData) {
      return {
        room_open_times: [
          {
            week_days: null,
            start_time: null,
            end_time: null,
          },
        ] as any,
        capacity: 10,
      } as Partial<IRoomSettingCoreField>;
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
      <Row gutter={16}>
        <Col span={12}>
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
          <Form.Item
            label="Capacity"
            name="capacity"
            rules={[{ required: true, message: "Capacity is required" }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <FormItem label="Open times">
            <Form.List
              name="room_open_times"
              rules={[
                {
                  validator(_, fieldValue) {
                    if (!fieldValue || !fieldValue.length) {
                      return Promise.reject(
                        new Error("At leat 1 open time must be provided")
                      );
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            >
              {(f, { add, remove }, { errors }) => {
                return (
                  <>
                    {f.map(({ key, name }, index) => (
                      <Fragment key={key}>
                        <Flex align={"flex-start"}>
                          <Form.Item
                            name={[name]}
                            rules={[
                              {
                                validator(_, fieldValue) {
                                  const { start_time, end_time } = fieldValue;

                                  if (
                                    start_time &&
                                    end_time &&
                                    (end_time.isSame(start_time) ||
                                      end_time.isBefore(start_time))
                                  ) {
                                    return Promise.reject(
                                      "Invalid start time and end time"
                                    );
                                  }
                                  return Promise.resolve();
                                },
                              },
                            ]}
                          >
                            <Row
                              style={{ flex: 1 }}
                              gutter={8}
                              justify={"space-between"}
                            >
                              <Col>
                                <Form.Item
                                  label={`Week days`}
                                  name={[name, "week_days"]}
                                  style={{ marginBottom: 0 }}
                                  rules={[
                                    { required: true, message: "Required" },
                                  ]}
                                >
                                  <SelectWeekdays
                                    style={{ minWidth: 160, maxWidth: 200 }}
                                    mode="multiple"
                                  />
                                </Form.Item>
                              </Col>
                              <Col>
                                <Form.Item
                                  label={`Start time`}
                                  name={[name, "start_time"]}
                                  style={{ marginBottom: 0 }}
                                  rules={[
                                    { required: true, message: "Required" },
                                  ]}
                                >
                                  <TimePicker showSecond={false} />
                                </Form.Item>
                              </Col>
                              <Col>
                                <Form.Item
                                  label={`End time`}
                                  name={[name, "end_time"]}
                                  style={{ marginBottom: 0 }}
                                  rules={[
                                    { required: true, message: "Required" },
                                  ]}
                                >
                                  <TimePicker showSecond={false} />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Form.Item>

                          <Button
                            variant="filled"
                            shape="circle"
                            color="danger"
                            style={{
                              marginTop: 30,
                              marginLeft: 8,
                              visibility: index ? "visible" : "hidden",
                            }}
                            onClick={() => {
                              if (!index) {
                                return;
                              }
                              remove(index);
                            }}
                          >
                            <DeleteOutlined />
                          </Button>
                        </Flex>
                      </Fragment>
                    ))}
                    <Button
                      type="dashed"
                      style={{ width: "100%", marginTop: 8 }}
                      onClick={() =>
                        add({
                          week_days: null,
                          start_time: null,
                          end_time: null,
                        })
                      }
                    >
                      Add open time
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </>
                );
              }}
            </Form.List>
          </FormItem>
        </Col>

        <Col span="12">
          <Form.Item label="Dates off">
            <Form.List name="dates_off">
              {(f, { add, remove }) => {
                return (
                  <>
                    {!!f.length && (
                      <Row style={{ marginBottom: 8, padding: "0 8px" }}>
                        <Col span={16}>Date</Col>
                        <Col span={6}>Repeat</Col>
                        <Col span={2}></Col>
                      </Row>
                    )}
                    {f.map(({ key, name }, index) => {
                      return (
                        <Fragment key={key}>
                          <Row style={{ marginBottom: 8, padding: "0 8px" }}>
                            <Col span={16}>
                              <FormItem
                                rules={[
                                  { required: true, message: "Required" },
                                ]}
                                name={[name, "value"]}
                                style={{ flex: 1 }}
                              >
                                <DatePicker></DatePicker>
                              </FormItem>
                            </Col>
                            <Col span={6}>
                              <Form.Item
                                valuePropName="checked"
                                name={[name, "repeat"]}
                              >
                                <Checkbox style={{ marginTop: 6 }}></Checkbox>
                              </Form.Item>
                            </Col>
                            <Col span={2}>
                              <Button
                                shape="circle"
                                variant="text"
                                color="danger"
                                onClick={() => remove(index)}
                              >
                                <DeleteOutlined />
                              </Button>
                            </Col>
                          </Row>
                        </Fragment>
                      );
                    })}
                    <Button
                      type="dashed"
                      style={{ width: "100%", marginTop: 8 }}
                      onClick={() => {
                        add({ value: null, repeat: true });
                      }}
                    >
                      Add date off
                    </Button>
                  </>
                );
              }}
            </Form.List>
          </Form.Item>

          <Space direction="vertical"></Space>
        </Col>
      </Row>

      <Flex style={{ width: "100%" }}>
        <FillSpace />
        <Form.Item style={{ marginRight: 8 }}></Form.Item>
        <Form.Item>
          <Button loading={isPending} type="primary" htmlType="submit">
            {isEdit ? "Save" : "Submit"}
          </Button>
        </Form.Item>
      </Flex>
    </Form>
  );
};

export default CreateRoomSetting;
