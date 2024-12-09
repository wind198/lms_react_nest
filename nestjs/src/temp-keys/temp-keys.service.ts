import { Injectable } from '@nestjs/common';
import { CreateTempKeyDto } from './dto/create-temp-key.dto';
import { UpdateTempKeyDto } from './dto/update-temp-key.dto';
import { PrismaService } from '../prisma/prisma.service';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';

@Injectable()
export class TempKeysService {
  tempKeysModel: Prisma.TempKeyDelegate<DefaultArgs>;

  constructor(private prisma: PrismaService) {
    this.tempKeysModel = prisma.client.tempKey;
  }
}
