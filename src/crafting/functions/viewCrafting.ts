import { ActivityState } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { UiPages } from '../../ui/state/UiPages'
import { UiPagesData } from '../../ui/state/UiPagesData'
import { isCrafting } from '../CraftingIterfaces'
import { recipes } from '../Recipes'

export const viewCrafting = (state: GameState, activity: ActivityState) => {
    if (!isCrafting(activity)) return

    const recipe = recipes.getEx(activity.recipeId)
    state.ui.recipeType = recipe.type
    state.recipeId = recipe.id
    state.craftingForm.paramsValue = structuredClone(activity.paramsValue)
    state.craftingForm.result = structuredClone(activity.result)

    const page = Object.entries(UiPagesData).find((kv) => kv[1].recipeType && kv[1].recipeType === recipe.type)?.[0]
    if (page) state.ui.page = page as UiPages
}
