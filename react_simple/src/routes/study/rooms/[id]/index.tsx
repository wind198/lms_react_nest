import FillSpace from "@/lib/components/common/FillSpace/index";
import NotFound from "@/lib/components/common/NotFoundErr/index";
import RecordDetailLoading from "@/lib/components/common/RecordDetailLoading/index";
import UnknownErr from "@/lib/components/common/UnknownErr/index";
import useGetOne from "@/lib/hooks/useGetOne";
import useRenderRoomSettingDetails from "@/lib/hooks/useRenderRoomSettingDetails";
import { IRoomOpenTime } from "@/lib/types/entities/room-open-time.entity";
import { IRoom } from "@/lib/types/entities/room.entity";
import { formatOpenTimes } from "@/lib/utils/helpers";
import { ClockCircleTwoTone, EditOutlined } from "@ant-design/icons";
import { Button, Descriptions, Flex, Space } from "antd";
import { useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

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

  const { roomSettingDetails } = useRenderRoomSettingDetails({
    roomSetting: room?.room_setting,
    hideDescriptiveFields: true,
  });

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
          {room.room_setting ? (
            <Descriptions size="small" column={1}>
              {roomSettingDetails}
            </Descriptions>
          ) : (
            "Not configured yet"
          )}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default ShowRoom;
