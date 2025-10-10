import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { getCraftingTime, getItemValue } from '../../crafting/CraftingFunctions'
import { makeMemoizedRecipe } from '../../crafting/makeMemoizedRecipe'
import {
    RecipeTypes,
    RecipeParameter,
    RecipeParameterValue,
    RecipeResult,
    RecipeParamType,
    RecipeParameterItemFilter,
} from '../../crafting/RecipeInterfaces'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { Item, ItemSubType, ItemTypes } from '../../items/Item'
import { ItemsMaterials } from '../../items/materials/ItemsMaterials'
import { selectGameItem } from '../../storage/StorageSelectors'

const pickaxeParam: RecipeParameterItemFilter[] = [
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

export const PickaxeRecipe = makeMemoizedRecipe({
    id: 'Pickaxe',
    type: RecipeTypes.Smithing,
    nameId: 'Pickaxe',
    iconId: Icons.Pickaxe,
    itemSubType: ItemSubType.Tool,
    getParameters: function (): RecipeParameter[] {
        return pickaxeParam
    },
    getResult: function (state: GameState, params: RecipeParameterValue[]): RecipeResult | undefined {
        const bar = params.find((i) => i.id === 'bar')
        if (bar === undefined) return

        const handle = params.find((i) => i.id === 'handle')
        if (handle === undefined) return

        const barItem = selectGameItem(bar.itemId)(state)
        if (!barItem) return
        const handleItem = selectGameItem(handle.itemId)(state)
        if (!handleItem) return

        if (!barItem.craftingPickaxeData) return
        if (!handleItem.craftingData) return

        const components = [barItem, handleItem]

        const primaryMat = barItem.materials?.primary
        const materials: ItemsMaterials = {}
        if (primaryMat) materials.primary = primaryMat
        const handleMat = handleItem.materials?.primary
        if (handleMat) materials.secondary = handleMat

        const craftedAxe: Item = {
            id: '',
            nameId: 'Pickaxe',
            materials,
            icon: Icons.Pickaxe,
            type: ItemTypes.Pickaxe,
            equipSlot: EquipSlotsEnum.Pickaxe,
            value: getItemValue(components, true),
            pickaxeData: {
                damage: barItem.craftingPickaxeData.damage,
                time: barItem.craftingPickaxeData.time / (handleItem.craftingData.speedBonus ?? 1),
                armourPen: barItem.craftingPickaxeData.armourPen,
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
