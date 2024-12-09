import { DescriptionFielsDto } from '@dtos/description-fields.dto';
import {
  IRoomOpenTimeCoreField,
  IRoomSettingCoreField,
} from '@resources/roomSettings/entities/room-setting.entity';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateRoomSettingDto
  extends DescriptionFielsDto
  implements IRoomSettingCoreField
{
  @IsInt({ each: true })
  dates_off: number[];

  @IsInt()
  @Min(1)
  capacity: number;

  @IsArray()
  @MinLength(1)
  @ValidateNested()
  @Type(() => RoomOpenTime)
  openTimes: RoomOpenTime[];
}

class RoomOpenTime implements Omit<IRoomOpenTimeCoreField, 'room_setting_id'> {
  @MinLength(1)
  @IsInt({ each: true })
  week_days: number[];

  @IsDateString()
  @Transform((p) => {
    return new Date(p.value);
  })
  start_time: Date;

  @IsDateString()
  @Transform((p) => {
    return new Date(p.value);
  })
  end_time: Date;
}
