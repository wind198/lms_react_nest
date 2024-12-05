import useDataPaginationLogic from "@/lib/hooks/useDataPaginationLogic";
import useGetList from "@/lib/hooks/useGetList";
import { IUser } from "@/lib/types/entities/user.entity";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Flex,
  Table,
  TableColumnsType,
  TablePaginationConfig,
  Tag,
} from "antd";
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from "antd/es/table/interface";
import dayjs from "dayjs";
import { useCallback } from "react";

export default function ListStudents() {
  const {
    page,
    perPage,
    order,
    orderBy,
    handleChangePagination,
    handleChangeOrder,
    handleChangeSort,
  } = useDataPaginationLogic();

  const { data, isLoading } = useGetList<IUser>({
    resource: "student",
    page: page,
    per_page: perPage,
    order: order,
    order_by: orderBy,
  });

  const onChange = useCallback(
    (
      pagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<any> | SorterResult<any>[],
      extra: TableCurrentDataSource<any>
    ) => {
      const { action } = extra;
      switch (action) {
        case "paginate": {
          const { pageSize } = pagination;

          break;
        }
        case "sort": {
          const { field, order } = sorter as SorterResult<any>;
          handleChangeSort(
            field as any,
            !order ? undefined : order === "ascend" ? "asc" : "desc"
          );
          break;
        }
        case "filter":
          break;

        default:
          break;
      }
    },
    []
  );

  return (
    <Flex vertical gap={8}>
      <Flex justify="space-between" align="center">
        <Tag style={{ minWidth: 60, minHeight: 22 }}>
          {data?.params?.total !== undefined && (
            <>Total: {data?.params?.total}</>
          )}
        </Tag>
        <Button type="primary" icon={<PlusOutlined />}>
          Add
        </Button>
      </Flex>
      <Table<IUser>
        dataSource={data?.data}
        loading={isLoading}
        onChange={onChange}
      >
        <Table.Column
          title="Full name"
          dataIndex="full_name"
          key="full_name"
          render={(_, record: IUser) =>
            `${record.first_name} ${record.last_name}`
          }
          sorter
        ></Table.Column>
        <Table.Column
          title="Email"
          dataIndex="email"
          key="email"
          render={(value: string) => {
            return <a href={`mailto:${value}`}>{value}</a>;
          }}
          sorter
        ></Table.Column>
        <Table.Column
          title="Education"
          dataIndex="education_background"
          key="education_background"
          sorter
        ></Table.Column>
        <Table.Column
          title="Age"
          dataIndex="age"
          key="age"
          render={(_, record: IUser) => {
            return dayjs().diff(record.dob, "year");
          }}
          sorter
        ></Table.Column>
      </Table>
    </Flex>
  );
}
