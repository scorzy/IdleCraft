import { GameState } from '../../game/GameState'
import { StdItems } from '../../items/stdItems'
import { selectTranslations } from '../../msg/useTranslations'
import { CraftingAdapter } from '../CraftingAdapter'

export function getCraftingTitle(state: GameState, id: string) {
    const data = CraftingAdapter.selectEx(state.crafting, id)
    const t = selectTranslations(state)
    if (!data.result.results) return t.t.CraftingUnknown
    if (data.result.results[0]?.stdItemId) {
        const stdItem = StdItems[data.result.results[0].stdItemId]
        if (!stdItem) throw new Error(`StdItem not found ${data.result.results[0].stdItemId}`)
        return t.fun.crafting(stdItem.nameId)
    } else if (data.result.results[0]?.craftedItem) return t.fun.crafting(data.result.results[0].craftedItem.nameId)
    else return t.t.CraftingUnknown
}
