import { IGeneration } from "@/lib/types/entities/generation.entity";
import { IActivable, IHasId, ITimeStamp } from "../common.type";
import { sample, startCase, upperFirst } from "lodash-es";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

export const UserTypeList = ["STUDENT", "TEACHER", "ADMIN"] as const;
export type IUserType = (typeof UserTypeList)[number];
export const GenderList = ["MALE", "FEMALE", "OTHERS"] as const;
export type IGender = (typeof GenderList)[number];
export const EducationBackgroundList = [
  "OTHERS",
  "HIGH_SCHOOL",
  "UNIVERSITY_STUDENT",
  "GRADUATED",
  "MASTER",
  "PHD",
] as const;
export type IEducationBackground = (typeof EducationBackgroundList)[number];

export const renderGender = (v: IGender) => upperFirst(v.toLowerCase());
export const renderEducationBg = (v: IEducationBackground) => {
  if (v === "PHD") {
    return v;
  }
  return startCase(v.toLowerCase());
};

export const makeRandomUser = (user_type?: IUserType) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });

  return {
    email,
    first_name: firstName,
    last_name: lastName,
    education_background: sample(EducationBackgroundList),
    address: faker.location.streetAddress(),
    phone: faker.phone.number(),
    gender: sample(GenderList),
    dob: dayjs(faker.date.birthdate()) as any,
    ...(user_type && { user_type }),
  } satisfies Partial<IUserCoreField>;
};

export type IUserCoreField = {
  first_name: string;
  last_name: string;
  full_name: string;
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

export type IUser = IUserCoreField & IHasId & ITimeStamp & IActivable;
