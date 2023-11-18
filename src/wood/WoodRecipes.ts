import {
    RecipeParamType,
    RecipeParameter,
    RecipeParameterValue,
    RecipeResult,
    RecipeTypes,
} from '../crafting/RecipeInterfaces'
import { Recipe } from '@/crafting/Recipe'
import { GameState } from '../game/GameState'
import { ItemTypes } from '../items/Item'
import { WoodData } from './WoodData'

const LogToPlank = new Map<string, string>()
Object.values(WoodData).forEach((w) => LogToPlank.set(w.logId, w.plankId))

const PlankToHandle = new Map<string, string>()
Object.values(WoodData).forEach((w) => PlankToHandle.set(w.plankId, w.handleId))

const plankParam: RecipeParameter[] = [
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
    getParameters: function (_state: GameState): RecipeParameter[] {
        return plankParam
    },
    getResult: function (_state: GameState, params: RecipeParameterValue[]): RecipeResult | undefined {
        const log = params.find((i) => i.id === 'log')
        if (log === undefined) return
        if (!log.stdItemId) return

        return {
            time: 3e3,
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

const handleParam: RecipeParameter[] = [
    {
        id: 'plank',
        nameId: 'Plank',
        type: RecipeParamType.ItemType,
        itemType: ItemTypes.Plank,
    },
]
export const HandleRecipe: Recipe = {
    id: 'handleRecipe',
    type: RecipeTypes.Woodworking,
    nameId: 'Handle',
    getParameters: function (_state: GameState): RecipeParameter[] {
        return handleParam
    },
    getResult: function (_state: GameState, params: RecipeParameterValue[]): RecipeResult | undefined {
        const plank = params.find((i) => i.id === 'plank')
        if (plank === undefined) return
        if (!plank.stdItemId) return

        return {
            time: 3e3,
            requirements: [
                {
                    qta: 1,
                    stdItemId: plank.stdItemId,
                },
            ],
            results: {
                qta: 1,
                stdItemId: PlankToHandle.get(plank.stdItemId),
            },
        }
    },
}

export const WoodRecipes = { [PlankRecipe.id]: PlankRecipe, [HandleRecipe.id]: HandleRecipe } satisfies {
    [k in string]?: Recipe
}
