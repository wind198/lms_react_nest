export const OrderList = ['asc', 'desc'];

export type IOrder = (typeof OrderList)[number];

export type IFilter = Record<string, any>;

export type IHasId = { id: number };

export type IHasTimestamp = {
  created_at: string;
  updated_at: string;
};

export const AccessRightList = ['list', 'create', 'update', 'delete'] as const;
export type IAccessRight = (typeof AccessRightList)[number];
