import { RecipeParameter, RecipeResult } from './Recipe'
import { Recipes } from './Recipes'

export interface Crafting {
    activityId: string
    recipeId: keyof typeof Recipes
    params: RecipeParameter[]
    result: RecipeResult
}
