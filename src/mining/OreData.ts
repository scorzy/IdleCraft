import { Msg } from '../msg/Msg'
import { Icons } from '../icons/Icons'
import { OreTypes } from './OreTypes'

interface OreDataType {
    id: OreTypes
    qta: number
    iconId: Icons
    nameId: keyof Msg
    hp: number
    armour: number
    oreId: string
    barId: string
    requiredLevel: number
}

export const OreData: Record<OreTypes, OreDataType> = {
    [OreTypes.Copper]: {
        id: OreTypes.Copper,
        qta: 20,
        iconId: Icons.Ore,
        nameId: 'CopperOre',
        hp: 100,
        armour: 1,
        oreId: 'CopperOre',
        barId: 'CopperBar',
        requiredLevel: 0,
    },
    [OreTypes.Tin]: {
        id: OreTypes.Tin,
        qta: 15,
        iconId: Icons.Ore,
        nameId: 'TinOre',
        hp: 200,
        armour: 2,
        oreId: 'TinOre',
        barId: 'TinBar',
        requiredLevel: 10,
    },
}
