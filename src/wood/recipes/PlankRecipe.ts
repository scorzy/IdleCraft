import {
    RecipeParamType,
    RecipeParameter,
    RecipeParameterValue,
    RecipeResult,
    RecipeTypes,
} from '../../crafting/RecipeInterfaces'
import { GameState } from '../../game/GameState'
import { ItemTypes } from '../../items/Item'
import { WoodData } from '../WoodData'
import { Recipe } from '@/crafting/Recipe'

export const LogToPlank = new Map<string, string>()
Object.values(WoodData).forEach((w) => LogToPlank.set(w.logId, w.plankId))

export const plankParam: RecipeParameter[] = [
    {
        id: 'log',
        nameId: 'Log',
        type: RecipeParamType.ItemType,
        itemType: ItemTypes.Log,
    },
]

export const PlankRecipe: Recipe = {
    id: 'PlankRecipe',
    type: RecipeTypes.Woodworking,
    nameId: 'Plank',
    getParameters: function (): RecipeParameter[] {
        return plankParam
    },
    getResult: function (_: GameState, params: RecipeParameterValue[]): RecipeResult | undefined {
        const log = params.find((i) => i.id === 'log')
        if (log === undefined) return
        if (!log.stdItemId) return

        return {
            time: 3000,
            requirements: [
                {
                    qta: 1,
                    stdItemId: log.stdItemId,
                },
            ],
            results: {
                qta: 1,
                stdItemId: LogToPlank.get(log.stdItemId),
            },
        }
    },
}
