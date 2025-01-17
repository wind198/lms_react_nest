import FillSpace from "@/lib/components/common/FillSpace/index";
import NotFound from "@/lib/components/common/NotFoundErr/index";
import RecordDetailLoading from "@/lib/components/common/RecordDetailLoading/index";
import UnknownErr from "@/lib/components/common/UnknownErr/index";
import useGetOne from "@/lib/hooks/useGetOne";
import { Iclass } from "@/lib/types/entities/class.entity";
import { EditOutlined } from "@ant-design/icons";
import { Button, Descriptions, Flex } from "antd";
import { useLocation, useNavigate, useParams } from "react-router";

const resource = "class";
const resourcePlural = "classes";

const Showclass = () => {
  const { id } = useParams();

  const { state } = useLocation();

  const {
    data: class,
    isNotFoundErr,
    isError,
    isLoading,
  } = useGetOne<Iclass>({
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
  if (!class) {
    return null;
  }
  return (
    <div className="show-class">
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
                  recordData: class,
                },
              }
            );
          }}
        >
          Edit
        </Button>
      </Flex>
      <Descriptions bordered size="small" column={1}>
        <Descriptions.Item label="Title">{class.title}</Descriptions.Item>
        <Descriptions.Item label="Description">
          {class.description}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default Showclass;
