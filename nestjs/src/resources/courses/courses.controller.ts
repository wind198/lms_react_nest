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
import { CreateCourseDto } from '@resources/courses/dto/create-course.dto';
import { UpdateCourseDto } from '@resources/courses/dto/update-course.dto';
import { CoursesService } from '@resources/courses/courses.service';
import { omit } from 'lodash';
import { ListPagingSortingFilteringDto } from 'src/common/dtos/get-list-paging.dto';

const RESOURCE = 'course';

@Controller('courses')
@Resource(RESOURCE)
export class CoursesController {
  constructor(
    private prisma: PrismaService,
    private readonly coursesService: CoursesService,
  ) {}

  @Post()
  async create(@Body() createCourseDto: CreateCourseDto) {
    const { major_id } = createCourseDto;
    if (
      major_id &&
      !(await this.coursesService.courseModel.findUnique({
        where: { id: major_id },
      }))
    ) {
      throw new NotFoundException(`Major with id ${major_id} not found`);
    }
    return await this.coursesService.courseModel.create({
      data: createCourseDto,
    });
  }

  @Get()
  async getListPaging(@Query() qr: ListPagingSortingFilteringDto) {
    const { filter, order, order_by, page, per_page } = qr;

    // Validate page and per_page
    const pageNumber = page > 0 ? page : 1;
    const pageSize = per_page > 0 ? per_page : 10;
    const offset = (pageNumber - 1) * pageSize;
    const where: Prisma.CourseWhereInput = {};

    handleFilter(where, filter, {
      dateFields: ['created_at'],
      searchFields: ['title'],
    });

    // Fetch data using the service
    const [data, total] = await Promise.all([
      this.coursesService.courseModel.findMany({
        skip: offset,
        take: pageSize,
        where,
        orderBy: { [order_by as any]: order },
        include: { major: { select: { title: true, id: true } } },
      }),
      this.coursesService.courseModel.count({
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
    return this.coursesService.courseModel.findMany({
      where: { id: { in: qr.ids } },
    });
  }

  @ThrowNotFoundOrReturn(RESOURCE)
  @Get(':id/representation')
  async findOneRepresentation(@Param('id', ParseIntPipe) id: number) {
    const match = await this.coursesService.courseModel.findUnique({
      where: { id },
    });
    return match?.title;
  }

  @ThrowNotFoundOrReturn(RESOURCE)
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.courseModel.findUnique({
      where: { id },
    });
  }

  @Patch('update-many')
  async updateMany(
    @Query() qr: ManyIdsDto,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    const { major_id } = updateCourseDto;
    if (
      major_id &&
      !(await this.coursesService.courseModel.findUnique({
        where: { id: major_id },
      }))
    ) {
      throw new NotFoundException(`Major with id ${major_id} not found`);
    }

    return await this.coursesService.courseModel.updateMany({
      where: { id: { in: qr.ids } },
      data: updateCourseDto,
    });
  }

  @ThrowNotFoundOrReturn(RESOURCE)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    const { major_id } = updateCourseDto;

    if (
      major_id &&
      !(await this.coursesService.courseModel.findUnique({
        where: { id: major_id },
      }))
    ) {
      throw new NotFoundException(`Major with id ${major_id} not found`);
    }

    return await this.coursesService.courseModel.update({
      where: { id },
      data: updateCourseDto,
    });
  }

  @Delete('delete-many')
  async removeMany(@Query() qr: ManyIdsDto) {
    const matches = await this.coursesService.courseModel.findMany({
      where: { id: { in: qr.ids } },
      include: {
        classes: {
          select: {
            id: true,
          },
        },
      },
    });

    const violated = matches.find((i) => i.classes.length > 0);

    if (violated) {
      throw new ConflictException(
        `Cannot delete course ${violated.title} with related classes.`,
      );
    }
    return this.coursesService.courseModel.deleteMany({
      where: { id: { in: qr.ids } },
    });
  }

  @ThrowNotFoundOrReturn(RESOURCE)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const match = await this.coursesService.courseModel.findUnique({
      where: { id },
      include: {
        classes: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!match) {
      return null;
    }
    if (match.classes.length) {
      return new ConflictException(`Cannot remove course with related classes`);
    }

    return this.coursesService.courseModel.delete({
      where: { id },
    });
  }
}
