import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { getCraftingTime, getItemValue } from '../crafting/CraftingFunctions'
import { Recipe } from '../crafting/Recipe'
import {
    RecipeTypes,
    RecipeParameter,
    RecipeParameterValue,
    RecipeResult,
    RecipeParamType,
} from '../crafting/RecipeInterfaces'
import { GameState } from '../game/GameState'
import { Icons } from '../icons/Icons'
import { Item, ItemTypes } from '../items/Item'
import { OreData } from '../mining/OreData'
import { selectGameItem } from '../storage/StorageSelectors'

const barParam: RecipeParameter[] = [
    {
        id: 'ore',
        nameId: 'Ore',
        type: RecipeParamType.ItemType,
        itemType: ItemTypes.Ore,
    },
]

const OreToBar = new Map<string, string>()
Object.values(OreData).forEach((w) => OreToBar.set(w.oreId, w.barId))

export const BarRecipe: Recipe = {
    id: 'BarRecipe',
    type: RecipeTypes.Smithing,
    nameId: 'Bar',
    getParameters: function (_state: GameState): RecipeParameter[] {
        return barParam
    },
    getResult: function (_state: GameState, params: RecipeParameterValue[]): RecipeResult | undefined {
        const ore = params.find((i) => i.id === 'ore')
        if (ore === undefined) return
        if (!ore.stdItemId) return
        const res = OreToBar.get(ore.stdItemId)

        return {
            time: 3e3,
            requirements: [
                {
                    qta: 1,
                    stdItemId: ore.stdItemId,
                },
            ],
            results: {
                qta: 1,
                stdItemId: res,
            },
        }
    },
}

const woodAxeParam: RecipeParameter[] = [
    {
        id: 'bar',
        nameId: 'Bar',
        type: RecipeParamType.ItemType,
        itemType: ItemTypes.Bar,
    },
    {
        id: 'handle',
        nameId: 'Handle',
        type: RecipeParamType.ItemType,
        itemType: ItemTypes.Handle,
    },
]

export const AxeRecipe: Recipe = {
    id: 'AxeRecipe',
    type: RecipeTypes.Smithing,
    nameId: 'WoodAxe',
    getParameters: function (_state: GameState): RecipeParameter[] {
        return woodAxeParam
    },
    getResult: function (_state: GameState, params: RecipeParameterValue[]): RecipeResult | undefined {
        const bar = params.find((i) => i.id === 'bar')
        if (bar === undefined) return

        const handle = params.find((i) => i.id === 'handle')
        if (handle === undefined) return

        const barItem = selectGameItem(bar.stdItemId, bar.stdItemId)(_state)
        if (!barItem) return
        const handleItem = selectGameItem(handle.stdItemId, handle.stdItemId)(_state)
        if (!handleItem) return

        if (!barItem.craftingWoodAxeData) return
        if (!handleItem.handleData) return

        const components = [barItem, handleItem]

        const craftedAxe: Item = {
            id: '',
            nameId: 'WoodAxe',
            icon: Icons.Axe,
            type: ItemTypes.WoodAxe,
            equipSlot: EquipSlotsEnum.WoodAxe,
            value: getItemValue(components, true),
            woodAxeData: {
                damage: barItem.craftingWoodAxeData.damage,
                time: barItem.craftingWoodAxeData.time / handleItem.handleData.speedBonus,
            },
        }

        return {
            time: getCraftingTime(components),
            requirements: [
                {
                    qta: 1,
                    stdItemId: bar.stdItemId,
                    craftedItemId: bar.stdItemId,
                },
                {
                    qta: 1,
                    stdItemId: handle.stdItemId,
                    craftedItemId: bar.stdItemId,
                },
            ],
            results: {
                qta: 1,
                craftedItem: craftedAxe,
            },
        }
    },
}

export const PickaxeRecipe: Recipe = {
    id: 'Pickaxe',
    type: RecipeTypes.Smithing,
    nameId: 'Pickaxe',
    getParameters: function (_state: GameState): RecipeParameter[] {
        return woodAxeParam
    },
    getResult: function (_state: GameState, params: RecipeParameterValue[]): RecipeResult | undefined {
        const bar = params.find((i) => i.id === 'bar')
        if (bar === undefined) return

        const handle = params.find((i) => i.id === 'handle')
        if (handle === undefined) return

        const barItem = selectGameItem(bar.stdItemId, bar.stdItemId)(_state)
        if (!barItem) return
        const handleItem = selectGameItem(handle.stdItemId, handle.stdItemId)(_state)
        if (!handleItem) return

        if (!barItem.craftingPickaxeData) return
        if (!handleItem.handleData) return

        const components = [barItem, handleItem]

        const craftedAxe: Item = {
            id: '',
            nameId: 'Pickaxe',
            icon: Icons.Axe,
            type: ItemTypes.Pickaxe,
            equipSlot: EquipSlotsEnum.Pickaxe,
            value: getItemValue(components, true),
            pickaxeData: {
                damage: barItem.craftingPickaxeData.damage,
                time: barItem.craftingPickaxeData.time / handleItem.handleData.speedBonus,
                armourPen: barItem.craftingPickaxeData.armourPen,
            },
        }

        return {
            time: getCraftingTime(components),
            requirements: [
                {
                    qta: 1,
                    stdItemId: bar.stdItemId,
                    craftedItemId: bar.stdItemId,
                },
                {
                    qta: 1,
                    stdItemId: handle.stdItemId,
                    craftedItemId: bar.stdItemId,
                },
            ],
            results: {
                qta: 1,
                craftedItem: craftedAxe,
            },
        }
    },
}
export const SmithingRecipes = {
    [BarRecipe.id]: BarRecipe,
    [AxeRecipe.id]: AxeRecipe,
    [PickaxeRecipe.id]: PickaxeRecipe,
} satisfies Record<string, Recipe>
