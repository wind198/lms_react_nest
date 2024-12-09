import {
  MAX_DESCRIPTION_LEN,
  MAX_TITLE_LEN,
} from '@/common/constants/validation/index';
import { IsString, MaxLength } from 'class-validator';

export class DescriptionFielsDto {
  @IsString()
  @MaxLength(MAX_TITLE_LEN)
  title: string;

  @IsString()
  @MaxLength(MAX_DESCRIPTION_LEN)
  description: string;
}
