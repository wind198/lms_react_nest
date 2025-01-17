import { PrismaService } from '@/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma, Room, RoomOpenTime, RoomSetting } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { ClassSessionsService } from '@resources/class-sessions/class-sessions.service';
import { TimeWindow } from '@resources/rooms/time-window';
import { range, sumBy, uniq } from 'lodash';
import moment, { Moment } from 'moment';

@Injectable()
export class RoomsService {
  roomModel: Prisma.RoomDelegate<DefaultArgs>;
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => ClassSessionsService))
    private classSessionsService: ClassSessionsService,
  ) {
    this.roomModel = prisma.client.room;
  }

  async mockRoom(count: number) {
    const data = (await Promise.all(
      range(count).map(async () => {
        return {
          title: faker.word.words({ count: { max: 8, min: 3 } }),
          description: faker.word.words({ count: { max: 40, min: 10 } }),
          address: faker.location.streetAddress(),
        };
      }),
    )) as any;
    return this.roomModel.createMany({ data });
  }

  async getRoomAvailableTimeWindows(
    room: Room & {
      room_setting: RoomSetting & { room_open_times: RoomOpenTime[] };
    },
    periodStart: string,
    periodEnd: string,
  ) {
    const { room_setting } = room;
    if (!room_setting) {
      throw new BadRequestException(`Room has not been configured`);
    }
    const { dates_off, dates_off_once, room_open_times } = room_setting;
    const startMoment = moment(periodStart).startOf('day');
    const endMoment = moment(periodEnd).endOf('day');

    const periodDurationInMinutes = endMoment.diff(startMoment, 'minute');

    if (endMoment.isSameOrBefore(startMoment)) {
      throw new InternalServerErrorException(
        `Invalid period for getting occupiedHours, periodStart is ${startMoment.toISOString()} and periodEnd is ${endMoment.toISOString()}`,
      );
    }
    const availableTimeWindows = [] as TimeWindow[];

    const occupiedTimeWindows = [] as TimeWindow[];
    const accountedDateOff = [] as Moment[];

    // start map room_open_times to TimeWindows
    const acceptableWeekdays = uniq(
      room_open_times.map((i) => i.week_days).flat(),
    );

    for (const targetWeekday of acceptableWeekdays) {
      let minuteCount = 0;
      while (minuteCount <= periodDurationInMinutes) {
        const weekday = startMoment
          .clone()
          .add(minuteCount, 'minute')
          .get('weekday');
        if (weekday !== targetWeekday) {
          minuteCount += 24 * 60;
          continue;
        } else {
          room_open_times.forEach(({ week_days, start_time, end_time }) => {
            if ((week_days as number[]).includes(weekday)) {
              const timeWindow = new TimeWindow(
                minuteCount + start_time,
                minuteCount + end_time,
              );
              availableTimeWindows.push(timeWindow);
            }
          });
          minuteCount += 7 * 24 * 60;
        }
      }
    }
    for (const d of dates_off as string[]) {
      const [month, date] = d.split('-').map((i) => parseInt(i));
      const startYear = startMoment.get('year');
      const endYear = endMoment.get('year');
      for (let i = startYear; i <= endYear; i++) {
        const current = moment({ month: month, date: date, year: i }).startOf(
          'day',
        );
        if (current.isBetween(startMoment, endMoment)) {
          accountedDateOff.push(current);
          const windowStart = current.diff(startMoment, 'minute');
          const windowEnd = windowStart + 24 * 60;
          occupiedTimeWindows.push(new TimeWindow(windowStart, windowEnd));
        }
      }
    }
    for (const d of dates_off_once as string[]) {
      const current = moment(d);

      if (
        !accountedDateOff.find((i) => i.isSame(current)) &&
        current.isBetween(startMoment, endMoment)
      ) {
        const windowStart = current.diff(startMoment, 'minute');
        const windowEnd = windowStart + 24 * 60;
        occupiedTimeWindows.push(new TimeWindow(windowStart, windowEnd));
      }
    }

    const matchClassSessions =
      await this.classSessionsService.classSessionModel.findMany({
        where: {
          start_time: { gte: startMoment.toDate() },
          end_time: { lte: startMoment.toDate() },
        },
      });

    for (const session of matchClassSessions) {
      occupiedTimeWindows.push(
        new TimeWindow(
          moment(session.start_time).diff(startMoment, 'minute'),
          moment(session.end_time).diff(startMoment, 'minute'),
        ),
      );
    }

    const trueAvailableWindows = TimeWindow.subtract2TimeWindowList(
      availableTimeWindows,
      occupiedTimeWindows,
    );

    return {
      availableWindows: trueAvailableWindows,
      availableMinutes: sumBy(trueAvailableWindows.map((i) => i.end - i.start)),
    };
  }

  findAvailableTimeWindowForRoom(
    roomAvailableWindows: TimeWindow[],
    timeWindowEndLimit: number,
    classSessionDuration: number, // in minutes
  ) {
    let allocatedWindow;
    for (const tw of roomAvailableWindows) {
      if (tw.duration > classSessionDuration) {
        allocatedWindow = new TimeWindow(
          tw.start,
          tw.start + classSessionDuration,
        );
        break;
      }
    }

    return allocatedWindow;
  }

  formatTimeWindowList(occupiedData: TimeWindow[]) {
    return TimeWindow.mergeMultipleTimeWindow(...occupiedData);
  }

  // subtract 2 time window list, asuming each list contain non overlapping ascending time windows
}
