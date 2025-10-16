import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
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
import { Item, ItemSubType, ItemTypes } from '../../items/Item'
import { ItemsMaterials } from '../../items/materials/ItemsMaterials'
import { Msg } from '../../msg/Msg'
import { selectGameItem } from '../../storage/StorageSelectors'

const woodAxeParam: RecipeParameterItemFilter[] = [
    {
        id: 'bar',
        nameId: 'Bar',
        type: RecipeParamType.ItemType,
        itemFilter: { itemType: ItemTypes.Bar },
    },
    {
        id: 'handle',
        nameId: 'Handle',
        type: RecipeParamType.ItemType,
        itemFilter: { itemType: ItemTypes.Handle },
    },
]

export const axeRecipe = makeMemoizedRecipe({
    id: 'AxeRecipe',
    type: RecipeTypes.Smithing,
    iconId: Icons.Axe,
    nameId: 'WoodAxe' as keyof Msg,
    itemSubType: ItemSubType.Tool,
    getParameters: () => woodAxeParam,
    getResult: (state: GameState, params: RecipeParameterValue[]) => {
        const bar = params.find((i) => i.id === 'bar')
        if (bar === undefined) return

        const handle = params.find((i) => i.id === 'handle')
        if (handle === undefined) return

        const barItem = selectGameItem(bar.itemId)(state)
        if (!barItem) return
        const handleItem = selectGameItem(handle.itemId)(state)
        if (!handleItem) return

        if (!barItem.craftingWoodAxeData) return
        if (!handleItem.craftingData) return

        const components = [barItem, handleItem]

        const primaryMat = barItem.materials?.primary
        const materials: ItemsMaterials = {}
        if (primaryMat) materials.primary = primaryMat
        const handleMat = handleItem.materials?.primary
        if (handleMat) materials.secondary = handleMat

        const craftedAxe: Item = {
            id: '',
            nameId: 'WoodAxe',
            materials,
            icon: Icons.Axe,
            type: ItemTypes.WoodAxe,
            equipSlot: EquipSlotsEnum.WoodAxe,
            value: getItemValue(components, true),
            woodAxeData: {
                damage: barItem.craftingWoodAxeData.damage,
                time: barItem.craftingWoodAxeData.time / (handleItem.craftingData.speedBonus ?? 1),
            },
        }

        return {
            time: getCraftingTime(components),
            requirements: [
                {
                    qta: 1,
                    itemId: bar.itemId,
                },
                {
                    qta: 1,
                    itemId: handle.itemId,
                },
            ],
            results: [{ id: 'craftedAxe', qta: 1, craftedItem: craftedAxe }],
        }
    },
})
