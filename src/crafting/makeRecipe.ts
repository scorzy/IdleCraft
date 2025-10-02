import { myMemoizeOne } from '../utils/myMemoizeOne'
import { Recipe, RecipeData } from './Recipe'

export const makeRecipe: (recipe: RecipeData) => Recipe = (recipe: RecipeData) => {
    return { ...recipe, getResult: myMemoizeOne(recipe.getResult), getParameters: myMemoizeOne(recipe.getParameters) }
}
