import { PrismaService } from '@/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { ICourseCoreField } from '@resources/courses/entities/course.entity';
import { range } from 'lodash';

@Injectable()
export class CoursesService {
  courseModel: Prisma.CourseDelegate<DefaultArgs>;
  constructor(private prisma: PrismaService) {
    this.courseModel = prisma.client.course;
  }

  async mockCourse(count: number, major_id: number) {
    const data = await Promise.all(
      range(count).map(async (_) => {
        return {
          title: faker.word.words({ count: { max: 8, min: 3 } }),
          description: faker.word.words({ count: { max: 40, min: 10 } }),
          major_id,
        } as ICourseCoreField;
      }),
    );
    return this.courseModel.createMany({ data });
  }
}
