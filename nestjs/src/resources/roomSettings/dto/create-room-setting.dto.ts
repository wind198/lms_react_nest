import { DescriptionFieldsDto } from '@dtos/description-fields.dto';
import {
  IRoomOpenTimeCoreField,
  IRoomSettingCoreField,
} from '@resources/roomSettings/entities/room-setting.entity';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateRoomSettingDto
  extends DescriptionFieldsDto
  implements IRoomSettingCoreField
{
  @IsOptional()
  @IsString({ each: true })
  dates_off: string[];

  @IsOptional()
  @IsString({ each: true })
  dates_off_once: string[];

  @IsInt()
  @Min(1)
  capacity: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => RoomOpenTime)
  openTimes: RoomOpenTime[];
}

class RoomOpenTime implements Omit<IRoomOpenTimeCoreField, 'room_setting_id'> {
  @ArrayMinSize(1)
  @IsInt({ each: true })
  week_days: number[];

  @Min(0)
  @IsInt()
  start_time: number;

  @Min(0)
  @IsInt()
  end_time: number;
}
