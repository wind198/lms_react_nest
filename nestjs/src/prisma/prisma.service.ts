import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit {
  client: PrismaClient;
  constructor() {
    const softDeletedModels = ['user'];

    this.client = new PrismaClient().$extends({
      query: {
        $allModels: {
          async findMany({ model, query, args, operation }) {
            console.log({ model, operation });
            if (softDeletedModels.includes(model.toLowerCase())) {
              args.where = {
                ...args.where,
                deleted_at: null,
              };
            }
            return query(args);
          },
          async findFirst({ model, query, args, operation }) {
            console.log({ model, operation });
            if (softDeletedModels.includes(model.toLowerCase())) {
              args.where = {
                ...args.where,
                deleted_at: null,
              };
            }
            return query(args);
          },
          async count({ model, query, args, operation }) {
            console.log({ model, operation });
            if (softDeletedModels.includes(model.toLowerCase())) {
              args.where = {
                ...args.where,
                deleted_at: null,
              };
            }
            return query(args);
          },
        },
      },
    }) as any;
  }

  async onModuleInit() {
    await this.client.$connect();
  }
}
