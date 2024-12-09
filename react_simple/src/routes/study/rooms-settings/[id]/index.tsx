import FillSpace from "@/lib/components/common/FillSpace/index";
import NotFound from "@/lib/components/common/NotFoundErr/index";
import RecordDetailLoading from "@/lib/components/common/RecordDetailLoading/index";
import UnknownErr from "@/lib/components/common/UnknownErr/index";
import useGetOne from "@/lib/hooks/useGetOne";
import { IRoomSetting } from "@/lib/types/entities/room-setting.entity";
import { EditOutlined } from "@ant-design/icons";
import { Button, Descriptions, Flex } from "antd";
import { useLocation, useNavigate, useParams } from "react-router";

const resource = "room-setting";
const resourcePlural = "room-settings";

const ShowRoomSetting = () => {
  const { id } = useParams();

  const { state } = useLocation();

  const {
    data: roomSetting,
    isNotFoundErr,
    isError,
    isLoading,
  } = useGetOne<IRoomSetting>({
    id: id,
    resource,
    resourcePlural,
    placeholderData: state?.recordData,
  });

  const navigate = useNavigate();

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
  if (!roomSetting) {
    return null;
  }
  return (
    <div className="show-room-setting">
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
                  recordData: roomSetting,
                },
              }
            );
          }}
        >
          Edit
        </Button>
      </Flex>
      <Descriptions bordered size="small" column={1}>
        <Descriptions.Item label="Title">{roomSetting.title}</Descriptions.Item>
        <Descriptions.Item label="Description">
          {roomSetting.description}
        </Descriptions.Item>
        <Descriptions.Item label="Address">
          {roomSetting.capacity}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default ShowRoomSetting;
