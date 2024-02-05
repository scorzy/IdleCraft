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
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { DamageTypes, Item, ItemTypes } from '../../items/Item'
import { Msg } from '../../msg/Msg'
import { selectGameItem } from '../../storage/StorageSelectors'

const longSwordParams: RecipeParameter[] = [
    {
        id: 'bar',
        nameId: 'Bar',
        type: RecipeParamType.ItemType,
        itemType: ItemTypes.Bar,
    },
]

export class LongSwordRecipe implements Recipe {
    id = 'LongSwordRecipe'
    nameId = 'LongSword' as keyof Msg
    iconId = Icons.Sword
    type = RecipeTypes.Smithing
    getParameters = () => longSwordParams
    getResult(state: GameState, params: RecipeParameterValue[]): RecipeResult | undefined {
        const bar = params.find((i) => i.id === 'bar')
        if (bar === undefined) return
        const barItem = selectGameItem(bar.stdItemId, bar.stdItemId)(state)
        if (!barItem) return
        if (!barItem.craftingData) return

        const components = [barItem, barItem]

        const craftedSword: Item = {
            id: '',
            nameId: 'LongSword',
            icon: Icons.Sword,
            type: ItemTypes.OneHand,
            equipSlot: EquipSlotsEnum.MainHand,
            value: getItemValue(components, true),
            weaponData: {
                attackSpeed: BASE_SWORD_SPEED / (barItem.craftingData.speedBonus ?? 1),
                damage: BASE_SWORD_DAMAGE * (barItem.craftingData.slashingDamage ?? 1),
                damageType: DamageTypes.Slashing,
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
export const longSwordRecipe = new LongSwordRecipe()
