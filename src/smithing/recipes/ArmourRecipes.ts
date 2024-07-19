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
import { DamageData, DamageTypes, Item, ItemSubType, ItemTypes } from '../../items/Item'
import { Msg } from '../../msg/Msg'
import { selectGameItem } from '../../storage/StorageSelectors'

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
    itemSubType = ItemSubType.Armour
    getParameters = () => armourParams
    getResult(state: GameState, params: RecipeParameterValue[]): RecipeResult | undefined {
        const bar = params.find((i) => i.id === 'bar')
        if (bar === undefined) return
        const barItem = selectGameItem(bar.stdItemId, bar.stdItemId)(state)
        if (!barItem) return
        if (!barItem.craftingData) return

        const components = [barItem, barItem, barItem, barItem]

        const barArmourData = barItem.craftingData.armour
        if (!barArmourData) return

        const armourData: DamageData = {}
        Object.entries(barArmourData).forEach((kv) => {
            armourData[kv[0] as DamageTypes] = kv[1]
        })

        const craftedItem: Item = {
            id: '',
            nameId: 'Armour',
            icon: Icons.Breastplate,
            type: ItemTypes.Body,
            equipSlot: EquipSlotsEnum.Body,
            value: getItemValue(components, true),
            armourData,
        }

        return {
            time: getCraftingTime(components),
            requirements: [
                {
                    qta: 4,
                    stdItemId: bar.stdItemId,
                    craftedItemId: bar.stdItemId,
                },
            ],
            results: [{ id: 'craftedItem', qta: 1, craftedItem }],
        }
    }
}
export const armourRecipe = new ArmourRecipe()
