import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'

export enum ItemTypes {
    Log = 'Log',
    Plank = 'Plank',
    Handle = 'Handle',
    Ore = 'Ore',
    Bar = 'Bar',
    WoodAxe = 'WoodAxe',
}
export interface CraftingData {
    prestige: number
}
export interface HandleData {
    speedBonus: number
}
export interface WoodAxeData {
    woodcuttingDamage: number
    woodcuttingTime: number
}
export interface Item {
    id: string
    nameId: keyof Msg
    icon: Icons
    type: ItemTypes
    value: number
    craftingData?: CraftingData
    handleData?: HandleData
    woodAxeData?: WoodAxeData
    craftingWoodAxeData?: WoodAxeData
}
