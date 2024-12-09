import { IOrder } from "@/lib/types/common.type";
import {
  DEFAULT_ORDER,
  DEFAULT_ORDER_BY,
  DEFAULT_PAGE,
  DEFAULT_PER_PAGE,
} from "@/lib/utils/constants";
import {
  isNullOrUndefined,
  parseQueryStringToSearchParamObject,
} from "@/lib/utils/helpers";
import { cloneDeep, isEmpty, set, unset } from "lodash-es";
import { stringify } from "qs";
import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";

export default function useDataPaginationLogic() {
  const { pathname, hash, search } = useLocation();

  const navigate = useNavigate();

  const searchParams = useMemo(
    () => parseQueryStringToSearchParamObject(search),
    [search]
  );

  const filter = useMemo(
    () => searchParams.filter ?? {},
    [searchParams.filter]
  );
  const page = useMemo(
    () => searchParams.page ?? DEFAULT_PAGE,
    [searchParams.page]
  );
  const perPage = useMemo(
    () => searchParams.per_page ?? DEFAULT_PER_PAGE,
    [searchParams.per_page]
  );
  const order = useMemo(
    () => searchParams.order ?? DEFAULT_ORDER,
    [searchParams.order]
  );
  const orderBy = useMemo(
    () => searchParams.order_by ?? DEFAULT_ORDER_BY,
    [searchParams.order_by]
  );

  const handleChangeFilter = useCallback(
    (filterKey: string, value: any) => {
      const newSearchParams = cloneDeep(searchParams);
      const newFilter = cloneDeep(filter);
      const paths = filterKey.split(".");
      if (!paths.length) {
        return;
      }
      if (isNullOrUndefined(value)) {
        unset(newFilter, paths);
      } else {
        set(newFilter, paths, value);
      }

      for (const k in newFilter) {
        const element = newFilter[k];
        if (typeof element === "object" && isEmpty(element)) {
          delete newFilter[k];
        }
      }

      newSearchParams.filter = newFilter;
      navigate({
        hash,
        pathname,
        search: encodeURI(stringify(newSearchParams)),
      });
    },
    [filter, hash, navigate, pathname, searchParams]
  );

  const handleChangeSort = useCallback(
    (f: string | undefined, o: IOrder | undefined) => {
      const newSearchParams = cloneDeep(searchParams);
      if (!f && !o) {
        delete newSearchParams.order_by;
        delete newSearchParams.order;
      } else {
        const currentOrder = newSearchParams["order"] ?? DEFAULT_ORDER;
        const currentOrderBy = newSearchParams["order_by"] ?? DEFAULT_ORDER_BY;
        if (f === currentOrderBy && o === currentOrder) {
          return;
        }
        if (f === DEFAULT_ORDER_BY) {
          delete newSearchParams.order_by;
        } else {
          newSearchParams.order_by = f;
        }
        if (o === DEFAULT_ORDER) {
          delete newSearchParams.order;
        } else {
          newSearchParams.order = o;
        }
      }
      navigate({
        hash,
        pathname,
        search: encodeURI(stringify(newSearchParams)),
      });
    },
    [hash, navigate, pathname, searchParams]
  );

  const handleChangePagination = useCallback(
    (page: number, perPage: number) => {
      const newSearchParams = cloneDeep(searchParams);
      const currentPage = newSearchParams["page"] ?? DEFAULT_PAGE;
      const currentPerPage = newSearchParams["per_page"] ?? DEFAULT_PER_PAGE;
      if (currentPage === page && currentPerPage === perPage) {
        return;
      }
      if (perPage === DEFAULT_PER_PAGE) {
        delete newSearchParams.per_page;
      } else {
        newSearchParams.per_page = perPage;
      }
      if (page === DEFAULT_PAGE) {
        delete newSearchParams.page;
      } else {
        newSearchParams.page = page;
      }
      navigate({
        hash,
        pathname,
        search: encodeURI(stringify(newSearchParams)),
      });
    },
    [hash, navigate, pathname, searchParams]
  );

  return {
    handleChangePagination,
    handleChangeSort,
    page,
    perPage,
    order,
    orderBy,
    filter,
    handleChangeFilter,
  };
}
