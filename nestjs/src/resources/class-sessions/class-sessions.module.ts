import { forwardRef, Module } from '@nestjs/common';
import { ClassSessionsService } from './class-sessions.service';
import { ClassSessionsController } from './class-sessions.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { RoomsModule } from '@resources/rooms/rooms.module';

@Module({
  controllers: [ClassSessionsController],
  providers: [ClassSessionsService],
  exports: [ClassSessionsService],
  imports: [PrismaModule, forwardRef(() => RoomsModule)],
})
export class ClassSessionsModule {}
