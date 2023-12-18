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
import { Item, ItemTypes } from '../../items/Item'
import { Msg } from '../../msg/Msg'
import { selectGameItem } from '../../storage/StorageSelectors'

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

class AxeRecipeInt implements Recipe {
    id = 'AxeRecipe'
    type = RecipeTypes.Smithing
    nameId = 'WoodAxe' as keyof Msg
    getParameters(): RecipeParameter[] {
        return woodAxeParam
    }
    getResult(_state: GameState, params: RecipeParameterValue[]): RecipeResult | undefined {
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
    }
}
export const AxeRecipe = new AxeRecipeInt()
