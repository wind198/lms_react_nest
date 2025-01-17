import { ClassSession } from '@prisma/client';

export type IClassSessionCoreField = Omit<
  ClassSession,
  'updated_at' | 'created_at' | 'id'
>;
