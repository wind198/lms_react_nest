import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './students.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [PrismaModule],
})
export class UsersModule {}
