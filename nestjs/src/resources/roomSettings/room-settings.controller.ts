import { Prisma } from '.prisma/client/index';
import { handleFilter } from '@/common/helpers/index';
import {
  IHasCreateRoute,
  IHasDeleteRoute,
  IHasGetRoute,
  IHasRepresentationRoute,
  IHasUpdateRoute,
} from '@/common/types/index';
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
  InternalServerErrorException,
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
export class RoomSettingsController
  implements
    IHasCreateRoute,
    IHasGetRoute<true>,
    IHasUpdateRoute<true>,
    IHasDeleteRoute<true>,
    IHasRepresentationRoute
{
  constructor(
    private prisma: PrismaService,
    private readonly roomSettingsService: RoomSettingsService,
  ) {}

  @Post()
  async create(@Body() createRoomSettingDto: CreateRoomSettingDto) {
    const { openTimes, ...o } = createRoomSettingDto;

    return await this.roomSettingsService.roomSettingModel.create({
      data: {
        capacity: o.capacity,
        description: o.description,
        title: o.title,
        dates_off: o.dates_off,
        room_open_times: {
          createMany: { data: openTimes },
        },
      },
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
        include: {
          room_open_times: true,
        },
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

  @Get('get-many')
  getMany(@Query() qr: ManyIdsDto) {
    return this.roomSettingsService.roomSettingModel.findMany({
      where: { id: { in: qr.ids } },
      include: { room_open_times: true },
    });
  }

  @ThrowNotFoundOrReturn(RESOURCE)
  @Get(':id/representation')
  async getRepresentaion(@Param('id', ParseIntPipe) id: number) {
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
      include: { room_open_times: true },
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
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomSettingDto: UpdateRoomSettingDto,
  ) {
    return this.roomSettingsService.roomSettingModel.update({
      where: { id },
      data: updateRoomSettingDto,
      include: { room_open_times: true },
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
    try {
      await this.prisma.client.$transaction(async (transaction) => {
        // Delete RoomOpenTimes explicitly if needed (not required with cascading in the schema)
        await transaction.roomOpenTime.deleteMany({
          where: { room_setting_id: { in: qr.ids } },
        });

        // Delete the RoomSetting
        await transaction.roomSetting.deleteMany({
          where: { id: { in: qr.ids } },
        });
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @ThrowNotFoundOrReturn(RESOURCE)
  @Delete(':id')
  async removeOne(@Param('id', ParseIntPipe) id: number) {
    const roomSetting =
      await this.roomSettingsService.roomSettingModel.findUnique({
        where: { id },
        include: {
          rooms: {
            select: {
              id: true,
            },
          },
        },
      });

    if (!roomSetting) {
      return null;
    }

    if (roomSetting.rooms.length) {
      throw new ConflictException(
        'Cannot delete room setting with related room.',
      );
    }
    try {
      await this.prisma.client.$transaction(async (transaction) => {
        // Delete RoomOpenTimes explicitly if needed (not required with cascading in the schema)
        await transaction.roomOpenTime.deleteMany({
          where: { room_setting_id: id },
        });

        // Delete the RoomSetting
        await transaction.roomSetting.delete({
          where: { id: id },
        });
        return roomSetting;
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
