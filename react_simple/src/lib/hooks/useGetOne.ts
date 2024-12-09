import useApiHttpClient from "@/lib/hooks/useHttpClient";
import { IHasResource, IStringOrNumber } from "@/lib/types/common.type";
import { getOneUrl } from "@/lib/utils/helpers";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useMemo } from "react";

type IOptions = IHasResource & {
  id: IStringOrNumber | undefined;
  placeholderData?: any;
};

export default function useGetOne<T>(options: IOptions) {
  const { id, resource, resourcePlural = resource + "s" } = options;

  const { $get } = useApiHttpClient();

  const getOne = async () => {
    if (!id) {
      throw new Error(`Invalid id: ${id}`);
    }
    const { data } = await $get(getOneUrl(resourcePlural, id));
    return data;
  };

  const res = useQuery<T, AxiosError, T>({
    queryKey: [resourcePlural, "getOne", { id }],
    queryFn: getOne,
    placeholderData: options.placeholderData,
  });

  const isNotFoundErr = useMemo(() => {
    return res.error && res.error.status === 404;
  }, [res.error]);
  return { ...res, isNotFoundErr };
}
