import { RoomOpenTime, RoomSetting } from '@prisma/client';

export type IRoomSettingCoreField = Omit<
  RoomSetting,
  'updated_at' | 'created_at' | 'id'
>;
export type IRoomOpenTimeCoreField = Omit<
  RoomOpenTime,
  'updated_at' | 'created_at' | 'id'
>;
