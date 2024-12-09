import FillSpace from "@/lib/components/common/FillSpace/index";
import NotFound from "@/lib/components/common/NotFoundErr/index";
import RecordDetailLoading from "@/lib/components/common/RecordDetailLoading/index";
import UnknownErr from "@/lib/components/common/UnknownErr/index";
import useGetOne from "@/lib/hooks/useGetOne";
import { IHasResource } from "@/lib/types/common.type";
import { IUser } from "@/lib/types/entities/user.entity";
import { onClickToTargetInnerLink } from "@/lib/utils/helpers";
import { EditOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Descriptions, Flex, Tag } from "antd";
import dayjs from "dayjs";
import { FC } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useParams } from "react-router";

const ShowUser: FC<IHasResource> = ({
  resource,
  resourcePlural = resource + "s",
}) => {
  const { id } = useParams();

  const { state } = useLocation();

  const {
    data: user,
    isNotFoundErr,
    isError,
    isLoading,
  } = useGetOne<IUser>({
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
  if (!user) {
    return null;
  }
  return (
    <div className="show-user">
      <Flex style={{ marginBottom: 8 }}>
        <FillSpace />
        <Button
          type="primary"
          icon={<EditOutlined />}
          role="navigation"
          onClick={() => {
            navigate(
              {
                pathname: `/human-management/${resourcePlural}/${id}/edit`,
              },
              {
                state: {
                  recordData: user,
                },
              }
            );
          }}
        >
          Edit
        </Button>
      </Flex>
      <Descriptions bordered size="small" column={1}>
        <Descriptions.Item label="Full Name">
          {user.full_name}
        </Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="User Type">
          <Tag color={user.user_type === "ADMIN" ? "red" : "green"}>
            {user.user_type}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Phone">
          {user.phone || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Address">
          {user.address || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Education Background">
          <Tag color="blue">{user.education_background}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Date of Birth">
          {dayjs(user.dob).toDate().toLocaleDateString()}
        </Descriptions.Item>
        <Descriptions.Item label="Gender">
          <Tag
            color={
              user.gender === "MALE"
                ? "blue"
                : user.gender === "FEMALE"
                ? "pink"
                : "gray"
            }
          >
            {user.gender}
          </Tag>
        </Descriptions.Item>
        {user.user_type === "STUDENT" && (
          <Descriptions.Item label="Generation">
            {user.generation?.title || "None"}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Status">
          <Badge
            status={user.is_active ? "success" : "default"}
            text={user.is_active ? "Active" : "Inactive"}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {new Date(user.created_at).toLocaleString()}
        </Descriptions.Item>
        {/* <Descriptions.Item label="Updated At">
        {new Date(user.updated_at).toLocaleString()}
      </Descriptions.Item> */}
      </Descriptions>
    </div>
  );
};

export default ShowUser;
