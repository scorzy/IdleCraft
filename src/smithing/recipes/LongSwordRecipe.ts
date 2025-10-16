import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { BASE_SWORD_SPEED, BASE_SWORD_DAMAGE } from '../../const'
import { getCraftingTime, getItemValue } from '../../crafting/CraftingFunctions'
import { makeMemoizedRecipe } from '../../crafting/makeMemoizedRecipe'
import {
    RecipeTypes,
    RecipeParameterValue,
    RecipeParamType,
    RecipeParameterItemFilter,
} from '../../crafting/RecipeInterfaces'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { DamageTypes, Item, ItemSubType, ItemTypes } from '../../items/Item'
import { ItemsMaterials } from '../../items/materials/ItemsMaterials'
import { Msg } from '../../msg/Msg'
import { selectGameItem } from '../../storage/StorageSelectors'
import { ExpEnum } from '@/experience/ExpEnum'

const longSwordParams: RecipeParameterItemFilter[] = [
    {
        id: 'bar',
        nameId: 'Bar',
        type: RecipeParamType.ItemType,
        itemFilter: { itemType: ItemTypes.Bar },
    },
]

export const longSwordRecipe = makeMemoizedRecipe({
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

        const primaryMat = barItem.materials?.primary
        const materials: ItemsMaterials = {}
        if (primaryMat) materials.primary = primaryMat

        const craftedSword: Item = {
            id: '',
            nameId: 'LongSword',
            materials,
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
