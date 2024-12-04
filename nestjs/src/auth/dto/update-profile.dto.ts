import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../resources/users/dto/create-user.dto';

export class UpdateProfileDto extends PickType(CreateUserDto, [
  'first_name',
  'last_name',
]) {}
