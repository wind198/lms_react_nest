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
import {
  IHasCreateRoute,
  IHasDeleteRoute,
  IHasGetRoute,
  IHasRepresentationRoute,
  IHasUpdateRoute,
} from '@/common/types/index';

@Controller('admins')
export class AdminsController
  implements
    IHasCreateRoute,
    IHasGetRoute<true>,
    IHasUpdateRoute<true>,
    IHasDeleteRoute<true>,
    IHasRepresentationRoute
{
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
        user_type: 'ADMIN',
        full_name: `${createUserDto.first_name} ${createUserDto.last_name}`,
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
    const where: Prisma.UserWhereInput = {};

    handleFilter(where, filter, {
      dateFields: ['created_at', 'dob'],
      searchFields: ['phone', 'email'],
      fullTextSearchFields: ['full_name'],
    });

    where.user_type = 'ADMIN';

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

  @ThrowNotFoundOrReturn('Admin')
  @Get(':id/representation')
  async getRepresentaion(@Param('id', ParseIntPipe) id: number) {
    const match = await this.usersService.userModel.findUnique({
      where: { id, user_type: 'ADMIN' },
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

  @Get('get-many')
  getMany(@Query() qr: ManyIdsDto) {
    return this.usersService.userModel.findMany({
      where: {
        id: { in: qr.ids },
        user_type: 'ADMIN',
      },
    });
  }

  @ThrowNotFoundOrReturn('Admin')
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.userModel.findUnique({
      where: { id, user_type: 'ADMIN' },
    });
  }

  @Patch('update-many')
  updateMany(@Query() qr: ManyIdsDto, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.userModel.updateMany({
      where: { id: { in: qr.ids }, user_type: 'ADMIN' },
      data: updateUserDto,
    });
  }

  @ThrowNotFoundOrReturn('Admin')
  @Patch(':id')
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.userModel.update({
      where: { id, user_type: 'ADMIN' },
      data: updateUserDto,
    });
  }

  @Delete('delete-many')
  removeMany(@Query() qr: ManyIdsDto) {
    return this.usersService.userModel.updateMany({
      where: { id: { in: qr.ids }, user_type: 'ADMIN' },
      data: {
        deleted_at: new Date().toISOString(),
      },
    });
  }

  @ThrowNotFoundOrReturn('Admin')
  @Delete(':id')
  removeOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.userModel.update({
      where: { id, user_type: 'ADMIN' },
      data: { deleted_at: new Date().toISOString() },
    });
  }
}
