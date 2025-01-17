import { IClass, IClassCoreField } from "@/lib/types/entities/class.entity";
import { IHasDescriptiveFields, IHasId, ITimeStamp } from "../common.type";
import { IRoom } from "@/lib/types/entities/room.entity";

export type IClassSessionCoreField = {} & IHasDescriptiveFields & {
    class_id: string;
    class?: IClass;
    start_time: string;
    end_time: string;
    room_id: string;
    room?: IRoom;
  };

export type IClassSession = IClassSessionCoreField & IHasId & ITimeStamp;
