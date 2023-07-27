import { ReactNode } from 'react'
import { WoodTypes } from './WoodTypes'
import { GiDeadWood, GiOak } from 'react-icons/gi'
import { Msg } from '../msg/Msg'

export interface WoodDataType {
    maxHp: number
    maxQta: number
    icon: ReactNode
    getName: (m: Msg) => string
}
export const WoodData: { [k in WoodTypes]: WoodDataType } = {
    [WoodTypes.DeadTree]: {
        maxHp: 100,
        maxQta: 10,
        icon: <GiDeadWood />,
        getName: (m: Msg) => m.DeadTree,
    },
    [WoodTypes.Oak]: {
        maxHp: 200,
        maxQta: 5,
        icon: <GiOak />,
        getName: (m: Msg) => m.Oak,
    },
}
