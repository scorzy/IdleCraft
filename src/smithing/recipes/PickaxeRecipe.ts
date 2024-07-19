import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { getCraftingTime, getItemValue } from '../../crafting/CraftingFunctions'
import { Recipe } from '../../crafting/Recipe'
import {
    RecipeTypes,
    RecipeParameter,
    RecipeParameterValue,
    RecipeResult,
    RecipeParamType,
} from '../../crafting/RecipeInterfaces'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { Item, ItemSubType, ItemTypes } from '../../items/Item'
import { selectGameItem } from '../../storage/StorageSelectors'

const pickaxeParam: RecipeParameter[] = [
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

export const PickaxeRecipe: Recipe = {
    id: 'Pickaxe',
    type: RecipeTypes.Smithing,
    nameId: 'Pickaxe',
    iconId: Icons.Pickaxe,
    itemSubType: ItemSubType.Tool,
    getParameters: function (): RecipeParameter[] {
        return pickaxeParam
    },
    getResult: function (state: GameState, params: RecipeParameterValue[]): RecipeResult | undefined {
        const bar = params.find((i) => i.id === 'bar')
        if (bar === undefined) return

        const handle = params.find((i) => i.id === 'handle')
        if (handle === undefined) return

        const barItem = selectGameItem(bar.stdItemId, bar.stdItemId)(state)
        if (!barItem) return
        const handleItem = selectGameItem(handle.stdItemId, handle.stdItemId)(state)
        if (!handleItem) return

        if (!barItem.craftingPickaxeData) return
        if (!handleItem.craftingData) return

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
                time: barItem.craftingPickaxeData.time / (handleItem.craftingData.speedBonus ?? 1),
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
            results: [{ id: 'craftedAxe', qta: 1, craftedItem: craftedAxe }],
        }
    },
}
