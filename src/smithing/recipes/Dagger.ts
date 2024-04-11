import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { BASE_SWORD_SPEED, BASE_SWORD_DAMAGE } from '../../const'
import { getCraftingTime, getItemValue } from '../../crafting/CraftingFunctions'
import { Recipe } from '../../crafting/Recipe'
import {
    RecipeTypes,
    RecipeParameter,
    RecipeParameterValue,
    RecipeResult,
    RecipeParamType,
} from '../../crafting/RecipeInterfaces'
import { ExpEnum } from '../../experience/expEnum'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { DamageTypes, Item, ItemSubType, ItemTypes } from '../../items/Item'
import { Msg } from '../../msg/Msg'
import { selectGameItem } from '../../storage/StorageSelectors'

const daggerParams: RecipeParameter[] = [
    {
        id: 'bar',
        nameId: 'Bar',
        type: RecipeParamType.ItemType,
        itemType: ItemTypes.Bar,
    },
]

export class DaggerRecipe implements Recipe {
    id = 'DaggerRecipe'
    nameId = 'Dagger' as keyof Msg
    iconId = Icons.Sword
    type = RecipeTypes.Smithing
    itemSubType = ItemSubType.Weapon
    getParameters = () => daggerParams
    getResult(state: GameState, params: RecipeParameterValue[]): RecipeResult | undefined {
        const bar = params.find((i) => i.id === 'bar')
        if (bar === undefined) return
        const barItem = selectGameItem(bar.stdItemId, bar.stdItemId)(state)
        if (!barItem) return
        if (!barItem.craftingData) return

        const components = [barItem]

        const craftedDagger: Item = {
            id: '',
            nameId: 'Dagger',
            icon: Icons.Dagger,
            type: ItemTypes.OneHand,
            equipSlot: EquipSlotsEnum.MainHand,
            value: getItemValue(components, true),
            weaponData: {
                expType: ExpEnum.OneHanded,
                attackSpeed: Math.floor((0.65 * BASE_SWORD_SPEED) / (barItem.craftingData.speedBonus ?? 1)),
                damage: {
                    [DamageTypes.Piercing]: Math.floor(
                        0.65 * BASE_SWORD_DAMAGE * (barItem.craftingData.damage?.Piercing ?? 1)
                    ),
                },
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
            ],
            results: {
                qta: 1,
                craftedItem: craftedDagger,
            },
        }
    }
}
export const daggerRecipe = new DaggerRecipe()
