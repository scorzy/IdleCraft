import { ArmourType, CraftingType, EquipmentSlot, ItemType, ToolType, WeaponType } from '../../items/Item'

type SaveRecord = Record<string, unknown>

const isRecord = (value: unknown): value is SaveRecord => typeof value === 'object' && value !== null

const legacyItemTypeData: Record<string, SaveRecord> = {
    Log: { type: ItemType.Crafting, craftingTypes: [CraftingType.Log] },
    Plank: { type: ItemType.Crafting, craftingTypes: [CraftingType.Plank] },
    Handle: { type: ItemType.Crafting, craftingTypes: [CraftingType.Handle] },
    Ore: { type: ItemType.Crafting, craftingTypes: [CraftingType.Ore] },
    Gem: { type: ItemType.Crafting, craftingTypes: [CraftingType.Gem] },
    Bar: { type: ItemType.Crafting, craftingTypes: [CraftingType.Bar] },
    Corpse: { type: ItemType.Crafting, craftingTypes: [CraftingType.Corpse] },
    RawFood: { type: ItemType.Crafting, craftingTypes: [CraftingType.Food] },
    RawSkin: { type: ItemType.Crafting, craftingTypes: [CraftingType.RawSkin] },
    CraftingIngredient: { type: ItemType.Crafting, craftingTypes: [CraftingType.AlchemyIngredient] },
    Solvent: { type: ItemType.Crafting, craftingTypes: [CraftingType.Solvent] },
    Flask: { type: ItemType.Consumable },
    Potion: { type: ItemType.Consumable },
    OneHand: { type: ItemType.Weapon, weaponType: WeaponType.OneHand },
    TwoHands: { type: ItemType.Weapon, weaponType: WeaponType.TwoHands },
    WoodAxe: { type: ItemType.Tool, toolType: ToolType.WoodAxe },
    Pickaxe: { type: ItemType.Tool, toolType: ToolType.Pickaxe },
    Head: { type: ItemType.Armour, equipmentSlot: EquipmentSlot.Head, armourType: ArmourType.Heavy },
    Body: { type: ItemType.Armour, equipmentSlot: EquipmentSlot.Body, armourType: ArmourType.Heavy },
    Legs: { type: ItemType.Armour, equipmentSlot: EquipmentSlot.Legs, armourType: ArmourType.Heavy },
    Hands: { type: ItemType.Armour, equipmentSlot: EquipmentSlot.Hands, armourType: ArmourType.Heavy },
    Feet: { type: ItemType.Armour, equipmentSlot: EquipmentSlot.Feet, armourType: ArmourType.Heavy },
}

const detailForLegacyItemType = (legacyType: unknown) => {
    const migration = legacyItemTypeData[legacyType as string]
    if (!migration) return
    const craftingTypes = migration.craftingTypes
    return (
        migration.weaponType ??
        migration.equipmentSlot ??
        migration.toolType ??
        (Array.isArray(craftingTypes) ? craftingTypes[0] : undefined)
    )
}

export const migrateItemTaxonomy = (state: unknown) => {
    if (!isRecord(state)) return state

    const entries =
        isRecord(state.craftedItems) && isRecord(state.craftedItems.entries) ? state.craftedItems.entries : undefined
    if (entries)
        Object.values(entries).forEach((item) => {
            if (!isRecord(item) || typeof item.type !== 'string') return
            const migration = legacyItemTypeData[item.type]
            if (migration) Object.assign(item, migration)
        })

    if (!isRecord(state.ui)) return state
    const legacySubType = state.ui.itemFilterSubType
    const legacyItemType = state.ui.itemFilterType
    if (typeof legacySubType === 'string') {
        state.ui.itemFilterType = legacySubType
        state.ui.itemFilterDetail = detailForLegacyItemType(legacyItemType)
        delete state.ui.itemFilterSubType
    } else if (typeof legacyItemType === 'string' && legacyItemTypeData[legacyItemType]) {
        state.ui.itemFilterType = legacyItemTypeData[legacyItemType].type
        state.ui.itemFilterDetail = detailForLegacyItemType(legacyItemType)
    }

    return state
}
