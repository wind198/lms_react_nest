import { Controller, Get, Query } from '@nestjs/common';
import { ClassSessionsService } from './class-sessions.service';
import { GetSessionScheduleProposal } from '@resources/class-sessions/dto/get-session-schedule-proposal.dto';

@Controller('class-sessions')
export class ClassSessionsController {
  constructor(private readonly classSessionsService: ClassSessionsService) {}

  @Get('schedule-sessions')
  getSessions(@Query() qr: GetSessionScheduleProposal) {
    const { allowedWeekdays, class: classId, count, end, start } = qr;
    
  }
}
