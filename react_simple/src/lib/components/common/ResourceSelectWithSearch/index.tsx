import useGetList from "@/lib/hooks/useGetList";
import { IHasId, IHasResource, IStringOrNumber } from "@/lib/types/common.type";
import { SearchOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  AutoCompleteProps,
  Input,
  Select,
  SelectProps,
} from "antd";
import { debounce } from "lodash-es";
import { ForwardedRef, forwardRef, useMemo, useState } from "react";
type IProps<T> = Omit<SelectProps, "options"> &
  IHasResource & { representation: keyof T };

function ResourceSelectWithSearch<T extends IHasId>(
  props: IProps<T>,
  ref: ForwardedRef<any>
) {
  const { representation, resource, resourcePlural = resource + "s" } = props;

  const [search, setSearch] = useState("");

  const { data } = useGetList<T>({
    page: 1,
    per_page: 100,
    filter: { q: search },
    resource: resource,
    resourcePlural: resourcePlural,
  });

  const options = useMemo(() => {
    return data?.data?.map((i) => {
      return {
        value: i.id,
        label: i[representation] as string,
      };
    });
  }, [data?.data, representation]);

  const onSearch = debounce((v: string) => setSearch(v), 500);

  return (
    <Select
      prefix={<SearchOutlined />}
      showSearch
      onSearch={onSearch}
      options={options}
      ref={ref}
      {...props}
    ></Select>
  );
}

export default forwardRef(ResourceSelectWithSearch) as <T>(
  props: IProps<T> & { ref?: React.ForwardedRef<any> }
) => ReturnType<typeof ResourceSelectWithSearch>;
