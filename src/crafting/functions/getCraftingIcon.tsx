import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { StdItems } from '../../items/stdItems'
import { CraftingAdapter } from '../CraftingAdapter'

export function getCraftingIcon(state: GameState, id: string) {
    const data = CraftingAdapter.selectEx(state.crafting, id)
    if (data.result.results.stdItemId) {
        const stdItem = StdItems[data.result.results.stdItemId]
        if (!stdItem) throw new Error(`StdItem not found ${data.result.results.stdItemId}`)
        return stdItem.icon
    } else if (data.result.results.craftedItem) return data.result.results.craftedItem.icon
    else return Icons.Axe
}
