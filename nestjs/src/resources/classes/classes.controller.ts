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
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateClassDto } from '@resources/classes/dto/create-class.dto';
import { UpdateClassDto } from '@resources/classes/dto/update-class.dto';
import { ClassesService } from '@resources/classes/classes.service';
import { ListPagingSortingFilteringDto } from 'src/common/dtos/get-list-paging.dto';
import { CoursesService } from '@resources/courses/courses.service';

const RESOURCE = 'class';

@Controller('classes')
@Resource(RESOURCE)
export class ClassesController {
  constructor(
    private prisma: PrismaService,
    private readonly classesService: ClassesService,
    private readonly courseService: CoursesService,
  ) {}

  @Post()
  async create(@Body() createClassDto: CreateClassDto) {
    const { course_id } = createClassDto;
    if (
      course_id &&
      !(await this.courseService.courseModel.findUnique({
        where: { id: course_id },
      }))
    ) {
      throw new NotFoundException(`Course with id ${course_id} not found`);
    }
    return await this.classesService.classModel.create({
      data: createClassDto,
    });
  }

  @Get()
  async getListPaging(@Query() qr: ListPagingSortingFilteringDto) {
    const { filter, order, order_by, page, per_page } = qr;

    // Validate page and per_page
    const pageNumber = page > 0 ? page : 1;
    const pageSize = per_page > 0 ? per_page : 10;
    const offset = (pageNumber - 1) * pageSize;
    const where: Prisma.ClassWhereInput = {};

    handleFilter(where, filter, {
      dateFields: ['created_at'],
      searchFields: ['title'],
    });

    // Fetch data using the service
    const [data, total] = await Promise.all([
      this.classesService.classModel.findMany({
        skip: offset,
        take: pageSize,
        where,
        orderBy: { [order_by as any]: order },
      }),
      this.classesService.classModel.count({
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
    return this.classesService.classModel.findMany({
      where: { id: { in: qr.ids } },
    });
  }

  @ThrowNotFoundOrReturn(RESOURCE)
  @Get(':id/representation')
  async findOneRepresentation(@Param('id', ParseIntPipe) id: number) {
    const match = await this.classesService.classModel.findUnique({
      where: { id },
    });
    return match?.title;
  }

  @ThrowNotFoundOrReturn(RESOURCE)
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.classesService.classModel.findUnique({
      where: { id },
    });
  }

  @Patch('update-many')
  updateMany(@Query() qr: ManyIdsDto, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.classModel.updateMany({
      where: { id: { in: qr.ids } },
      data: updateClassDto,
    });
  }

  @ThrowNotFoundOrReturn(RESOURCE)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    return this.classesService.classModel.update({
      where: { id },
      data: updateClassDto,
    });
  }

  @Delete('delete-many')
  async removeMany(@Query() qr: ManyIdsDto) {
    const matches = await this.classesService.classModel.findMany({
      where: { id: { in: qr.ids } },
      include: {
        course: {
          select: {
            id: true,
          },
        },
      },
    });

    if (matches.some((i) => i.status === 'RUNNING')) {
      throw new ConflictException('Cannot delete running class.');
    }
    return this.classesService.classModel.deleteMany({
      where: { id: { in: qr.ids } },
    });
  }

  @ThrowNotFoundOrReturn(RESOURCE)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const match = await this.classesService.classModel.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!match) {
      return null;
    }
    if (match.status === 'RUNNING') {
      return new ConflictException(`Cannot remove running class`);
    }

    return this.classesService.classModel.delete({
      where: { id },
    });
  }
}
