import { Materials } from '../items/materials/materials'
import { Msg } from './Msg'

export interface GetItemNameParams {
    itemNameId: keyof Msg
    materials?: Record<string, Materials>
}
