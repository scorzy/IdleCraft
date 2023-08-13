import { RecipeParameterValue, RecipeResult } from './RecipeInterfaces'

export interface Crafting {
    activityId: string
    recipeId: string
    paramsValue: RecipeParameterValue[]
    result: RecipeResult
}
