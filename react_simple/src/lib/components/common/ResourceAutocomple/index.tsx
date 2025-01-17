import useGetList from "@/lib/hooks/useGetList";
import { IHasId, IHasResource, IStringOrNumber } from "@/lib/types/common.type";
import { AutoComplete, AutoCompleteProps, Input } from "antd";
import { debounce } from "lodash-es";
import { ForwardedRef, forwardRef, useMemo, useState } from "react";
type IProps<T> = Omit<AutoCompleteProps, "options"> &
  IHasResource & { representation: keyof T };

function ResourceAutocomplete<T extends IHasId>(
  props: IProps<T>,
  ref: ForwardedRef<any>
) {
  const {
    representation,
    resource,
    resourcePlural = resource + "s",
    onChange,
    value: $value,
    ...o
  } = props;

  const [search, setSearch] = useState("");

  const { data } = useGetList<T>({
    page: 1,
    per_page: 100,
    filter: { q: search },
    resource: resource,
    resourcePlural: resourcePlural,
  });

  const valueLabel = useMemo(() => {
    if (!$value || !data?.data?.length) {
      return "";
    }
    return data?.data.find(({ id }) => id === $value)?.[representation] ?? "";
  }, [$value, data?.data, representation]);

  const options = useMemo(() => {
    return (
      data?.data?.map((i) => {
        const label = i[representation] as string;

        return {
          label,
          value: label,
          key: i.id,
        };
      }) ?? []
    );
  }, [data?.data, representation]);

  const onSearch = debounce((v: string) => setSearch(v), 500);

  return (
    <AutoComplete
      value={valueLabel}
      onSearch={onSearch}
      options={options}
      ref={ref}
      onChange={(_, option) => {
        if (onChange) {
          // @ts-expect-error
          onChange(option.key, option);
        }
      }}
      {...o}
    >
      <Input placeholder="Type to search"></Input>
    </AutoComplete>
  );
}

export default forwardRef(ResourceAutocomplete) as <T>(
  props: IProps<T> & { ref?: React.ForwardedRef<any> }
) => ReturnType<typeof ResourceAutocomplete>;
