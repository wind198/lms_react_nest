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
        label: i.id,
        value: i[representation] as string,
      };
    });
  }, [data?.data, representation]);

  const onSearch = debounce((v: string) => setSearch(v), 500);

  const [value, setValue] = useState<null | IStringOrNumber>(null);

  const displayValue = useMemo(
    () => options?.find((i) => i.value === value)?.label,
    [options, value]
  );

  return (
    <AutoComplete
      onSelect={(v) => {
        setValue(v);
      }}
      value={value}
      onSearch={onSearch}
      options={options}
      ref={ref}
       getInputElement={}
      
      {...props}
    >
      <Input placeholder="Type to search"></Input>
    </AutoComplete>
  );
}

// @ts-expect-error
export default forwardRef(ResourceAutocomplete) as <T>(
  props: IProps<T> & { ref?: React.ForwardedRef<any> }
) => ReturnType<typeof ResourceAutocomplete>;
