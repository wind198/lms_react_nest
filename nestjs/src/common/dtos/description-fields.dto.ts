import {
  MAX_DESCRIPTION_LEN,
  MAX_TITLE_LEN,
} from '@/common/constants/validation/index';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class DescriptionFieldsDto {
  @IsString()
  @MaxLength(MAX_TITLE_LEN)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_DESCRIPTION_LEN)
  description: string;
}
