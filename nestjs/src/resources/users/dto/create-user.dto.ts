import { EDUCATION_BACKGROUND, GENDER } from '@prisma/client';
import { IUserCoreField } from '../entities/user.entity';
import {
  IsDate,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  MAX_ADDRESS_LEN,
  MAX_EMAIL_LEN,
  MAX_NAME_LENGTH,
  MAX_PHONE_LEN,
} from '@/common/constants/validation/index';

export class CreateUserDto
  implements
    Omit<
      IUserCoreField,
      'user_type' | 'generation_id' | 'is_active' | 'full_name' | 'password'
    >
{
  @IsEmail()
  @MaxLength(MAX_EMAIL_LEN)
  email: string;

  @IsString()
  @MaxLength(MAX_NAME_LENGTH / 2)
  first_name: string;

  @IsString()
  @MaxLength(MAX_NAME_LENGTH / 2)
  last_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_PHONE_LEN)
  phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_ADDRESS_LEN)
  address: string;

  @IsIn(Object.keys(EDUCATION_BACKGROUND))
  education_background: EDUCATION_BACKGROUND;

  @IsDate() dob: Date;
  @IsIn(Object.keys(GENDER))
  gender: GENDER;

  @IsOptional()
  @IsInt()
  generation_id: number;
}
