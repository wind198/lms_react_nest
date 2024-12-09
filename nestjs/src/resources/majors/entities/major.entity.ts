import { Major } from '@prisma/client';

export type IMajorCoreField = Omit<Major, 'updated_at' | 'created_at' | 'id'>;
