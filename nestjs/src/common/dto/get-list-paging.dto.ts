import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { IFilter, IOrder, OrderList } from 'src/common/types';

export class ListPagingSortingFilteringDto {
  @IsInt()
  page: number;

  @IsInt()
  per_page: number;

  @IsIn(OrderList)
  order: IOrder;

  @IsString()
  order_by: string;

  @IsOptional()
  filter: IFilter;
}
