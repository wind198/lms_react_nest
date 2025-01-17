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
import { CreateMajorDto } from '@resources/majors/dto/create-major.dto';
import { UpdateMajorDto } from '@resources/majors/dto/update-major.dto';
import { MajorsService } from '@resources/majors/majors.service';
import { omit } from 'lodash';
import { ListPagingSortingFilteringDto } from 'src/common/dtos/get-list-paging.dto';

const RESOURCE = 'major';

@Controller('majors')
@Resource(RESOURCE)
export class MajorsController {
  constructor(
    private prisma: PrismaService,
    private readonly majorsService: MajorsService,
  ) {}

  @Post()
  async create(@Body() createMajorDto: CreateMajorDto) {
    return await this.majorsService.majorModel.create({
      data: createMajorDto,
    });
  }

  @Get()
  async getListPaging(@Query() qr: ListPagingSortingFilteringDto) {
    const { filter, order, order_by, page, per_page } = qr;

    // Validate page and per_page
    const pageNumber = page > 0 ? page : 1;
    const pageSize = per_page > 0 ? per_page : 10;
    const offset = (pageNumber - 1) * pageSize;
    const where: Prisma.MajorWhereInput = {};

    handleFilter(where, filter, {
      dateFields: ['created_at'],
      searchFields: ['title'],
    });

    // Fetch data using the service
    const [data, total] = await Promise.all([
      this.majorsService.majorModel.findMany({
        skip: offset,
        take: pageSize,
        where,
        orderBy: { [order_by as any]: order },
      }),
      this.majorsService.majorModel.count({
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
    return this.majorsService.majorModel.findMany({
      where: { id: { in: qr.ids } },
    });
  }

  @ThrowNotFoundOrReturn(RESOURCE)
  @Get(':id/representation')
  async getRepresentaion(@Param('id', ParseIntPipe) id: number) {
    const match = await this.majorsService.majorModel.findUnique({
      where: { id },
    });
    return match?.title;
  }

  @ThrowNotFoundOrReturn(RESOURCE)
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.majorsService.majorModel.findUnique({
      where: { id },
    });
  }

  @Patch('update-many')
  updateMany(@Query() qr: ManyIdsDto, @Body() updateMajorDto: UpdateMajorDto) {
    return this.majorsService.majorModel.updateMany({
      where: { id: { in: qr.ids } },
      data: updateMajorDto,
    });
  }

  @ThrowNotFoundOrReturn(RESOURCE)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMajorDto: UpdateMajorDto,
  ) {
    return this.majorsService.majorModel.update({
      where: { id },
      data: updateMajorDto,
    });
  }

  @Delete('delete-many')
  async removeMany(@Query() qr: ManyIdsDto) {
    const matches = await this.majorsService.majorModel.findMany({
      where: { id: { in: qr.ids } },
      include: {
        courses: {
          select: {
            id: true,
          },
        },
      },
    });

    if (matches.some((i) => i.courses.length > 0)) {
      throw new ConflictException('Cannot delete major with related courses.');
    }
    return this.majorsService.majorModel.deleteMany({
      where: { id: { in: qr.ids } },
    });
  }

  @ThrowNotFoundOrReturn(RESOURCE)
  @Delete(':id')
  async removeOne(@Param('id', ParseIntPipe) id: number) {
    const match = await this.majorsService.majorModel.findUnique({
      where: { id },
      include: {
        courses: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!match) {
      return null;
    }
    if (match.courses.length) {
      return new ConflictException(`Cannot remove major with related courses`);
    }

    return this.majorsService.majorModel.delete({
      where: { id },
    });
  }
}
