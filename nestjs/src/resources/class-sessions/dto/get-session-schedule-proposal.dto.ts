import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';

export class GetSessionScheduleProposal {
  @IsDateString()
  start: string; // time domain lower limit to allocate class session

  @IsDateString()
  end: string; // time domain upper limit to allocate class session

  @IsNumber()
  @Min(1)
  count: number;

  @IsPositive()
  @IsInt()
  @IsNumber()
  duration: number; // class session duration in minutes

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  allowedWeekdays: number[];

  @IsNumber()
  class: string;
}
