import { Key } from 'react'
import { IngredientData, PotionData, PotionFlaskData, SolventData } from '../alchemy/alchemyTypes'
import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { ExpEnum } from '../experience/ExpEnum'
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
    RawSkin = 'RawSkin',
    Potion = 'Potion',
}
export enum ItemSubType {
    Weapon = 'Weapon',
    Armour = 'Armour',
    Tool = 'Tool',
    Crafting = 'Crafting',
    Potion = 'Potion',
}

export enum DamageTypes {
    Slashing = 'Slashing',
    Piercing = 'Piercing',
    Bludgeoning = 'Bludgeoning',
}
export const damageTypesValues: DamageTypes[] = Object.keys(DamageTypes) as DamageTypes[]
export type DamageData = Partial<Record<DamageTypes, number>>
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
    subType?: ItemSubType
    value: number
    equipSlot?: EquipSlotsEnum
    craftingData?: CraftingData
    woodAxeData?: WoodAxeData
    craftingWoodAxeData?: WoodAxeData
    craftingPickaxeData?: PickaxeData
    pickaxeData?: PickaxeData
    weaponData?: WeaponData
    armourData?: DamageData
    ingredientData?: IngredientData
    solventData?: SolventData
    flaskData?: PotionFlaskData
    potionData?: PotionData
}
export interface ItemFilter {
    descriptionId?: keyof Msg
    itemId?: string
    nameId?: keyof Msg
    itemType?: ItemTypes
    itemSubType?: ItemSubType
    has?: (keyof Item)[]
    minStats?: Partial<Item>
    equipSlot?: EquipSlotsEnum
    craftingData?: Partial<CraftingData>
    woodAxeData?: Partial<WoodAxeData>
    craftingWoodAxeData?: Partial<WoodAxeData>
    craftingPickaxeData?: Partial<PickaxeData>
    pickaxeData?: Partial<PickaxeData>
    weaponData?: Partial<WeaponData>
    armourData?: Partial<DamageData>
    ingredientData?: Partial<IngredientData>
    solventData?: Partial<SolventData>
    flaskData?: Partial<PotionFlaskData>
    potionData?: Partial<PotionData>
}
