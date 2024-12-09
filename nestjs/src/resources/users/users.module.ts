import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { StudentsController } from './students.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { TeachersController } from '@resources/users/teachers.controller';
import { AdminsController } from '@resources/users/admins.controller';

@Module({
  controllers: [StudentsController, TeachersController, AdminsController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [PrismaModule],
})
export class UsersModule {}
