import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    const softDeletedModels = ['user'];
    await this.$connect();
    this.$extends({
      query: {
        $allModels: {
          async findMany({ model, query, args, operation }) {
            console.log({ model, operation });
            if (softDeletedModels.includes(model)) {
              args.where = {
                ...args.where,
                deleted_at: null,
              };
              return query(args);
            }
          },
          async findFirst({ model, query, args, operation }) {
            console.log({ model, operation });
            if (softDeletedModels.includes(model)) {
              args.where = {
                ...args.where,
                deleted_at: null,
              };
              return query(args);
            }
          },
        },
      },
    });
  }
}
