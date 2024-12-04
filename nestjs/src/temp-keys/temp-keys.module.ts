import { Module } from '@nestjs/common';
import { TempKeysService } from './temp-keys.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [TempKeysService],
  exports: [TempKeysService],
  imports: [PrismaModule],
})
export class TempKeysModule {}
