import FillSpace from "@/lib/components/common/FillSpace/index";
import NotFound from "@/lib/components/common/NotFoundErr/index";
import RecordDetailLoading from "@/lib/components/common/RecordDetailLoading/index";
import UnknownErr from "@/lib/components/common/UnknownErr/index";
import useGetOne from "@/lib/hooks/useGetOne";
import { IRoom } from "@/lib/types/entities/room.entity";
import { EditOutlined } from "@ant-design/icons";
import { Button, Descriptions, Flex } from "antd";
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
        <Descriptions.Item label="Address">
          {room.address}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default ShowRoom;
