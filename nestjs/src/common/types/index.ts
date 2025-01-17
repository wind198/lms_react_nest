import { ListPagingSortingFilteringDto } from '@dtos/get-list-paging.dto';
import { ManyIdsDto } from '@dtos/many-ids.dto';

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

export type IActivable = { is_active: boolean };

export type IHasCreateRoute = {
  create: (body: any, ...params: any[]) => void;
};
export type IHasRepresentationRoute = {
  getRepresentaion: (id: number, ...params: any[]) => void;
};
export type IHasGetRoute<THasGetMany = false> = (THasGetMany extends true
  ? {
      getMany: (qr: ManyIdsDto, ...params: any[]) => void;
    }
  : unknown) & {
  getListPaging: (qr: ListPagingSortingFilteringDto, ...params: any[]) => void;
  getOne: (id: number, ...params: any[]) => void;
};
export type IHasUpdateRoute<THasUpdateMany = false> =
  (THasUpdateMany extends true
    ? {
        updateMany: (qr: ManyIdsDto, body: any, ...params: any[]) => void;
      }
    : unknown) & {
    updateOne: (id: number, body: any, ...params: any[]) => void;
  };
export type IHasDeleteRoute<THasDeleteMany = false> =
  (THasDeleteMany extends true
    ? {
        removeMany: (qr: ManyIdsDto, ...params: any[]) => void;
      }
    : unknown) & {
    removeOne: (id: number, ...params: any[]) => void;
  };
