import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { StdItems } from '../../items/stdItems'
import { getCraftingActivity } from '../CraftingSelectors'

export function getCraftingIcon(state: GameState, id: string) {
    const data = getCraftingActivity(state, id)
    if (data.result.results[0]?.stdItemId) {
        const stdItem = StdItems[data.result.results[0].stdItemId]
        if (!stdItem) throw new Error(`StdItem not found ${data.result.results[0].stdItemId}`)
        return stdItem.icon
    } else if (data.result.results[0]?.craftedItem) return data.result.results[0].craftedItem.icon
    else return Icons.Bar
}
