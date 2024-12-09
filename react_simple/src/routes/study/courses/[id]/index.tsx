import FillSpace from "@/lib/components/common/FillSpace/index";
import NotFound from "@/lib/components/common/NotFoundErr/index";
import RecordDetailLoading from "@/lib/components/common/RecordDetailLoading/index";
import UnknownErr from "@/lib/components/common/UnknownErr/index";
import useGetOne from "@/lib/hooks/useGetOne";
import { ICourse } from "@/lib/types/entities/course.entity";
import { EditOutlined } from "@ant-design/icons";
import { Button, Descriptions, Flex } from "antd";
import { useLocation, useNavigate, useParams } from "react-router";

const resource = "course";
const resourcePlural = "courses";

const ShowCourse = () => {
  const { id } = useParams();

  const { state } = useLocation();

  const {
    data: course,
    isNotFoundErr,
    isError,
    isLoading,
  } = useGetOne<ICourse>({
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
  if (!course) {
    return null;
  }
  return (
    <div className="show-course">
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
                  recordData: course,
                },
              }
            );
          }}
        >
          Edit
        </Button>
      </Flex>
      <Descriptions bordered size="small" column={1}>
        <Descriptions.Item label="Title">{course.title}</Descriptions.Item>
        <Descriptions.Item label="Description">
          {course.description}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default ShowCourse;
