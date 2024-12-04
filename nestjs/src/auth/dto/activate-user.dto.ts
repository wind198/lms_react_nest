import { IsStrongPassword } from 'class-validator';

export class ActivateUserDto {
  @IsStrongPassword()
  password: string;
}
