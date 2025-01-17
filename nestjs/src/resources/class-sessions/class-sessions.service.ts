import { PrismaService } from '@/prisma/prisma.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ClassSession, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { GetSessionScheduleProposal } from '@resources/class-sessions/dto/get-session-schedule-proposal.dto';
import { RoomsService } from '@resources/rooms/rooms.service';
import { TimeWindow } from '@resources/rooms/time-window';
import { cloneDeep, first, range } from 'lodash';
import moment, { Moment } from 'moment';

@Injectable()
export class ClassSessionsService {
  classSessionModel: Prisma.ClassSessionDelegate<DefaultArgs>;
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => RoomsService))
    private roomsService: RoomsService,
  ) {
    this.classSessionModel = prisma.client.classSession;
  }

  async scheduleSessions(payload: GetSessionScheduleProposal) {
    const {
      allowedWeekdays,
      class: classId,
      count,
      end,
      start,
      duration,
    } = payload;

    const allRooms = await this.roomsService.roomModel.findMany({
      include: { room_setting: { include: { room_open_times: true } } },
    });
    const $allRoomsWithAvailableWindows = await Promise.all(
      allRooms.map(async (i) => ({
        ...i,
        ...(await this.roomsService.getRoomAvailableTimeWindows(i, start, end)),
      })),
    );

    const allRoomsWithAvailableWindows = cloneDeep(
      $allRoomsWithAvailableWindows,
    );

    const roomCount = allRooms.length;

    const periodToSearchInMinutes = moment(end).diff(start, 'minute');

    const allocatedSession = [] as TimeWindow[];

    for (const _ of range(count)) {
      allRoomsWithAvailableWindows.sort(
        (a, b) => b.availableMinutes - a.availableMinutes,
      );
      let roomIndex = 0;
      let allocatedTimeWindowForThisSession: TimeWindow;
      while (!allocatedTimeWindowForThisSession && roomIndex < roomCount) {
        const currentRoom = allRoomsWithAvailableWindows[roomIndex];
        allocatedTimeWindowForThisSession =
          await this.roomsService.findAvailableTimeWindowForRoom(
            currentRoom.availableWindows,
            periodToSearchInMinutes,
            duration,
          );

        roomIndex++;
      }
      if (!allocatedTimeWindowForThisSession) {
        // Cannot find available time window across all rooms
        break;
      } else {
        allocatedSession.push(allocatedTimeWindowForThisSession);
        allRoomsWithAvailableWindows.forEach((i) => {
          i.availableWindows = TimeWindow.subtract2TimeWindowList(
            i.availableWindows,
            [allocatedTimeWindowForThisSession],
          );
          i.availableMinutes -= allocatedTimeWindowForThisSession.duration;
        });
      }
    }

    return {
      status: allocatedSession.length < count ? 'partial-complete' : 'complete',
      message:
        allocatedSession.length < count
          ? `Can't allocate time for all sessions, either add more rooms or reduce number of sessions`
          : undefined,
      sessions: allocatedSession,
      roomAvailableWindows: $allRoomsWithAvailableWindows,
    };
  }

  getClassSessionTimeWindowWithRespectToTimestamp(
    referenceTimestamp: moment.MomentInput,
    classSession: ClassSession,
  ) {
    const { start_time, end_time } = classSession;
    const duration = moment(end_time).diff(start_time, 'minute');
    const timeWindowStart = moment(start_time).diff(
      referenceTimestamp,
      'minute',
    );

    return {
      start: timeWindowStart,
      end: timeWindowStart + duration,
    } as TimeWindow;
  }
}
