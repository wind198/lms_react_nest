import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClassSessionsService } from './class-sessions.service';
import { GetSessionScheduleProposal } from '@resources/class-sessions/dto/get-session-schedule-proposal.dto';
import { IHasCreateRoute, IHasDeleteRoute } from '@/common/types/index';
import { ManyIdsDto } from '@dtos/many-ids.dto';
import { ThrowNotFoundOrReturn } from '@decorators/throw-not-found-or-return.decorator';
import { UpdateClassSessionDto } from '@resources/class-sessions/dto/update-class-session.dto';
import { CreateClassSessionDto } from '@resources/class-sessions/dto/create-class-session.dto';

const Resource = 'class-session';
@Controller('class-sessions')
export class ClassSessionsController
  implements IHasCreateRoute, IHasDeleteRoute<true>
{
  constructor(private readonly classSessionsService: ClassSessionsService) {}
  @Post() create(body: CreateClassSessionDto) {
    return this.classSessionsService.classSessionModel.create({ data: body });
  }

  @Get('schedule-sessions')
  scheduleSessions(@Query() qr: GetSessionScheduleProposal) {
    return this.classSessionsService.scheduleSessions(qr);
  }

  @Delete('delete-many')
  async removeMany(@Query() qr: ManyIdsDto) {
    return this.classSessionsService.classSessionModel.deleteMany({
      where: { id: { in: qr.ids } },
    });
  }

  @ThrowNotFoundOrReturn(Resource)
  @Delete(':id')
  async removeOne(@Param('id', ParseIntPipe) id: number) {
    return await this.classSessionsService.classSessionModel.delete({
      where: { id },
    });
  }

  @Patch('update-many')
  updateMany(@Query() qr: ManyIdsDto, @Body() dto: UpdateClassSessionDto) {
    return this.classSessionsService.classSessionModel.updateMany({
      where: { id: { in: qr.ids } },
      data: dto,
    });
  }

  @ThrowNotFoundOrReturn(Resource)
  @Patch(':id')
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClassSessionDto,
  ) {
    return this.classSessionsService.classSessionModel.update({
      where: { id },
      data: dto,
    });
  }
}
