import { faker } from "@faker-js/faker";
import { IHasDescriptiveFields, IHasId, ITimeStamp } from "../common.type";
import { range } from "lodash-es";
import { IRoomOpenTime } from "@/lib/types/entities/room-open-time.entity";

export type IRoomSettingCoreField = {} & IHasDescriptiveFields & {
    dates_off: string[];
    dates_off_once: string[];
    room_open_times: IRoomOpenTime[];
    capacity: number;
  };

export type IRoomSetting = IRoomSettingCoreField & IHasId & ITimeStamp;

export const makeRandomRoomSetting = () => {
  return {
    title: faker.word.words({ count: { max: 8, min: 3 } }),
    description: faker.word.words({ count: { max: 40, min: 10 } }),
    capacity: faker.number.int({ min: 20, max: 80 }),
    dates_off: range(faker.number.int({ min: 3, max: 12 })).map((_) =>
      faker.number.int({ min: 1, max: 365 })
    ),
  };
};
