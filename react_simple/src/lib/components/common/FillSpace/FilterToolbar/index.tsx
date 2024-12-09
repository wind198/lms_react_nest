import useDataPaginationLogic from "@/lib/hooks/useDataPaginationLogic";
import { isNullOrUndefined } from "@/lib/utils/helpers";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Input,
  Space,
  Pop,
  Popover,
  Checkbox,
  Badge,
} from "antd";
import { debounce, get, isEmpty } from "lodash-es";
import { Fragment, ReactNode, useCallback, useMemo, useState } from "react";

type IProps = {
  filters: {
    key: string;
    label: string;
    alwaysOn?: boolean;
    render: (
      currentVal: any,
      onChange: (key: string, v: any) => void
    ) => ReactNode;
  }[];
};
export default function FilterToolbar(props: IProps) {
  const { filters } = props;

  const { handleChangeFilter, filter } = useDataPaginationLogic();

  const [filterVisibility, setFilterVisible] = useState(() => {
    return Object.fromEntries(
      filters
        .map(({ key, alwaysOn }) => {
          const isFiltered = !isNullOrUndefined(get(filter, key.split(".")));

          return alwaysOn ? undefined : [key, isFiltered ?? !!alwaysOn];
        })
        .filter(Boolean) as any
    );
  });

  const toggleFilter = useCallback((key: string, v: boolean) => {
    setFilterVisible((p) => ({ ...p, [key]: v }));
  }, []);

  const onChangeFilter = (k: string, v: any) => {
    handleChangeFilter(k, v);
  };

  const onChangeFilterDebounced = debounce(onChangeFilter, 500);

  const menuContent = useMemo(() => {
    return (
      <Space direction="vertical" size={"middle"}>
        {Object.entries(filterVisibility).map(([key, isVisible]) => {
          const match = filters.find((i) => i.key === key);
          if (!match) return null;
          return (
            <Checkbox
              key={key}
              onChange={(v) => toggleFilter(key, v.target.checked)}
              checked={isVisible}
            >
              {match.label}
            </Checkbox>
          );
        })}
      </Space>
    );
  }, [filterVisibility, filters, toggleFilter]);

  const shouldShowFilterMenu = useMemo(
    () => filters.filter((i) => !i.alwaysOn).length,
    [filters]
  );

  const couterFilter = useMemo(() => {
    const handleObject = (obj: object) => {
      let counter = 0;
      for (const k in obj) {
        const v = obj[k];
        if (!isNullOrUndefined(v) && v !== "") {
          if (typeof v !== "object") {
            counter++;
          } else {
            if (!isEmpty(v)) {
              counter += handleObject(v);
            }
          }
        }
      }

      return counter;
    };
    return handleObject(filter);
  }, [filter]);

  return (
    <Space size={"small"}>
      {filters.map(({ key, render }) => {
        const paths = key.split(".");
        const isVisible = filterVisibility[key];
        if (!isVisible) return null;

        return (
          <Fragment key={key}>
            {render(get(filter, paths), onChangeFilter)}
          </Fragment>
        );
      })}
      <Input
        prefix={<SearchOutlined />}
        defaultValue={filter["q"]}
        onChange={(e) => {
          onChangeFilterDebounced("q", e.target.value);
        }}
      />
      {shouldShowFilterMenu && (
        <Popover content={menuContent} title="Filters">
          <Badge color="blue" count={couterFilter}>
            <Button shape="circle" icon={<FilterOutlined />}></Button>
          </Badge>
        </Popover>
      )}
    </Space>
  );
}
