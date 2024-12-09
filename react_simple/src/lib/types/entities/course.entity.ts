import { IMajor } from "@/lib/types/entities/major.entity";
import { IHasDescriptiveFields, IHasId, ITimeStamp } from "../common.type";
import { faker } from "@faker-js/faker";

export type ICourseCoreField = {} & IHasDescriptiveFields & {
    courses_count?: number;
    major?: IMajor;
    major_id: string;
  };

export type ICourse = ICourseCoreField & IHasId & ITimeStamp;
export const makeRandomCourse = () => {
  return {
    title: faker.word.words({ count: { max: 8, min: 3 } }),
    description: faker.word.words({ count: { max: 40, min: 10 } }),
  } as ICourseCoreField;
};
