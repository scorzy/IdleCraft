import { makeMemoizedRecipe } from '../../crafting/makeMemoizedRecipe'
import {
    RecipeTypes,
    RecipeParameterValue,
    RecipeResult,
    RecipeParamType,
    RecipeParameterItemFilter,
} from '../../crafting/RecipeInterfaces'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { ItemSubType, ItemTypes } from '../../items/Item'
import { OreData } from '../../mining/OreData'

export const OreToBar = new Map<string, string>()
Object.values(OreData).forEach((w) => OreToBar.set(w.oreId, w.barId))

const barParam: RecipeParameterItemFilter[] = [
    {
        id: 'ore',
        nameId: 'Ore',
        type: RecipeParamType.ItemType,
        itemFilter: { itemType: ItemTypes.Ore },
    },
]

export const barRecipe = makeMemoizedRecipe({
    id: 'BarRecipe',
    type: RecipeTypes.Smithing,
    nameId: 'Bar',
    iconId: Icons.Bar,
    itemSubType: ItemSubType.Crafting,
    getParameters: () => barParam,
    getResult: function (_: GameState, params: RecipeParameterValue[]): RecipeResult | undefined {
        const ore = params.find((i) => i.id === 'ore')
        if (!ore) return
        if (!ore.itemId) return
        const res = OreToBar.get(ore.itemId)
        if (!res) throw new Error(`OreToBar not found ${ore.itemId}`)

        return {
            time: 3000,
            requirements: [
                {
                    qta: 1,
                    itemId: ore.itemId,
                },
            ],
            results: [{ id: res, qta: 1, stdItemId: res }],
        }
    },
})
