import { Transform } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';

export class ManyIdsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform((p) => {
    const output = p.value.split(',').map((i) => parseInt(i));
    return output;
  })
  ids: number[];
}
