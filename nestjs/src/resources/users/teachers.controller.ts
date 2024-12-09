import { Prisma } from '.prisma/client/index';
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
import { ListPagingSortingFilteringDto } from 'src/common/dtos/get-list-paging.dto';
import { ManyIdsDto } from '../../common/dtos/many-ids.dto';
import { handleFilter } from '../../common/helpers';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { omit } from 'lodash';
import { PrismaService } from '@/prisma/prisma.service';
import { ThrowNotFoundOrReturn } from '@decorators/throw-not-found-or-return.decorator';

@Controller('teachers')
export class TeachersController {
  constructor(
    private prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const duplicated = !!(await this.usersService.countEmailDuplication(
      createUserDto.email,
    ));
    if (duplicated) {
      throw new ConflictException('Email already taken');
    }
    const password = this.usersService.generateRandomPassword();

    return this.usersService.userModel.create({
      data: {
        ...createUserDto,
        password,
        user_type: 'TEACHER',
        full_name: `${createUserDto.first_name} ${createUserDto.last_name}`,
      },
    });
  }

  @Get()
  async findListPaging(@Query() qr: ListPagingSortingFilteringDto) {
    const { filter, order, order_by, page, per_page } = qr;

    // Validate page and per_page
    const pageNumber = page > 0 ? page : 1;
    const pageSize = per_page > 0 ? per_page : 10;
    const offset = (pageNumber - 1) * pageSize;
    const where: Prisma.UserWhereInput = {};

    handleFilter(where, filter, {
      dateFields: ['created_at', 'dob'],
      searchFields: ['phone', 'email'],
      fullTextSearchFields: ['full_name'],
    });

    where.user_type = 'TEACHER';

    // Fetch data using the service
    const [data, total] = await Promise.all([
      this.usersService.userModel.findMany({
        skip: offset,
        take: pageSize,
        where,
        orderBy: { [order_by as any]: order },
        include: {
          generation: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),
      this.usersService.userModel.count({
        where,
      }),
    ]);

    // Return paginated response
    return {
      data: data.map((i) => omit(i, 'password')),
      params: {
        from: (pageNumber - 1) * pageSize,
        to: Math.max(pageNumber * pageSize, total),
        total,
      },
    };
  }

  @ThrowNotFoundOrReturn('Teacher')
  @Get(':id/representation')
  async findOneRepresentation(@Param('id', ParseIntPipe) id: number) {
    const match = await this.usersService.userModel.findUnique({
      where: { id, user_type: 'TEACHER' },
      include: {
        generation: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    return match?.full_name;
  }

  @ThrowNotFoundOrReturn('Teacher')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.userModel.findUnique({
      where: { id, user_type: 'TEACHER' },
    });
  }

  @Patch('update-many')
  updateMany(@Query() qr: ManyIdsDto, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.userModel.updateMany({
      where: { id: { in: qr.ids }, user_type: 'TEACHER' },
      data: updateUserDto,
    });
  }

  @ThrowNotFoundOrReturn('Teacher')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.userModel.update({
      where: { id, user_type: 'TEACHER' },
      data: updateUserDto,
    });
  }

  @Delete('delete-many')
  removeMany(@Query() qr: ManyIdsDto) {
    return this.usersService.userModel.updateMany({
      where: { id: { in: qr.ids }, user_type: 'TEACHER' },
      data: {
        deleted_at: new Date().toISOString(),
      },
    });
  }

  @ThrowNotFoundOrReturn('Teacher')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.userModel.update({
      where: { id, user_type: 'TEACHER' },
      data: { deleted_at: new Date().toISOString() },
    });
  }
}
