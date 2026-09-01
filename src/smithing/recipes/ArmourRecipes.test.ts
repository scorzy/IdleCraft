import { describe, expect, it } from 'vitest'
import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { Recipe } from '../../crafting/Recipe'
import { GetInitialGameState } from '../../game/InitialGameState'
import { DamageTypes, EquipmentSlot, ItemType } from '../../items/Item'
import { Msg } from '../../msg/Msg'
import { armourRecipe } from './ArmourRecipes'
import { bootsRecipe } from './BootsRecipe'
import { handsRecipe } from './HandsRecipe'
import { helmetRecipe } from './HelmetRecipe'
import { pantsRecipe } from './PantsRecipe'

interface ArmourRecipeCase {
    name: string
    recipe: Recipe
    itemName: keyof Msg
    itemType: ItemType
    equipmentSlot: EquipmentSlot
    equipSlot: EquipSlotsEnum
    barQta: number
    armour: number
}

const armourRecipeCases: ArmourRecipeCase[] = [
    {
        name: 'body armour',
        recipe: armourRecipe,
        itemName: 'Armour',
        itemType: ItemType.Armour,
        equipmentSlot: EquipmentSlot.Body,
        equipSlot: EquipSlotsEnum.Body,
        barQta: 4,
        armour: 10,
    },
    {
        name: 'pants',
        recipe: pantsRecipe,
        itemName: 'Cuisses',
        itemType: ItemType.Armour,
        equipmentSlot: EquipmentSlot.Legs,
        equipSlot: EquipSlotsEnum.Legs,
        barQta: 3,
        armour: 7,
    },
    {
        name: 'helmet',
        recipe: helmetRecipe,
        itemName: 'Helmet',
        itemType: ItemType.Armour,
        equipmentSlot: EquipmentSlot.Head,
        equipSlot: EquipSlotsEnum.Head,
        barQta: 2,
        armour: 5,
    },
    {
        name: 'hands',
        recipe: handsRecipe,
        itemName: 'Gauntlets',
        itemType: ItemType.Armour,
        equipmentSlot: EquipmentSlot.Hands,
        equipSlot: EquipSlotsEnum.Hands,
        barQta: 2,
        armour: 3,
    },
    {
        name: 'boots',
        recipe: bootsRecipe,
        itemName: 'Boots',
        itemType: ItemType.Armour,
        equipmentSlot: EquipmentSlot.Feet,
        equipSlot: EquipSlotsEnum.Feet,
        barQta: 2,
        armour: 3,
    },
]

describe('armour smithing recipes', () => {
    it.each(armourRecipeCases)('crafts $name with the expected slot, type, and values', (data) => {
        const state = GetInitialGameState()
        const result = data.recipe.getResult(state, [{ id: 'bar', itemId: 'CopperBar' }])

        expect(result).toBeDefined()
        if (!result) throw new Error('Expected recipe result')

        expect(result.time).toBe(data.barQta * 1.5e3)
        expect(result.requirements).toEqual([{ qta: data.barQta, itemId: 'CopperBar' }])

        const craftedItem = result.results.at(0)?.craftedItem
        expect(craftedItem).toBeDefined()
        if (!craftedItem) throw new Error('Expected crafted item')

        expect(craftedItem.nameId).toBe(data.itemName)
        expect(craftedItem.type).toBe(data.itemType)
        expect(craftedItem.equipSlot).toBe(data.equipSlot)
        expect(craftedItem.armourData?.[DamageTypes.Bludgeoning]).toBe(data.armour)
        expect(craftedItem.armourData?.[DamageTypes.Piercing]).toBe(data.armour)
        expect(craftedItem.armourData?.[DamageTypes.Slashing]).toBe(data.armour)
        expect(craftedItem.value).toBeGreaterThan(0)
    })
})
