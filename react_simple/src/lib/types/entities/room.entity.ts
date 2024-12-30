import { faker } from "@faker-js/faker";
import { IHasDescriptiveFields, IHasId, ITimeStamp } from "../common.type";
import { IRoomSetting } from "@/lib/types/entities/room-setting.entity";

export type IRoomCoreField = {} & IHasDescriptiveFields & {
    address: string;
    room_setting: IRoomSetting;
  };

export type IRoom = IRoomCoreField & IHasId & ITimeStamp;

export const makeRandomRoom = () => {
  return {
    title: faker.word.words({ count: { max: 8, min: 3 } }),
    description: faker.word.words({ count: { max: 40, min: 10 } }),
    address: faker.location.streetAddress(),
  };
};
