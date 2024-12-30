import {
  MAX_DESCRIPTION_LEN,
  MAX_TITLE_LEN,
} from '@/common/constants/validation/index';
import { IClassCoreField } from '@resources/classes/entities/class.entity';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateClassDto implements IClassCoreField {
  @IsOptional()
  @IsString()
  code: string;

  @IsInt()
  course_id: number;

  @IsString()
  @MaxLength(MAX_TITLE_LEN)
  title: string;

  @IsString()
  @MaxLength(MAX_DESCRIPTION_LEN)
  description: string;
}
