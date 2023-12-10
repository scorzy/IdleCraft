import { ReactNode } from 'react'
import { GiDeadWood, GiOak } from 'react-icons/gi'
import { Msg } from '../msg/Msg'
import { HandleData } from '../items/Item'
import { WoodTypes } from './WoodTypes'

export interface WoodDataType {
    maxHp: number
    maxQta: number
    icon: ReactNode
    nameId: keyof Msg
    logId: string
    plankId: string
    handleId: string
    handleData: HandleData
}
export const WoodData: { [k in WoodTypes]: WoodDataType } = {
    [WoodTypes.DeadTree]: {
        maxHp: 100,
        maxQta: 10,
        icon: <GiDeadWood />,
        nameId: 'DeadTree',
        logId: 'DeadTreeLog',
        plankId: 'DeadTreePlank',
        handleId: 'DeadTreeHandle',
        handleData: {
            speedBonus: 1,
        },
    },
    [WoodTypes.Oak]: {
        maxHp: 200,
        maxQta: 5,
        icon: <GiOak />,
        nameId: 'Oak',
        logId: 'OakLog',
        plankId: 'OakPlank',
        handleId: 'OakHandle',
        handleData: {
            speedBonus: 1.1,
        },
    },
}
