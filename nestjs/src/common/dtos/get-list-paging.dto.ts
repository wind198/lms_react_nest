import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsJSON, IsObject, IsOptional, IsString } from 'class-validator';
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
  @IsObject()
  @Transform((params) => {
    return params.value;
  })
  filter: IFilter;
}
