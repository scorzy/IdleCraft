import { Recipe, RecipeParamType, RecipeParameter, RecipeResult } from '../crafting/Recipe'
import { GameState } from '../game/GameState'
import { StdItems } from '../items/stdItems'
import { WoodData } from './WoodData'

const LogToPlank = new Map<keyof typeof StdItems, keyof typeof StdItems>()
Object.values(WoodData).forEach((w) => LogToPlank.set(w.logId, w.plankId))

const plankParam: RecipeParameter[] = [
    {
        id: 'log',
        nameId: 'Log',
        type: RecipeParamType.ItemType,
    },
]
export const PlankRecipe: Recipe = {
    id: 'PlankRecipe',
    getParameters: function (_state: GameState): RecipeParameter[] {
        return plankParam
    },
    getResult: function (_state: GameState, params: RecipeParameter[]): RecipeResult | undefined {
        const log = params.find((i) => i.id === 'log')
        if (log === undefined) return
        if (log.stdItem === undefined) return

        return {
            time: 3e3,
            requirements: [
                {
                    qta: 1,
                    stdItem: log.stdItem,
                },
            ],
            results: {
                qta: 1,
                stdItem: LogToPlank.get(log.stdItem),
            },
        }
    },
}

export const WoodRecipes = { [PlankRecipe.id]: PlankRecipe } satisfies { [k: string]: Recipe }
