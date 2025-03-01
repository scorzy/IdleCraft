import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { BASE_SWORD_SPEED, BASE_SWORD_DAMAGE } from '../../const'
import { getCraftingTime, getItemValue } from '../../crafting/CraftingFunctions'
import { makeRecipe } from '../../crafting/makeRecipe'
import { RecipeTypes, RecipeParameter, RecipeParameterValue, RecipeParamType } from '../../crafting/RecipeInterfaces'
import { ExpEnum } from '../../experience/expEnum'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { DamageTypes, Item, ItemSubType, ItemTypes } from '../../items/Item'
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

export const longSwordRecipe = makeRecipe({
    id: 'LongSwordRecipe',
    nameId: 'LongSword' as keyof Msg,
    iconId: Icons.Sword,
    type: RecipeTypes.Smithing,
    itemSubType: ItemSubType.Weapon,
    getParameters: () => longSwordParams,
    getResult: (state: GameState, params: RecipeParameterValue[]) => {
        const bar = params.find((i) => i.id === 'bar')
        if (bar === undefined) return
        const barItem = selectGameItem(bar.itemId)(state)
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
                expType: ExpEnum.OneHanded,
                attackSpeed: BASE_SWORD_SPEED / (barItem.craftingData.speedBonus ?? 1),
                damage: {
                    [DamageTypes.Slashing]: Math.floor(
                        BASE_SWORD_DAMAGE * (barItem.craftingData.damage?.Slashing ?? 1)
                    ),
                },
            },
        }

        return {
            time: getCraftingTime(components),
            requirements: [
                {
                    qta: 2,
                    itemId: bar.itemId,
                },
            ],
            results: [{ id: 'craftedSword', qta: 1, craftedItem: craftedSword }],
        }
    },
})
