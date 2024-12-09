import { ICourse } from "@/lib/types/entities/course.entity";
import { IHasDescriptiveFields, IHasId, ITimeStamp } from "../common.type";
import { faker } from "@faker-js/faker";

export type IMajorCoreField = {} & IHasDescriptiveFields & {
    courses_count?: number;
    courses?: ICourse[];
  };

export type IMajor = IMajorCoreField & IHasId & ITimeStamp;

export const makeRandomMajor = (): IMajorCoreField => ({
  title: faker.word.words({ count: { max: 8, min: 3 } }),
  description: faker.word.words({ count: { max: 40, min: 10 } }),
});
