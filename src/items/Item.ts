import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'

export enum ItemTypes {
    Log = 'Log',
    Plank = 'Plank',
    Handle = 'Handle',
    Ore = 'Ore',
    Bar = 'Bar',
    WoodAxe = 'WoodAxe',
    Pickaxe = 'Pickaxe',
    MainHand = 'MainHand',
    TwoHand = 'TwoHand',
}
export enum DamageTypes {
    Slashing = 'Slashing',
    Piercing = 'Piercing',
    Bludgeoning = 'Bludgeoning',
}
export interface CraftingData {
    prestige: number
}
export interface HandleData {
    speedBonus: number
}
export interface WoodAxeData {
    damage: number
    time: number
}
export interface PickaxeData {
    damage: number
    time: number
    armourPen: number
}
export interface WeaponData {
    damage: number
    damageType: DamageTypes
    attackSpeed: number
}
export interface Item {
    id: string
    nameId: keyof Msg
    icon: Icons
    type: ItemTypes
    value: number
    equipSlot?: EquipSlotsEnum
    craftingData?: CraftingData
    handleData?: HandleData
    woodAxeData?: WoodAxeData
    craftingWoodAxeData?: WoodAxeData
    craftingPickaxeData?: PickaxeData
    pickaxeData?: PickaxeData
    weaponData?: WeaponData
}
