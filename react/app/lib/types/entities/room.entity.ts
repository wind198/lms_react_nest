import { IHasDescriptiveFields, IHasId, ITimeStamp } from '../common.type'

export type IRoomCoreField = {} & IHasDescriptiveFields & {
    address: string
  }

export type IRoom = IRoomCoreField & IHasId & ITimeStamp
