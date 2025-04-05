import { ActivityState, ActivityTypes } from '../activities/ActivityState'
import { RecipeParameterValue, RecipeResult } from './RecipeInterfaces'

export type Crafting = ActivityState & {
    activityId: string
    recipeId: string
    paramsValue: RecipeParameterValue[]
    result: RecipeResult
}
export function isCrafting(act: ActivityState | Crafting): act is Crafting {
    return act.type === ActivityTypes.Crafting
}
