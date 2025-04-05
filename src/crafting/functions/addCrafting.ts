import { ActivityTypes } from '../../activities/ActivityState'
import { makeAddActivity } from '../../activities/functions/makeAddActivity'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { RecipeParameterValue, RecipeResult } from '../RecipeInterfaces'

type CraftingData = {
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

    return makeCrafting(data)(state)
}

export const addCraftingClick = () => useGameStore.setState(addCrafting)
