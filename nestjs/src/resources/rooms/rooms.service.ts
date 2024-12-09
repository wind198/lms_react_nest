import { PrismaService } from '@/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { range } from 'lodash';

@Injectable()
export class RoomsService {
  roomModel: Prisma.RoomDelegate<DefaultArgs>;
  constructor(private prisma: PrismaService) {
    this.roomModel = prisma.client.room;
  }

  async mockRoom(count: number) {
    const data = (await Promise.all(
      range(count).map(async (_) => {
        return {
          title: faker.word.words({ count: { max: 8, min: 3 } }),
          description: faker.word.words({ count: { max: 40, min: 10 } }),
          address: faker.location.streetAddress(),
        };
      }),
    )) as any;
    return this.roomModel.createMany({ data });
  }
}
