import type { IUser } from './user.entity'

export type IStudent = Omit<IUser, 'user_type'> & {
  user_type: 'student'
}
