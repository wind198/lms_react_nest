import { Prisma } from '.prisma/client/index';
import { handleFilter } from '@/common/helpers/index';
import { PrismaService } from '@/prisma/prisma.service';
import { Resource } from '@decorators/is_resource.decorator';
import { ThrowNotFoundOrReturn } from '@decorators/throw-not-found-or-return.decorator';
import { ManyIdsDto } from '@dtos/many-ids.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateRoomDto } from '@resources/rooms/dto/create-room.dto';
import { UpdateRoomDto } from '@resources/rooms/dto/update-room.dto';
import { RoomsService } from '@resources/rooms/rooms.service';
import { omit } from 'lodash';
import { ListPagingSortingFilteringDto } from 'src/common/dtos/get-list-paging.dto';

const RESOURCE = 'room';

@Controller('rooms')
@Resource(RESOURCE)
export class RoomsController {
  constructor(
    private prisma: PrismaService,
    private readonly roomsService: RoomsService,
  ) {}

  @Post()
  async create(@Body() createRoomDto: CreateRoomDto) {
    const { room_setting_id } = createRoomDto;

    if (
      !(await this.roomsService.roomModel.findUnique({
        where: { id: room_setting_id },
      }))
    ) {
      throw new NotFoundException(
        `Room setting with id ${room_setting_id} not found`,
      );
    }
    return await this.roomsService.roomModel.create({
      data: createRoomDto,
    });
  }

  @Get()
  async getListPaging(@Query() qr: ListPagingSortingFilteringDto) {
    const { filter, order, order_by, page, per_page } = qr;

    // Validate page and per_page
    const pageNumber = page > 0 ? page : 1;
    const pageSize = per_page > 0 ? per_page : 10;
    const offset = (pageNumber - 1) * pageSize;
    const where: Prisma.RoomWhereInput = {};

    handleFilter(where, filter, {
      dateFields: ['created_at'],
      searchFields: ['title'],
    });

    // Fetch data using the service
    const [data, total] = await Promise.all([
      this.roomsService.roomModel.findMany({
        skip: offset,
        take: pageSize,
        where,
        orderBy: { [order_by as any]: order },
      }),
      this.roomsService.roomModel.count({
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
    return this.roomsService.roomModel.findMany({
      where: { id: { in: qr.ids } },
    });
  }

  @ThrowNotFoundOrReturn(RESOURCE)
  @Get(':id/representation')
  async findOneRepresentation(@Param('id', ParseIntPipe) id: number) {
    const match = await this.roomsService.roomModel.findUnique({
      where: { id },
    });
    return match?.title;
  }

  @ThrowNotFoundOrReturn(RESOURCE)
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.roomModel.findUnique({
      where: { id },
      select: {
        room_setting: {
          include: {
            room_optime_times: true,
          },
        },
      },
    });
  }

  @Patch('update-many')
  async updateMany(
    @Query() qr: ManyIdsDto,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    const { room_setting_id } = updateRoomDto;
    if (
      room_setting_id &&
      !(await this.roomsService.roomModel.findUnique({
        where: { id: room_setting_id },
      }))
    ) {
      throw new NotFoundException(
        `Room setting with id ${room_setting_id} not found`,
      );
    }

    return this.roomsService.roomModel.updateMany({
      where: { id: { in: qr.ids } },
      data: updateRoomDto,
    });
  }

  @ThrowNotFoundOrReturn(RESOURCE)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    const { room_setting_id } = updateRoomDto;
    if (
      room_setting_id &&
      !(await this.roomsService.roomModel.findUnique({
        where: { id: room_setting_id },
      }))
    ) {
      throw new NotFoundException(
        `Room setting with id ${room_setting_id} not found`,
      );
    }
    return this.roomsService.roomModel.update({
      where: { id },
      data: updateRoomDto,
    });
  }

  @Delete('delete-many')
  async removeMany(@Query() qr: ManyIdsDto) {
    // const matches = await this.roomsService.roomModel.findMany({
    //   where: { id: { in: qr.ids } },
    //   include: {
    //     courses: {
    //       select: {
    //         id: true,
    //       },
    //     },
    //   },
    // });

    // if (matches.some((i) => i.courses.length > 0)) {
    //   throw new ConflictException('Cannot delete room with related courses.');
    // }
    return this.roomsService.roomModel.deleteMany({
      where: { id: { in: qr.ids } },
    });
  }

  @ThrowNotFoundOrReturn(RESOURCE)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    // const match = await this.roomsService.roomModel.findUnique({
    //   where: { id },
    //   include: {
    //     courses: {
    //       select: {
    //         id: true,
    //       },
    //     },
    //   },
    // });

    // if (!match) {
    //   return null;
    // }
    // if (match.courses.length) {
    //   return new ConflictException(`Cannot remove room with related courses`);
    // }

    return this.roomsService.roomModel.delete({
      where: { id },
    });
  }
}
