import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomSettingDto } from './create-room-setting.dto';

export class UpdateRoomSettingDto extends PartialType(CreateRoomSettingDto) {}
