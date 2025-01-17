import { forwardRef, Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { ClassSessionsModule } from '@resources/class-sessions/class-sessions.module';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
  imports: [PrismaModule, forwardRef(() => ClassSessionsModule)],
})
export class RoomsModule {}
