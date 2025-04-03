import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { BASE_SWORD_SPEED, BASE_SWORD_DAMAGE } from '../../const'
import { getCraftingTime, getItemValue } from '../../crafting/CraftingFunctions'
import { makeRecipe } from '../../crafting/makeRecipe'
import {
    RecipeTypes,
    RecipeParameterValue,
    RecipeResult,
    RecipeParamType,
    RecipeParameter,
} from '../../crafting/RecipeInterfaces'
import { ExpEnum } from '../../experience/expEnum'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { DamageTypes, Item, ItemSubType, ItemTypes } from '../../items/Item'
import { Msg } from '../../msg/Msg'
import { selectGameItem } from '../../storage/StorageSelectors'

const twoHSwordParams: RecipeParameter[] = [
    {
        id: 'bar',
        nameId: 'Bar',
        type: RecipeParamType.ItemType,
        itemType: ItemTypes.Bar,
    },
]

export const twoHSwordRecipe = makeRecipe({
    id: 'TwoHSwordRecipe',
    nameId: 'TwoHSword' as keyof Msg,
    iconId: Icons.Sword,
    type: RecipeTypes.Smithing,
    itemSubType: ItemSubType.Weapon,
    getParameters: () => twoHSwordParams,
    getResult(state: GameState, params: RecipeParameterValue[]): RecipeResult | undefined {
        const bar = params.find((i) => i.id === 'bar')
        if (bar === undefined) return
        const barItem = selectGameItem(bar.itemId)(state)
        if (!barItem) return
        if (!barItem.craftingData) return

        const components = [barItem, barItem, barItem, barItem]

        const crafted2HSword: Item = {
            id: '',
            nameId: 'TwoHSword',
            icon: Icons.Broadsword,
            type: ItemTypes.TwoHands,
            equipSlot: EquipSlotsEnum.TwoHand,
            value: getItemValue(components, true),
            weaponData: {
                expType: ExpEnum.OneHanded,
                attackSpeed: Math.floor((1.4 * BASE_SWORD_SPEED) / (barItem.craftingData.speedBonus ?? 1)),
                damage: {
                    [DamageTypes.Slashing]: Math.floor(
                        1.4 * BASE_SWORD_DAMAGE * (barItem.craftingData.damage?.Slashing ?? 1)
                    ),
                },
            },
        }

        return {
            time: getCraftingTime(components),
            requirements: [
                {
                    qta: 4,
                    itemId: bar.itemId,
                },
            ],
            results: [{ id: 'crafted2HSword', qta: 1, craftedItem: crafted2HSword }],
        }
    },
})
