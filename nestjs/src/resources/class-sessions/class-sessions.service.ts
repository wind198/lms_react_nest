import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Injectable()
export class ClassSessionsService {
  classSessionModel: Prisma.ClassSessionDelegate<DefaultArgs>;
  constructor(private prisma: PrismaService) {
    this.classSessionModel = prisma.client.classSession;
  }
}
