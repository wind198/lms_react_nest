export const OrderList = ['asc', 'desc'];

export type IOrder = (typeof OrderList)[number];

export type IFilter = Record<string, any>;
