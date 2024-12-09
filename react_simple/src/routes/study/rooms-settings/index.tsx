import FillSpace from "@/lib/components/common/FillSpace";
import FilterToolbar from "@/lib/components/common/FillSpace/FilterToolbar";
import TableActionBar from "@/lib/components/common/TableActionBar/index";
import LongTextWithElipsis from "@/lib/components/LongTextWithElipsis/index";
import useDataPaginationLogic from "@/lib/hooks/useDataPaginationLogic";
import useFormatDateTime from "@/lib/hooks/useFormatDateTime";
import useGetList from "@/lib/hooks/useGetList";
import { IHasResource, IStringOrNumber } from "@/lib/types/common.type";
import { IRoomSetting } from "@/lib/types/entities/room-setting.entity";
import { onClickToTargetInnerLink } from "@/lib/utils/helpers";
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

const renderCellTitle = (field: string) => {
  return startCase(field);
};

const resource = "room-setting";
const resourcePlural = "room-settings";

export default function ListRoomSettings() {
  const {
    page,
    perPage,
    order,
    orderBy,
    handleChangePagination,
    handleChangeSort,
    filter,
  } = useDataPaginationLogic();

  const { data, isLoading, isError } = useGetList<IRoomSetting>({
    resource: "room-setting",
    page: page,
    per_page: perPage,
    order: order,
    order_by: orderBy,
    filter,
  });

  const { formatDateCommon } = useFormatDateTime();

  const renderCellValue = useCallback(
    (field: string, value: any, record: IRoomSetting) => {
      switch (field) {
        case "created_at":
          return formatDateCommon(value);
        case "description": {
          const title = `${field} of ${record.title}`;

          return <LongTextWithElipsis title={title} text={value} />;
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
          handleChangeSort(field as any, order === "ascend" ? "asc" : "desc");
          return;
        }
        default:
          break;
      }
    },
    [handleChangePagination, handleChangeSort]
  );

  const navigate = useNavigate();

  const onRowClick = useCallback(
    (i: IRoomSetting) => {
      navigate(`/study/${resourcePlural}/` + i.id, {
        state: {
          recordData: i,
        },
      });
    },
    [navigate]
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
          <Link to={`/study/${resourcePlural}/create`}>
            <PlusOutlined />
          </Link>
        </Button>
      </Flex>
      <TableActionBar
        selectKeys={selectedRows}
        {...{ resource, resourcePlural }}
      />
      <Table<IRoomSetting>
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
        {(["title", "description", "capacity"] as (keyof IRoomSetting)[]).map(
          (field) => {
            return (
              <Table.Column
                sorter
                title={renderCellTitle(field as string)}
                dataIndex={field}
                key={field}
                render={(value: any, record: IRoomSetting) => {
                  return renderCellValue(field, value, record);
                }}
              />
            );
          }
        )}
      </Table>
    </Flex>
  );
}
