import { GameState } from '../../game/GameState'
import { Item } from '../../items/Item'
import { selectItemName } from '../../items/selectItemName'
import { selectTranslations } from '../../msg/useTranslations'
import { selectGameItem } from '../../storage/StorageSelectors'
import { getCraftingActivity } from '../CraftingSelectors'

export function getCraftingTitle(state: GameState, id: string) {
    const data = getCraftingActivity(state, id)
    const t = selectTranslations(state)
    if (!data.result.results) return t.t.CraftingUnknown

    let item: Item | undefined

    if (data.result.results[0]?.craftedItem) item = data.result.results[0]?.craftedItem
    else if (data.result.results[0]?.stdItemId) item = selectGameItem(data.result.results[0]?.stdItemId)(state)

    if (item) {
        const name = selectItemName(state, item)
        return t.fun.crafting(name)
    }
    return t.t.CraftingUnknown
}
