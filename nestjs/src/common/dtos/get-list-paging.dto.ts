import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsJSON, IsOptional, IsString } from 'class-validator';
import { IFilter, IOrder, OrderList } from 'src/common/types';

export class ListPagingSortingFilteringDto {
  @IsInt()
  @Transform((params) => {
    return parseInt(params.value);
  })
  page: number;

  @IsInt()
  @Transform((params) => {
    return parseInt(params.value);
  })
  per_page: number;

  @IsIn(OrderList)
  order: IOrder;

  @IsString()
  order_by: string;

  @IsOptional()
  @IsJSON()
  @Transform((params) => {
    return JSON.parse(params.value);
  })
  filter: IFilter;
}
