import { IMajor } from '@/lib/types/entities/major.entity'
import { IHasDescriptiveFields, IHasId, ITimeStamp } from '../common.type'

export type ICourseCoreField = {} & IHasDescriptiveFields & {
    courses_count?: number
    major?: IMajor
    major_id: string
  }

export type ICourse = ICourseCoreField & IHasId & ITimeStamp
