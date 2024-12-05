import { IOrder } from "@/lib/types/common.type";
import {
  DEFAULT_ORDER,
  DEFAULT_ORDER_BY,
  DEFAULT_PAGE,
  DEFAULT_PER_PAGE,
} from "@/lib/utils/constants";
import { parseQueryStringToSearchParamObject } from "@/lib/utils/helpers";
import { cloneDeep } from "lodash-es";
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

  const handleChangeSort = useCallback(
    (f: string | undefined, v: IOrder | undefined) => {
      const newSearchParams = cloneDeep(searchParams);
      if (!f && !v) {
        delete newSearchParams.order_by;
        delete newSearchParams.order;
      } else {
        const currentOrder = newSearchParams["order"] ?? DEFAULT_ORDER;
        const currentOrderBy = newSearchParams["order_by"] ?? DEFAULT_ORDER_BY;
        if (f === currentOrderBy && v === currentOrder) {
          return;
        }
        if (f === DEFAULT_ORDER_BY) {
          delete newSearchParams.order_by;
        } else {
          newSearchParams.order_by = f;
        }
        if (v === DEFAULT_ORDER) {
          delete newSearchParams.order;
        } else {
          newSearchParams.order = v;
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
      const currentPage = searchParams["page"] ?? DEFAULT_PAGE;
      const currentPerPage = searchParams["per_page"] ?? DEFAULT_PER_PAGE;
      if (currentPage === page && currentPerPage === perPage) {
        return;
      }
      if (currentPerPage === DEFAULT_PER_PAGE) {
        delete searchParams.per_page;
      } else {
        searchParams.per_page = perPage;
      }
      if (currentPage === DEFAULT_PAGE) {
        delete searchParams.page;
      } else {
        searchParams.page = page;
      }
      navigate({ hash, pathname, search: encodeURI(stringify(searchParams)) });
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
  };
}
