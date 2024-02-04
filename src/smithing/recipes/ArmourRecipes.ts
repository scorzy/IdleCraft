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

const BASE_ARMOUR = 100

const armourParams: RecipeParameter[] = [
    {
        id: 'bar',
        nameId: 'Bar',
        type: RecipeParamType.ItemType,
        itemType: ItemTypes.Bar,
    },
]

export class ArmourRecipe implements Recipe {
    id = 'ArmourRecipe'
    nameId = 'Armour' as keyof Msg
    iconId = Icons.Breastplate
    type = RecipeTypes.Smithing
    getParameters = () => armourParams
    getResult(state: GameState, params: RecipeParameterValue[]): RecipeResult | undefined {
        const bar = params.find((i) => i.id === 'bar')
        if (bar === undefined) return
        const barItem = selectGameItem(bar.stdItemId, bar.stdItemId)(state)
        if (!barItem) return
        if (!barItem.craftingData) return

        const components = [barItem, barItem, barItem, barItem]

        const armourData = barItem.craftingData.armour
        if (!armourData) return

        const craftedSword: Item = {
            id: '',
            nameId: 'Armour',
            icon: Icons.Breastplate,
            type: ItemTypes.Body,
            equipSlot: EquipSlotsEnum.MainHand,
            value: getItemValue(components, true),
            armourData: {
                Bludgeoning: BASE_ARMOUR * armourData.Bludgeoning,
                Piercing: BASE_ARMOUR * armourData.Piercing,
                Slashing: BASE_ARMOUR * armourData.Slashing,
            },
        }

        return {
            time: getCraftingTime(components),
            requirements: [
                {
                    qta: 2,
                    stdItemId: bar.stdItemId,
                    craftedItemId: bar.stdItemId,
                },
            ],
            results: {
                qta: 1,
                craftedItem: craftedSword,
            },
        }
    }
}
export const armourRecipe = new ArmourRecipe()
