import { ActivityTypes } from '../../activities/ActivityState'
import { makeAddActivity } from '../../activities/functions/makeAddActivity'
import { GameState } from '../../game/GameState'
import { setState } from '../../game/state'
import { RecipeParameterValue, RecipeResult } from '../RecipeInterfaces'

interface CraftingData {
    recipeId: string
    paramsValue: RecipeParameterValue[]
    result: RecipeResult
}

const makeCrafting = (data: CraftingData) => makeAddActivity(ActivityTypes.Crafting, data)

const addCrafting = (state: GameState) => {
    if (!state.craftingForm.result) return state

    const data: CraftingData = {
        recipeId: state.recipeId,
        paramsValue: state.craftingForm.paramsValue,
        result: state.craftingForm.result,
    }

    makeCrafting(data)(state)
}

export const addCraftingClick = () => setState(addCrafting)
