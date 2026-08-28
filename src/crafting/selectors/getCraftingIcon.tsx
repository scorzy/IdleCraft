import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { StdItems } from '../../items/stdItems'
import { getCraftingActivity, getRecipeResult } from '../CraftingSelectors'

export function getCraftingIcon(state: GameState, id: string) {
    const data = getCraftingActivity(state, id)
    const result = getRecipeResult(state, data.recipeId, data.paramsValue)
    if (result?.results[0]?.stdItemId) {
        const stdItem = StdItems[result.results[0].stdItemId]
        if (!stdItem) throw new Error(`StdItem not found ${result.results[0].stdItemId}`)
        return stdItem.icon
    } else if (result?.results[0]?.craftedItem) return result.results[0].craftedItem.icon
    else return Icons.Bar
}
