import { ReactNode } from 'react'
import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'

export interface MyToast {
    titleId?: keyof Msg
    descriptionId?: keyof Msg
    title?: string
    iconId?: Icons
    icon?: ReactNode
}
