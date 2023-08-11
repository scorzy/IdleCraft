import { GameState } from '../game/GameState'
import { RecipeParameter } from './Recipe'

const EMPTY_ARR: RecipeParameter[] = []
export const selectRecipeParams = (state: GameState) => state.craftingForm?.params ?? EMPTY_ARR
export const selectRecipeItemValue = (recipeParamId: string) => (state: GameState) =>
    state.craftingForm.paramsValue.find((p) => p.id === recipeParamId)

export const selectRecipeResult = (state: GameState) => state.craftingForm.result?.results
export const selectRecipeReq = (state: GameState) => state.craftingForm.result?.requirements
