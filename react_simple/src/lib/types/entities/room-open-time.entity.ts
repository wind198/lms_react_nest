import { IHasId, ITimeStamp } from "../common.type";

export type IRoomOpenTimeCoreField = {
  week_days: number[];
  start_time: number;
  end_time: number;
};

export type IRoomOpenTime = IRoomOpenTimeCoreField & IHasId & ITimeStamp;
