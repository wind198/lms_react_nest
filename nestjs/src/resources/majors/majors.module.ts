import { Module } from '@nestjs/common';
import { MajorsService } from './majors.service';
import { MajorsController } from './majors.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  controllers: [MajorsController],
  providers: [MajorsService],
  imports: [PrismaModule],
  exports: [MajorsService],
})
export class MajorsModule {}
