import moize from 'moize'
import { GetItemNameParams } from '../msg/GetItemNameParams'
import { Msg } from '../msg/Msg'
import { ItemsMaterials } from './materials/ItemsMaterials'

export const GetItemNameParamsMemoized = moize(
    (itemNameId: keyof Msg, materials?: ItemsMaterials): GetItemNameParams => ({ itemNameId, materials }),
    { maxSize: 100 }
)
