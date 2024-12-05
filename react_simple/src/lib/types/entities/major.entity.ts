import { ICourse } from '@/lib/types/entities/course.entity'
import { IHasDescriptiveFields, IHasId, ITimeStamp } from '../common.type'

export type IMajorCoreField = {} & IHasDescriptiveFields & {
    courses_count?: number
    courses?: ICourse[]
  }

export type IMajor = IMajorCoreField & IHasId & ITimeStamp
