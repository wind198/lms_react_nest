import { IEducationBackground, IGender } from '../../utils/constants'
import { IHasDescriptiveFields, IHasId, ITimeStamp } from '../common.type'
import { IStudent } from './student.entity'

export type IGenerationCoreField = { year: number } & IHasDescriptiveFields & {
    students_count?: number
    students?: IStudent[]
  }

export type IGeneration = IGenerationCoreField & IHasId & ITimeStamp
