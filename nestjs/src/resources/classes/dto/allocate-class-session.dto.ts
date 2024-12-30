import { IsDateString, IsInt } from 'class-validator';

export class AllocateClassSessionDto {
  @IsDateString()
  start: string;

  @IsDateString()
  end: string;

  @IsDateString()
  count: string;

  @IsInt()
  room_ids: number[];
}
