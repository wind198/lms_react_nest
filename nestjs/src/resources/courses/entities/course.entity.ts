import { Course } from '@prisma/client';

export type ICourseCoreField = Omit<Course, 'updated_at' | 'created_at' | 'id'>;
