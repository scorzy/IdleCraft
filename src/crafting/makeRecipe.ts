import { lruMemoize } from 'reselect'
import { deepEqual } from 'fast-equals'
import { Recipe, RecipeData } from './Recipe'

export const makeRecipe: (recipe: RecipeData) => Recipe = (recipe: RecipeData) => {
    const getResultMemo = lruMemoize(recipe.getResult, {
        maxSize: 5,
        resultEqualityCheck: deepEqual,
    })

    return {
        ...recipe,
        getResult: getResultMemo,
    }
}
