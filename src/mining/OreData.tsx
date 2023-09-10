import { ReactNode } from 'react'
import { Msg } from '../msg/Msg'
import { OreTypes } from './OreTypes'
import { GiOre } from 'react-icons/gi'

export interface OreDataType {
    qta: number
    icon: ReactNode
    nameId: keyof Msg
    hp: number
}

export const OreData: { [k in OreTypes]: OreDataType } = {
    [OreTypes.Copper]: {
        qta: 10,
        icon: <GiOre />,
        nameId: 'CopperOre',
        hp: 100,
    },
    [OreTypes.Tin]: {
        qta: 20,
        icon: <GiOre />,
        nameId: 'TinOre',
        hp: 200,
    },
}
