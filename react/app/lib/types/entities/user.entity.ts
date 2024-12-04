import { IGeneration } from '@/lib/types/entities/generation.entity'
import { IEducationBackground, IGender } from '../../utils/constants'
import { IHasId, ITimeStamp } from '../common.type'

export const UserTypeList = ['student', 'teacher', 'admin'] as const
export type IUserType = (typeof UserTypeList)[number]

export type IUserCoreField = {
  first_name: string
  last_name: string
  full_name: string
  email: string
  email_verified_at?: Date // Nullable timestamp
  user_type: 'student' | 'teacher' | 'admin' // Enum values for user_type
  phone?: string | null // Nullable string
  address?: string | null // Nullable string
  education_background: IEducationBackground
  gender: IGender
  dob?: Date | null // Nullable date
  generation_id?: number
  generation?: IGeneration
}

export type IUser = IUserCoreField & IHasId & ITimeStamp
