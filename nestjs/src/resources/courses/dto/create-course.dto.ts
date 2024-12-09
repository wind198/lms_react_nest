import {
  MAX_DESCRIPTION_LEN,
  MAX_TITLE_LEN,
} from '@/common/constants/validation/index';
import { ICourseCoreField } from '@resources/courses/entities/course.entity';
import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateCourseDto implements ICourseCoreField {
  @IsString()
  @MaxLength(MAX_TITLE_LEN)
  title: string;

  @IsString()
  @MaxLength(MAX_DESCRIPTION_LEN)
  description: string;

  @IsInt()
  major_id: number;
}
