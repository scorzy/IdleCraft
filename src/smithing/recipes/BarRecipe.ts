import { Recipe } from '../../crafting/Recipe'
import {
    RecipeTypes,
    RecipeParameter,
    RecipeParameterValue,
    RecipeResult,
    RecipeParamType,
} from '../../crafting/RecipeInterfaces'
import { GameState } from '../../game/GameState'
import { ItemTypes } from '../../items/Item'
import { OreData } from '../../mining/OreData'

export const OreToBar = new Map<string, string>()
Object.values(OreData).forEach((w) => OreToBar.set(w.oreId, w.barId))

const barParam: RecipeParameter[] = [
    {
        id: 'ore',
        nameId: 'Ore',
        type: RecipeParamType.ItemType,
        itemType: ItemTypes.Ore,
    },
]

export const BarRecipe: Recipe = {
    id: 'BarRecipe',
    type: RecipeTypes.Smithing,
    nameId: 'Bar',
    getParameters: function (): RecipeParameter[] {
        return barParam
    },
    getResult: function (_: GameState, params: RecipeParameterValue[]): RecipeResult | undefined {
        const ore = params.find((i) => i.id === 'ore')
        if (ore === undefined) return
        if (!ore.stdItemId) return
        const res = OreToBar.get(ore.stdItemId)

        return {
            time: 3000,
            requirements: [
                {
                    qta: 1,
                    stdItemId: ore.stdItemId,
                },
            ],
            results: {
                qta: 1,
                stdItemId: res,
            },
        }
    },
}
