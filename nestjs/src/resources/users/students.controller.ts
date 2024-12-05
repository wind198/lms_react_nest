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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
        user_type: 'STUDENT',
      },
    });
  }

  @Get()
  async findListPaging(@Query() body: ListPagingSortingFilteringDto) {
    const { filter, order, order_by, page, per_page } = body;

    // Validate page and per_page
    const pageNumber = page > 0 ? page : 1;
    const pageSize = per_page > 0 ? per_page : 10;

    const where: Prisma.UserWhereInput = {};

    handleFilter(where, filter, { dateFields: ['created_at', 'dob'] });

    // Fetch data using the service
    const [data, total] = await Promise.all([
      this.usersService.userModel.findMany({
        skip: (page - 1) * per_page,
        take: per_page,
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
        where: {
          deleted_at: null,
        },
      }),
    ]);

    // Return paginated response
    return {
      page: pageNumber,
      per_page: pageSize,
      total,
      data: data.map((i) => omit(i, 'password')),
    };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.userModel.findUnique({ where: { id } });
  }

  @Patch('update-many')
  updateMany(@Query() qr: ManyIdsDto, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.userModel.updateMany({
      where: { id: { in: qr.ids } },
      data: updateUserDto,
    });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.userModel.update({
      where: { id },
      data: updateUserDto,
    });
  }

  @Delete('delete-many')
  removeMany(@Query() qr: ManyIdsDto) {
    return this.usersService.userModel.updateMany({
      where: { id: { in: qr.ids } },
      data: {
        deleted_at: new Date().toISOString(),
      },
    });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.userModel.update({
      where: { id },
      data: { deleted_at: new Date().toISOString() },
    });
  }
}
