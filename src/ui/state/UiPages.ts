import { ReactNode } from 'react'
import { Msg } from '../../msg/Msg'

export enum UiPages {
    Activities = 'Activities',
    Storage = 'Storage',
    Woodcutting = 'Woodcutting',
}
export interface UiPageData {
    getText: (m: Msg) => string
    icon: ReactNode
}
