import { MsgFunctions } from '@/msg/MsgFunctions'
import { Effects } from '../effects/types/Effects'
import { IngredientData, PotionData, PotionFlaskData, SolventData } from '../alchemy/alchemyTypes'
import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { ExpEnum } from '../experience/ExpEnum'
import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'
import { ItemsMaterials } from './materials/ItemsMaterials'
import { WeaponCoatingData } from '../weaponCoatings/weaponCoatingTypes'

export enum ItemType {
    Weapon = 'Weapon',
    Armour = 'Armour',
    Tool = 'Tool',
    Crafting = 'Crafting',
    Consumable = 'Consumable',
}
export enum EquipmentSlot {
    Head = 'Head',
    Body = 'Body',
    Legs = 'Legs',
    Hands = 'Hands',
    Feet = 'Feet',
}
export enum ArmourType {
    Light = 'Light',
    Medium = 'Medium',
    Heavy = 'Heavy',
}
export enum WeaponType {
    OneHand = 'OneHand',
    TwoHands = 'TwoHands',
}
export enum ToolType {
    WoodAxe = 'WoodAxe',
    Pickaxe = 'Pickaxe',
}
export enum CraftingType {
    Log = 'Log',
    Plank = 'Plank',
    Handle = 'Handle',
    Ore = 'Ore',
    Gem = 'Gem',
    Bar = 'Bar',
    Corpse = 'Corpse',
    Food = 'Food',
    RawSkin = 'RawSkin',
    AlchemyIngredient = 'AlchemyIngredient',
    Solvent = 'Solvent',
}
export type ItemDetailType = WeaponType | EquipmentSlot | ToolType | CraftingType

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

interface ItemBase {
    id: string
    nameId: keyof Msg
    nameFunc?: keyof MsgFunctions
    icon: Icons
    color?: string
    materials?: ItemsMaterials
    value: number
    volume: number
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
    weaponCoatingData?: WeaponCoatingData
    unlimited?: boolean
}
export type NonEmptyArray<T> = [T, ...T[]]
export interface WeaponItem extends ItemBase {
    type: ItemType.Weapon
    weaponType: WeaponType
}
export interface ArmourItem extends ItemBase {
    type: ItemType.Armour
    equipmentSlot: EquipmentSlot
    armourType: ArmourType
}
export interface ToolItem extends ItemBase {
    type: ItemType.Tool
    toolType: ToolType
}
export interface CraftingItem extends ItemBase {
    type: ItemType.Crafting
    craftingTypes: NonEmptyArray<CraftingType>
}
export interface PotionItem extends ItemBase {
    type: ItemType.Consumable
}
export type Item = WeaponItem | ArmourItem | ToolItem | CraftingItem | PotionItem
type UnionKeys<T> = T extends unknown ? keyof T : never
type ItemKey = UnionKeys<Item>
export interface ItemFilter {
    descriptionId?: keyof Msg
    itemId?: string
    nameId?: keyof Msg
    itemType?: ItemType
    equipmentSlot?: EquipmentSlot
    armourType?: ArmourType
    weaponType?: WeaponType
    toolType?: ToolType
    craftingTypes?: CraftingType[]
    has?: ItemKey[]
    minStats?: Partial<ItemBase>
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
    potionEffects?: Effects[]
    unlimitedItems?: boolean
}
