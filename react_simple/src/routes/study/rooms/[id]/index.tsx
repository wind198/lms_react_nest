import FillSpace from "@/lib/components/common/FillSpace/index";
import NotFound from "@/lib/components/common/NotFoundErr/index";
import RecordDetailLoading from "@/lib/components/common/RecordDetailLoading/index";
import UnknownErr from "@/lib/components/common/UnknownErr/index";
import useGetOne from "@/lib/hooks/useGetOne";
import { IRoomOpenTime } from "@/lib/types/entities/room-open-time.entity";
import { IRoomSetting } from "@/lib/types/entities/room-setting.entity";
import { IRoom } from "@/lib/types/entities/room.entity";
import { formatOpenTimes } from "@/lib/utils/helpers";
import { ClockCircleTwoTone, EditOutlined } from "@ant-design/icons";
import { Button, Col, Descriptions, Flex, Row, Space } from "antd";
import dayjs from "dayjs";
import { startCase, upperFirst } from "lodash-es";
import { useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Fragment } from "react/jsx-runtime";

const resource = "room";
const resourcePlural = "rooms";

const ShowRoom = () => {
  const { id } = useParams();

  const { state } = useLocation();

  const {
    data: room,
    isNotFoundErr,
    isError,
    isLoading,
  } = useGetOne<IRoom>({
    id: id,
    resource,
    resourcePlural,
    placeholderData: state?.recordData,
  });

  const navigate = useNavigate();

  const renderRoomOpenTimes = useCallback((openTimes: IRoomOpenTime[]) => {
    if (!openTimes?.length) {
      return null;
    }

    return (
      <Space size={"small"}>
        {formatOpenTimes(openTimes).map((i) => (
          <Flex key={i.week_days_label}>
            {i.week_days_label}{" "}
            <ClockCircleTwoTone style={{ margin: "0 6px" }} />{" "}
            {i.time.join(", ")}
          </Flex>
        ))}
      </Space>
    );
  }, []);

  if (!id) {
    return null;
  }

  if (isLoading) {
    return <RecordDetailLoading />;
  }
  if (isNotFoundErr) {
    return <NotFound />;
  }
  if (isError) {
    return <UnknownErr />;
  }
  if (!room) {
    return null;
  }
  return (
    <div className="show-room">
      <Flex style={{ marginBottom: 8 }}>
        <FillSpace />
        <Button
          type="primary"
          icon={<EditOutlined />}
          role="navigation"
          onClick={() => {
            navigate(
              {
                pathname: `/study/${resourcePlural}/${id}/edit`,
              },
              {
                state: {
                  recordData: room,
                },
              }
            );
          }}
        >
          Edit
        </Button>
      </Flex>
      <Descriptions bordered size="small" column={1}>
        <Descriptions.Item label="Title">{room.title}</Descriptions.Item>
        <Descriptions.Item label="Description">
          {room.description}
        </Descriptions.Item>
        <Descriptions.Item label="Address">{room.address}</Descriptions.Item>
        <Descriptions.Item label="Settings">
          <Space direction="vertical" style={{ width: "100%" }}>
            {Object.entries(room.room_setting ?? {})
              .filter(([k]) =>
                (
                  [
                    "title",
                    "capacity",
                    "dates_off",
                    "room_open_times",
                  ] as (keyof IRoomSetting)[]
                ).includes(k)
              )
              .map(([k, v]) => {
                const label = upperFirst(startCase(k).toLowerCase());
                let value: any;
                if (typeof v === "string" || typeof v === "number") {
                  value = v.toString();
                } else if (!v) {
                  value = "";
                } else if (k === "dates_off") {
                  value = room.room_setting.dates_off
                    .map((i) => dayjs(i).format("DD/MM"))
                    .concat(
                      room.room_setting.dates_off_once.map((i) =>
                        dayjs(i).format("DD/MM/YYYY")
                      )
                    );
                } else {
                  value = renderRoomOpenTimes(v as any);
                }
                return (
                  <Row key={k} gutter={8}>
                    <Col span={4} style={{ minWidth: 100 }}>
                      <Flex justify="space-between">
                        <span>{label}</span> <span>:</span>
                      </Flex>
                    </Col>
                    <Col span={20}>{value}</Col>
                  </Row>
                );
              })}
          </Space>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default ShowRoom;
