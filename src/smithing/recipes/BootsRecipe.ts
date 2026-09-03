import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { BASE_ARMOUR, FEET_ARMOUR_RATIO } from '../../const'
import { getCraftingTime, getItemValue, getItemVolume } from '../../crafting/CraftingFunctions'
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
import { DamageData, DamageTypes, Item, ItemType, ArmourType, EquipmentSlot, CraftingType } from '../../items/Item'
import { ItemsMaterials } from '../../items/materials/ItemsMaterials'
import { selectGameItem } from '../../storage/StorageSelectors'

const bootsParams: RecipeParameterItemFilter[] = [
    {
        id: 'bar',
        nameId: 'Bar',
        type: RecipeParamType.ItemType,
        itemFilter: { itemType: ItemType.Crafting, craftingTypes: [CraftingType.Bar] },
    },
]

export const bootsRecipe = makeMemoizedRecipe({
    id: 'BootsRecipe',
    nameId: 'Boots',
    iconId: Icons.Boots,
    type: RecipeTypes.Smithing,
    recipeGroup: RecipeGroups.Armours,
    getParameters: () => bootsParams,
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
        Object.entries(barArmourData).forEach(
            (kv) => (armourData[kv[0] as DamageTypes] = Math.floor(BASE_ARMOUR * FEET_ARMOUR_RATIO * kv[1]))
        )

        const primaryMat = barItem.materials?.primary
        const materials: ItemsMaterials = {}
        if (primaryMat) materials.primary = primaryMat

        const craftedItem: Item = {
            id: '',
            nameId: 'Boots',
            materials,
            icon: Icons.Boots,
            type: ItemType.Armour,
            equipmentSlot: EquipmentSlot.Feet,
            armourType: ArmourType.Heavy,
            equipSlot: EquipSlotsEnum.Feet,
            value: getItemValue(components, true),
            volume: getItemVolume(components),
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
