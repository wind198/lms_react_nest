import { PrismaService } from '@/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { Prisma, Room, RoomOpenTime, RoomSetting } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { range, uniq } from 'lodash';
import moment, { Moment } from 'moment';

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

  async getAvailableTime(
    room: Room & {
      room_setting: RoomSetting & { room_open_times: RoomOpenTime[] };
    },
    start: string,
    end: string,
  ) {
    const { room_setting } = room;
    if (!room_setting) {
      return [];
    }
    const { dates_off, dates_off_once, room_open_times } = room_setting;

    let current = moment(start);
    while (true) {
      if (
        this.checkDateOverlap(current, dates_off.concat(dates_off_once)) ||
        this.checkWeekdayOverlap(
          current,
          uniq(room_open_times.map((i) => i.week_days).flat()),
        )
      ) {
        break;
      }
    }

    return [];
  }

  checkWeekdayOverlap(input: Moment, weekDays: number[]) {
    const weekDAy = input.get('weekday');
    if (weekDays.includes(weekDAy)) {
      return true;
    }
    return false;
  }

  checkDateOverlap(input: Moment, dates: string[]) {
    const shortFormat = input.format('MM-DD');
    const longFormat = input.format('YYYY-MM-DD');
    for (const i of dates) {
      if (i.match(/\w{2}-\w{2}/)) {
        if (shortFormat === i) {
          return true;
        }
      } else {
        if (longFormat === i) {
          return true;
        }
      }
    }
    return false;
  }
}
