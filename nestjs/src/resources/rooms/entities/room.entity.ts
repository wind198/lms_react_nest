import { Room } from '@prisma/client';

export type IRoomCoreField = Omit<Room, 'updated_at' | 'created_at' | 'id'>;
