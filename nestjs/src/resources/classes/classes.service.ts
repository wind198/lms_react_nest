import { PrismaService } from '@/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { AllocateClassSessionDto } from '@resources/classes/dto/allocate-class-session.dto';
import { IClassCoreField } from '@resources/classes/entities/class.entity';
import { range, sample } from 'lodash';

@Injectable()
export class ClassesService {
  classModel: Prisma.ClassDelegate<DefaultArgs>;
  constructor(private prisma: PrismaService) {
    this.classModel = prisma.client.class;
  }

  async mockClass(count: number) {
    const courses = await this.prisma.client.course.findMany({
      select: { id: true },
    });
    if (!courses.length) return;
    const courseIds = courses.map((i) => i.id);

    const data = await Promise.all(
      range(count).map(async (_) => {
        return {
          title: faker.word.words({ count: { max: 8, min: 3 } }),
          description: faker.word.words({ count: { max: 40, min: 10 } }),
          code: faker.word.sample({ length: { max: 10, min: 4 } }),
          course_id: sample(courseIds),
        } as IClassCoreField;
      }),
    );
    return this.classModel.createMany({ data });
  }

  async tryAllocateSessionForClass(payload: AllocateClassSessionDto) {
    const { count, end, room_ids, start } = payload;
    const matchRooms = this.prisma.client.room.findMany({
      where: {
        id: { in: room_ids },
      },
      include: {
        room_setting: {
          include: { room_open_times: true },
        },
      },
    });
  }


}
