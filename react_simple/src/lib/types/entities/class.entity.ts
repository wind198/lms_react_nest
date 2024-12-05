import { ICourse } from '@/lib/types/entities/course.entity'
import { IHasDescriptiveFields, IHasId, ITimeStamp } from '../common.type'
import { IClassSession } from '@/lib/types/entities/class-session.entity'

export type IClassCoreField = {} & IHasDescriptiveFields & {
    course_id: string
    course?: ICourse
    sessions?: IClassSession[]
  }

export type IClass = IClassCoreField & IHasId & ITimeStamp
