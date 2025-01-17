import { $Enums } from '@prisma/client';
import { IClassSessionCoreField } from '@resources/class-sessions/entity/class-session.entity';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, ValidateNested } from 'class-validator';

export class CreateClassSessionDto implements IClassSessionCoreField {
  @IsInt()
  class_id: number;

  @IsInt()
  room_id: number;

  @IsDateString()
  start_time: Date;

  @IsDateString()
  end_time: Date;
}

export class CreateManyClassSesionsDto {
  @ValidateNested({ each: true })
  @Type(() => CreateClassSessionDto)
  sessions: CreateClassSessionDto[];
}
