import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Injectable()
export class RoomSettingsService {
  roomSettingModel: Prisma.RoomSettingDelegate<DefaultArgs>;
  constructor(private prisma: PrismaService) {
    this.roomSettingModel = prisma.client.roomSetting;
  }
}
