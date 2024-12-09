import FillSpace from "@/lib/components/common/FillSpace";
import FilterToolbar from "@/lib/components/common/FillSpace/FilterToolbar";
import TableActionBar from "@/lib/components/common/TableActionBar/index";
import useDataPaginationLogic from "@/lib/hooks/useDataPaginationLogic";
import useFormatDateTime from "@/lib/hooks/useFormatDateTime";
import useGetList from "@/lib/hooks/useGetList";
import { IHasResource, IStringOrNumber } from "@/lib/types/common.type";
import { IUser } from "@/lib/types/entities/user.entity";
import {
  onClickToTargetInnerLink,
  reverseAntdSortOrder,
  reverseOrder,
} from "@/lib/utils/helpers";
import { CheckOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Flex,
  Table,
  TablePaginationConfig,
  Tag,
} from "antd";
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from "antd/es/table/interface";
import dayjs from "dayjs";
import { startCase } from "lodash-es";
import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router";
type IProps = IHasResource;

const renderCellTitle = (field: string) => {
  return startCase(field);
};

export default function ListUsers({
  resource,
  resourcePlural = resource + "s",
}: IProps) {
  const {
    page,
    perPage,
    order,
    orderBy,
    handleChangePagination,
    handleChangeSort,
    filter,
  } = useDataPaginationLogic();

  const { data, isLoading, isError } = useGetList<IUser>({
    resource,
    page: page,
    per_page: perPage,
    order: order,
    order_by: orderBy,
    filter,
  });

  const { formatDateCommon } = useFormatDateTime();

  const renderCellValue = useCallback(
    (field: string, value: any) => {
      switch (field) {
        case "created_at":
        case "dob":
          return formatDateCommon(value);
        case "email":
          return <a href={`mailto:${value}`}>{value}</a>;

        case "is_active": {
          if (value) {
            return <CheckOutlined />;
          }
          return null;
        }
        case "gender":
          return startCase(value.toLowerCase());
        case "phone":
          return <a href={`tel:${value}`}>{value}</a>;
        case "education_background": {
          switch (value) {
            case "PHD":
              return value;
            default:
              return startCase(value.toLowerCase());
          }
        }
        default:
          return value;
      }
    },
    [formatDateCommon]
  );

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
          const { pageSize, current } = pagination;
          if (!current || !pageSize) {
            return;
          }
          handleChangePagination(current, pageSize);
          return;
        }
        case "sort": {
          const { field, order } = sorter as SorterResult<any>;
          if (!field || !order) {
            handleChangeSort(undefined, undefined);
            return;
          }
          // if (field === "age") {
          //   field = "dob";
          //   order = reverseAntdSortOrder(order);
          // }
          handleChangeSort(field as any, order === "ascend" ? "asc" : "desc");
          return;
        }
        case "filter":
          break;

        default:
          break;
      }
    },
    [handleChangePagination, handleChangeSort]
  );

  const navigate = useNavigate();

  const onRowClick = useCallback(
    (i: IUser) => {
      navigate(`/human-management/${resourcePlural}/` + i.id, {
        state: {
          recordData: i,
        },
      });
    },
    [navigate, resourcePlural]
  );

  const [selectedRows, setSelectedRows] = useState<IStringOrNumber[]>([]);

  return (
    <Flex vertical gap={8}>
      <Flex justify="space-between" align="center" gap={8}>
        {!isLoading && !isError && (
          <Tag style={{ minWidth: 60, minHeight: 22 }}>
            {data?.params?.total !== undefined && (
              <>Total: {data?.params?.total}</>
            )}
          </Tag>
        )}
        <FillSpace />
        <FilterToolbar
          filters={[
            {
              key: "created_at.gte",
              label: "Created after",
              render(currentVal, onChange) {
                return (
                  <DatePicker
                    placeholder="Created after"
                    value={currentVal ? dayjs(currentVal) : undefined}
                    onChange={(v) => {
                      onChange(
                        "created_at.gte",
                        v ? dayjs(v).toISOString() : v
                      );
                    }}
                  />
                );
              },
            },
            {
              key: "created_at.lte",
              label: "Created before",
              render(currentVal, onChange) {
                return (
                  <DatePicker
                    placeholder="Created before"
                    value={currentVal ? dayjs(currentVal) : undefined}
                    onChange={(v) => {
                      onChange(
                        "created_at.gte",
                        v ? dayjs(v).toISOString() : v
                      );
                    }}
                  />
                );
              },
            },
          ]}
        ></FilterToolbar>
        <Button
          shape="circle"
          type="primary"
          onClick={(e) => onClickToTargetInnerLink(e.target as HTMLElement)}
        >
          <Link to={`/human-management/${resourcePlural}/create`}>
            <PlusOutlined />
          </Link>
        </Button>
      </Flex>
      <TableActionBar
        selectKeys={selectedRows}
        {...{ resource, resourcePlural }}
      />
      <Table<IUser>
        rowSelection={{
          selectedRowKeys: selectedRows,
          onChange: (selectedRowKeys) => {
            setSelectedRows(selectedRowKeys as any);
          },
        }}
        rowKey={"id"}
        dataSource={data?.data}
        loading={isLoading}
        onChange={onChange}
        pagination={{
          total: data?.params?.total,
          pageSize: perPage,
          current: page,
        }}
        onRow={(record) => ({
          onClick: () => onRowClick(record), // Bind the click event
        })}
      >
        {[
          "full_name",
          "email",
          "gender",
          "dob",
          "education_background",
          "created_at",
        ].map((field) => {
          return (
            <Table.Column
              sorter
              title={renderCellTitle(field)}
              dataIndex={field}
              key={field}
              render={(value: any, record: IUser) => {
                return renderCellValue(field, value);
              }}
            />
          );
        })}
      </Table>
    </Flex>
  );
}
