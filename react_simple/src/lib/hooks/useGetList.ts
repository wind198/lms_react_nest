import useApiHttpClient from "@/lib/hooks/useHttpClient";
import {
  IHasId,
  IHasResource,
  IPaginatedData,
  IQueryListParams,
} from "@/lib/types/common.type";
import {
  DEFAULT_ORDER,
  DEFAULT_ORDER_BY,
  DEFAULT_PAGE,
  DEFAULT_PER_PAGE,
} from "@lib/utils/constants";
import { apiPrefix } from "@lib/utils/helpers";
import {
  keepPreviousData,
  QueryFunctionContext,
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { isEmpty, set } from "lodash-es";
import { useMemo } from "react";

type IFilterInput = Record<string, any>;
type IFilterOutput = Record<string, any>;

type IUseGetListOptions = IHasResource &
  Partial<IQueryListParams> & {
    generateAugmentedFilter?: (
      ouput: IFilterOutput,
      filter: IFilterInput,
      defaultHandler: typeof defaultAugmentedFilterGenerator
    ) => IFilterOutput;
  };

const defaultAugmentedFilterGenerator = (
  output: IFilterOutput,
  filter: IFilterInput
) => {
  if (isEmpty(filter)) {
    return {};
  }

  for (const k in filter) {
    const element = filter[k];
    if (["created_at"].includes(k)) {
      const { gte, lte } = element;
      Object.entries({ gte, lte })
        .filter((x) => x[1])
        .forEach(([x, y]) => {
          if (x === "gte") {
            y = dayjs(y).startOf("day").toDate();
          } else {
            y = dayjs(y).endOf("day").toDate();
          }
          set(output, [k, x], y);
        });
    } else {
      set(output, [k], element);
    }
  }
};

export default function useGetList<T = IHasId>(options: IUseGetListOptions) {
  const {
    resource,
    filter = {},
    order,
    order_by,
    page,
    per_page,
    resourcePlural = resource + "s",
    generateAugmentedFilter = defaultAugmentedFilterGenerator,
  } = options;

  const filterStr = useMemo(() => JSON.stringify(filter), [filter]);

  const { $get } = useApiHttpClient();

  const fetchListPaging = async ({ queryKey }: QueryFunctionContext) => {
    const filterOutput: IFilterOutput = {};
    const { order, order_by, page, per_page, filterStr } = queryKey[1] as any;
    const filter = JSON.parse(filterStr);

    generateAugmentedFilter(
      filterOutput,
      filter,
      defaultAugmentedFilterGenerator
    );

    const { data } = await $get<IPaginatedData<T>>(resourcePlural, {
      params: {
        order: order ?? DEFAULT_ORDER,
        order_by: order_by ?? DEFAULT_ORDER_BY,
        page: page ?? DEFAULT_PAGE,
        per_page: per_page ?? DEFAULT_PER_PAGE,
        filter: filterOutput ?? {},
      },
    });

    return data;
  };

  const data = useQuery<IPaginatedData<T>, AxiosError, IPaginatedData<T>>({
    queryKey: [
      resourcePlural,
      {
        filterStr,
        order,
        order_by,
        page,
        per_page,
      },
    ],
    queryFn: fetchListPaging,
    placeholderData: keepPreviousData,
  });

  return { ...data };
}
