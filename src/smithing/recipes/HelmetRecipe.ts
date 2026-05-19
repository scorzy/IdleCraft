import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { getCraftingTime, getItemValue } from '../../crafting/CraftingFunctions'
import { makeMemoizedRecipe } from '../../crafting/makeMemoizedRecipe'
import {
    RecipeParameterItemFilter,
    RecipeParameterValue,
    RecipeParamType,
    RecipeGroups,
    RecipeResult,
    RecipeTypes,
} from '../../crafting/RecipeInterfaces'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { DamageData, DamageTypes, Item, ItemTypes } from '../../items/Item'
import { ItemsMaterials } from '../../items/materials/ItemsMaterials'
import { selectGameItem } from '../../storage/StorageSelectors'

const helmetParams: RecipeParameterItemFilter[] = [
    {
        id: 'bar',
        nameId: 'Bar',
        type: RecipeParamType.ItemType,
        itemFilter: { itemType: ItemTypes.Bar },
    },
]

export const helmetRecipe = makeMemoizedRecipe({
    id: 'HelmetRecipe',
    nameId: 'Helmet',
    iconId: Icons.Helmet,
    type: RecipeTypes.Smithing,
    recipeGroup: RecipeGroups.Armours,
    getParameters: () => helmetParams,
    getResult(state: GameState, params: RecipeParameterValue[]): RecipeResult | undefined {
        const bar = params.find((i) => i.id === 'bar')
        if (!bar) return
        const barItem = selectGameItem(bar.itemId)(state)
        if (!barItem) return
        if (!barItem.craftingData) return

        const components = [barItem, barItem]

        const barArmourData = barItem.craftingData.armour
        if (!barArmourData) return

        const armourData: DamageData = {}
        Object.entries(barArmourData).forEach((kv) => (armourData[kv[0] as DamageTypes] = 5 * kv[1]))

        const primaryMat = barItem.materials?.primary
        const materials: ItemsMaterials = {}
        if (primaryMat) materials.primary = primaryMat

        const craftedItem: Item = {
            id: '',
            nameId: 'Helmet',
            materials,
            icon: Icons.Helmet,
            type: ItemTypes.Head,
            equipSlot: EquipSlotsEnum.Head,
            value: getItemValue(components, true),
            armourData,
        }

        return {
            time: getCraftingTime(components),
            requirements: [
                {
                    qta: 2,
                    itemId: bar.itemId,
                },
            ],
            results: [{ id: 'craftedItem', qta: 1, craftedItem }],
        }
    },
})
