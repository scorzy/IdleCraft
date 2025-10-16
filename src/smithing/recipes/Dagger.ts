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

const daggerParams: RecipeParameterItemFilter[] = [
    {
        id: 'bar',
        nameId: 'Bar',
        type: RecipeParamType.ItemType,
        itemFilter: { itemType: ItemTypes.Bar },
    },
]

export const daggerRecipe = makeMemoizedRecipe({
    id: 'DaggerRecipe',
    nameId: 'Dagger' as keyof Msg,
    iconId: Icons.Sword,
    type: RecipeTypes.Smithing,
    itemSubType: ItemSubType.Weapon,
    getParameters: () => daggerParams,
    getResult: (state: GameState, params: RecipeParameterValue[]) => {
        const bar = params.find((i) => i.id === 'bar')
        if (bar === undefined) return
        const barItem = selectGameItem(bar.itemId)(state)
        if (!barItem) return
        if (!barItem.craftingData) return

        const components = [barItem]

        const primaryMat = barItem.materials?.primary
        const materials: ItemsMaterials = {}
        if (primaryMat) materials.primary = primaryMat

        const craftedDagger: Item = {
            id: '',
            nameId: 'Dagger',
            materials,
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
                    itemId: bar.itemId,
                },
            ],
            results: [{ id: 'craftedDagger', qta: 1, craftedItem: craftedDagger }],
        }
    },
})
