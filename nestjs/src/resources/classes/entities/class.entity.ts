import { Class } from '@prisma/client';

export type IClassCoreField = Omit<Class, 'updated_at' | 'created_at' | 'id'>;
