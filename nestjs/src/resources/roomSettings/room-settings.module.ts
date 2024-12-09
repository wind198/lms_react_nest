import { Module } from '@nestjs/common';
import { RoomSettingsService } from './room-settings.service';
import { RoomSettingsController } from './room-settings.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  controllers: [RoomSettingsController],
  imports: [PrismaModule],
  providers: [RoomSettingsService],
})
export class RoomSettingsModule {}
