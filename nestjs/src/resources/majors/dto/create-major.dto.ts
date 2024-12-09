import {
  MAX_DESCRIPTION_LEN,
  MAX_TITLE_LEN,
} from '@/common/constants/validation/index';
import { IMajorCoreField } from '@resources/majors/entities/major.entity';
import { IsString, MaxLength } from 'class-validator';

export class CreateMajorDto implements IMajorCoreField {
  @IsString()
  @MaxLength(MAX_TITLE_LEN)
  title: string;

  @IsString()
  @MaxLength(MAX_DESCRIPTION_LEN)
  description: string;
}
