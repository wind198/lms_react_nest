import { User } from '@prisma/client';

export type IUserCoreField = Pick<
  User,
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'phone'
  | 'address'
  | 'dob'
  | 'gender'
  | 'generation_id'
  | 'user_type'
  | 'education_background'
>;
