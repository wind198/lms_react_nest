import { IGeneration } from "@/lib/types/entities/generation.entity";
import { IEducationBackground, IGender } from "../../utils/constants";
import { IHasId, ITimeStamp } from "../common.type";

export const UserTypeList = ["STUDENT", "TEACHER", "ADMIN"] as const;
export type IUserType = (typeof UserTypeList)[number];

export type IUserCoreField = {
  first_name: string;
  last_name: string;
  email: string;
  user_type: IUserType;
  phone?: string | null; // Nullable string
  address?: string | null; // Nullable string
  education_background: IEducationBackground;
  gender: IGender;
  dob?: string | null; // Nullable date
  generation_id?: number;
  generation?: IGeneration;
};

export type IUser = IUserCoreField & IHasId & ITimeStamp;
