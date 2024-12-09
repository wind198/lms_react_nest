import { User } from '@prisma/client';

export type IUserCoreField = Omit<
  User,
  'updated_at' | 'created_at' | 'generation' | 'id' | 'is_active' | 'deleted_at'
>;
