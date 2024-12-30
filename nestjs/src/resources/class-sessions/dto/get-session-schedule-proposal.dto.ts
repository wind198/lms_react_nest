import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class GetSessionScheduleProposal {
  @IsDateString()
  start: string;

  @IsDateString()
  end: string;

  @IsNumber()
  @Min(1)
  count: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  allowedWeekdays: number[];

  @IsNumber()
  class: string;
}
