import { GameState } from '../../game/GameState'
import { Item } from '../../items/Item'
import { selectItemName } from '../../items/selectors/selectItemName'
import { selectTranslations } from '../../msg/useTranslations'
import { selectGameItem } from '../../storage/StorageSelectors'
import { getCraftingActivity, getRecipeResult } from '../CraftingSelectors'

export function getCraftingTitle(state: GameState, id: string) {
    const data = getCraftingActivity(state, id)
    const t = selectTranslations(state)
    const result = getRecipeResult(state, data.recipeId, data.paramsValue)
    if (!result?.results) return t.t.CraftingUnknown

    let item: Item | undefined

    if (result.results[0]?.craftedItem) item = result.results[0]?.craftedItem
    else if (result.results[0]?.stdItemId) item = selectGameItem(result.results[0]?.stdItemId)(state)

    if (item) {
        const name = selectItemName(state, item)
        return t.fun.crafting(name)
    }
    return t.t.CraftingUnknown
}
