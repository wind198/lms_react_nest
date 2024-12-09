import { IHasId, ITimeStamp } from "../common.type";

export type IRoomOpenTimeCoreField = {
  week_days: number[];
  start_time: string;
  end_time: string;
};

export type IRoomOpenTime = IRoomOpenTimeCoreField & IHasId & ITimeStamp;
