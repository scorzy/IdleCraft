import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'

export interface Item {
    id: string
    nameId: keyof Msg
    icon: Icons
}
