import { MAX_ADDRESS_LEN } from '@/common/constants/validation/index';
import { DescriptionFielsDto } from '@dtos/description-fields.dto';
import { IRoomCoreField } from '@resources/rooms/entities/room.entity';
import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateRoomDto
  extends DescriptionFielsDto
  implements IRoomCoreField
{
  @IsInt()
  room_setting_id: number;

  @IsString()
  @MaxLength(MAX_ADDRESS_LEN)
  address: string;
}
