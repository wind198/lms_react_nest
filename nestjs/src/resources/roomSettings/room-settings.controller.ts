import { Prisma } from '.prisma/client/index';
import { handleFilter } from '@/common/helpers/index';
import { PrismaService } from '@/prisma/prisma.service';
import { Resource } from '@decorators/is_resource.decorator';
import { ThrowNotFoundOrReturn } from '@decorators/throw-not-found-or-return.decorator';
import { ManyIdsDto } from '@dtos/many-ids.dto';
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateRoomSettingDto } from '@resources/roomSettings/dto/create-room-setting.dto';
import { UpdateRoomSettingDto } from '@resources/roomSettings/dto/update-room-setting.dto';
import { RoomSettingsService } from '@resources/roomSettings/room-settings.service';
import { ListPagingSortingFilteringDto } from 'src/common/dtos/get-list-paging.dto';

const RESOURCE = 'room-setting';

@Controller('room-settings')
@Resource(RESOURCE)
export class RoomSettingsController {
  constructor(
    private prisma: PrismaService,
    private readonly roomSettingsService: RoomSettingsService,
  ) {}

  @Post()
  async create(@Body() createRoomSettingDto: CreateRoomSettingDto) {
    return await this.roomSettingsService.roomSettingModel.create({
      data: createRoomSettingDto,
    });
  }

  @Get()
  async getListPaging(@Query() qr: ListPagingSortingFilteringDto) {
    const { filter, order, order_by, page, per_page } = qr;

    // Validate page and per_page
    const pageNumber = page > 0 ? page : 1;
    const pageSize = per_page > 0 ? per_page : 10;
    const offset = (pageNumber - 1) * pageSize;
    const where: Prisma.RoomSettingWhereInput = {};

    handleFilter(where, filter, {
      dateFields: ['created_at'],
      searchFields: ['title'],
    });

    // Fetch data using the service
    const [data, total] = await Promise.all([
      this.roomSettingsService.roomSettingModel.findMany({
        skip: offset,
        take: pageSize,
        where,
        orderBy: { [order_by as any]: order },
      }),
      this.roomSettingsService.roomSettingModel.count({
        where,
      }),
    ]);

    // Return paginated response
    return {
      data: data,
      params: {
        from: (pageNumber - 1) * pageSize,
        to: Math.max(pageNumber * pageSize, total),
        total,
      },
    };
  }

  @ThrowNotFoundOrReturn(RESOURCE)
  @Get('get-many')
  getMany(@Query() qr: ManyIdsDto) {
    return this.roomSettingsService.roomSettingModel.findMany({
      where: { id: { in: qr.ids } },
      include: { room_optime_times: true },
    });
  }

  @ThrowNotFoundOrReturn(RESOURCE)
  @Get(':id/representation')
  async findOneRepresentation(@Param('id', ParseIntPipe) id: number) {
    const match = await this.roomSettingsService.roomSettingModel.findUnique({
      where: { id },
    });
    return match?.title;
  }

  @ThrowNotFoundOrReturn(RESOURCE)
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomSettingsService.roomSettingModel.findUnique({
      where: { id },
      include: { room_optime_times: true },
    });
  }

  @Patch('update-many')
  updateMany(
    @Query() qr: ManyIdsDto,
    @Body() updateRoomSettingDto: UpdateRoomSettingDto,
  ) {
    return this.roomSettingsService.roomSettingModel.updateMany({
      where: { id: { in: qr.ids } },
      data: updateRoomSettingDto,
    });
  }

  @ThrowNotFoundOrReturn(RESOURCE)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomSettingDto: UpdateRoomSettingDto,
  ) {
    return this.roomSettingsService.roomSettingModel.update({
      where: { id },
      data: updateRoomSettingDto,
      include: { room_optime_times: true },
    });
  }

  @Delete('delete-many')
  async removeMany(@Query() qr: ManyIdsDto) {
    const matches = await this.roomSettingsService.roomSettingModel.findMany({
      where: { id: { in: qr.ids } },
      include: {
        rooms: {
          select: {
            id: true,
          },
        },
      },
    });

    if (matches.some((i) => i.rooms.length > 0)) {
      throw new ConflictException(
        'Cannot delete room setting with related room.',
      );
    }
    return this.roomSettingsService.roomSettingModel.deleteMany({
      where: { id: { in: qr.ids } },
    });
  }

  @ThrowNotFoundOrReturn(RESOURCE)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const match = await this.roomSettingsService.roomSettingModel.findUnique({
      where: { id },
      include: {
        rooms: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!match) {
      return null;
    }
    if (match.rooms.length) {
      throw new ConflictException(
        'Cannot delete room setting with related room.',
      );
    }

    return this.roomSettingsService.roomSettingModel.delete({
      where: { id },
    });
  }
}
