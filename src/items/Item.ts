import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { ExpEnum } from '../experience/expEnum'
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
    OneHand = 'OneHand',
    TwoHands = 'TwoHands',
    Body = 'Body',
    Corpse = 'Corpse',
    RawFood = 'RawFood',
}
export enum ItemSubType {
    Weapon = 'Weapon',
    Armour = 'Armour',
    Tool = 'Tool',
    Crafting = 'Crafting',
}

export enum DamageTypes {
    Slashing = 'Slashing',
    Piercing = 'Piercing',
    Bludgeoning = 'Bludgeoning',
}
export const damageTypesValues: DamageTypes[] = Object.keys(DamageTypes) as DamageTypes[]
export type DamageData = { [k in DamageTypes]?: number }
export interface CraftingData {
    prestige: number
    speedBonus?: number
    damage?: DamageData
    armour?: DamageData
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
    expType: ExpEnum
    damage: DamageData
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
    woodAxeData?: WoodAxeData
    craftingWoodAxeData?: WoodAxeData
    craftingPickaxeData?: PickaxeData
    pickaxeData?: PickaxeData
    weaponData?: WeaponData
    armourData?: DamageData
}
