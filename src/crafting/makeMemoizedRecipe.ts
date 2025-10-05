import { myMemoizeOne } from '../utils/myMemoizeOne'
import { Recipe } from './Recipe'

export const makeMemoizedRecipe: (recipe: Recipe) => Recipe = (recipe: Recipe) => {
    return { ...recipe, getResult: myMemoizeOne(recipe.getResult), getParameters: myMemoizeOne(recipe.getParameters) }
}
