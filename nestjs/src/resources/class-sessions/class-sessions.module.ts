import { Module } from '@nestjs/common';
import { ClassSessionsService } from './class-sessions.service';
import { ClassSessionsController } from './class-sessions.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  controllers: [ClassSessionsController],
  providers: [ClassSessionsService],
  imports: [PrismaModule],
})
export class ClassSessionsModule {}
