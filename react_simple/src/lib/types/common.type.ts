export const OrderList = ["asc", "desc"] as const;
export type IOrder = (typeof OrderList)[number];
export type IPaginatedData<T> = {
  data: T[];
  params: {
    from: number;
    to: number;
    total: number;
  };
};
export type IHasSize = { size: "small" | "medium" | "large" };

export type IFilter<T> = {
  filterKey: string;
  defaultValue?: T;
  alwaysOn?: boolean;
  label?: string;
  isVisible?: boolean;
};

export type IQueryListParams = {
  page: number;
  per_page: number;
  order: IOrder;
  order_by: string;
  filter: string;
};

export type IHasId = { id: number };
export type ITimeStamp = { created_at: number; updated_at: number };

export type IHasDescriptiveFields = {
  title: string;
  description?: string;
};

export type IMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export type IStringOrNumber = string | number;

export type IHasRepresentation = {
  representation: string;
};

export type IHasResource = {
  resource: string;
  resourcePlural?: string;
};

export type IActivable = {
  is_active: boolean;
};
export type ISearchParamObj = Record<string, any>;

export type IMultiple = {multiple?: boolean}