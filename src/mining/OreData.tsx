import { ReactNode } from 'react'
import { GiOre } from 'react-icons/gi'
import { Msg } from '../msg/Msg'
import { OreTypes } from './OreTypes'

export interface OreDataType {
    id: OreTypes
    qta: number
    icon: ReactNode
    nameId: keyof Msg
    hp: number
    armour: number
    oreId: string
    barId: string
}

export const OreData: { [k in OreTypes]: OreDataType } = {
    [OreTypes.Copper]: {
        id: OreTypes.Copper,
        qta: 10,
        icon: <GiOre />,
        nameId: 'CopperOre',
        hp: 100,
        armour: 1,
        oreId: 'CopperOre',
        barId: 'CopperBar',
    },
    [OreTypes.Tin]: {
        id: OreTypes.Tin,
        qta: 20,
        icon: <GiOre />,
        nameId: 'TinOre',
        hp: 200,
        armour: 2,
        oreId: 'TinOre',
        barId: 'TinBar',
    },
}
