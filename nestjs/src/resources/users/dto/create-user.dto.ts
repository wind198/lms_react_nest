import { EDUCATION_BACKGROUND, GENDER } from '@prisma/client';
import { IUserCoreField } from '../entities/user.entity';
import {
  IsDate,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateUserDto
  implements Omit<IUserCoreField, 'user_type' | 'generation_id'>
{
  @IsEmail()
  email: string;

  @IsString()
  first_name: string;

  @IsEmail()
  last_name: string;

  @IsOptional()
  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  @IsString()
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
