import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'
export enum ItemTypes {
    Log = 'Log',
    Plank = 'Plank',
    Handle = 'Handle',
}
export interface Item {
    id: string
    nameId: keyof Msg
    icon: Icons
    type: ItemTypes
    value: number
}
