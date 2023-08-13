import { ReactNode } from 'react'
import { WoodTypes } from './WoodTypes'
import { GiDeadWood, GiOak } from 'react-icons/gi'
import { Msg } from '../msg/Msg'

export interface WoodDataType {
    maxHp: number
    maxQta: number
    icon: ReactNode
    nameId: keyof Msg
    logId: string
    plankId: string
}
export const WoodData: { [k in WoodTypes]: WoodDataType } = {
    [WoodTypes.DeadTree]: {
        maxHp: 100,
        maxQta: 10,
        icon: <GiDeadWood />,
        nameId: 'DeadTree',
        logId: 'DeadTreeLog',
        plankId: 'DeadTreePlank',
    },
    [WoodTypes.Oak]: {
        maxHp: 200,
        maxQta: 5,
        icon: <GiOak />,
        nameId: 'Oak',
        logId: 'OakLog',
        plankId: 'OakPlank',
    },
}
