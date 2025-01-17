import { ICourse } from "@/lib/types/entities/course.entity";
import { IHasDescriptiveFields, IHasId, ITimeStamp } from "../common.type";
import { IClassSession } from "@/lib/types/entities/class-session.entity";
import { faker } from "@faker-js/faker";

export type IClassCoreField = {} & IHasDescriptiveFields & {
    course_id: number;
    course?: ICourse;
    sessions?: IClassSession[];
  };

export type IClass = IClassCoreField & IHasId & ITimeStamp;

export const makeRandomClass = (
  courseId?: number
): Partial<IClassCoreField> => ({
  ...(courseId && {
    course_id: courseId,
  }),
  title: faker.word.words({ count: { max: 8, min: 3 } }),
  description: faker.word.words({ count: { max: 40, min: 10 } }),
});
