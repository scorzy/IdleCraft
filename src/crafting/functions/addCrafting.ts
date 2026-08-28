import { ActivityTypes } from '../../activities/ActivityState'
import { makeAddActivity } from '../../activities/functions/makeAddActivity'
import { GameState } from '../../game/GameState'
import { setState } from '../../game/setState'
import { RecipeParameterValue } from '../RecipeInterfaces'
import { getRecipeResult } from '../CraftingSelectors'

interface CraftingData {
    recipeId: string
    paramsValue: RecipeParameterValue[]
    autoBuy: Record<string, boolean>
}

const makeCrafting = (data: CraftingData) => makeAddActivity(ActivityTypes.Crafting, data)

const addCrafting = (state: GameState) => {
    if (!getRecipeResult(state, state.recipeId, state.craftingForm.paramsValue)) return state

    const data: CraftingData = {
        recipeId: state.recipeId,
        paramsValue: state.craftingForm.paramsValue.map((param) => ({ ...param })),
        autoBuy: { ...state.craftingForm.autoBuy },
    }

    makeCrafting(data)(state)
}

export const addCraftingClick = () => setState(addCrafting)
