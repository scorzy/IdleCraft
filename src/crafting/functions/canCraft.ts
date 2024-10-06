import { GameState } from '../../game/GameState'
import { selectItemQta } from '../../storage/StorageSelectors'
import { RecipeResult } from '../RecipeInterfaces'

export function isCraftable(state: GameState, craftResult?: RecipeResult): boolean {
    if (!craftResult) return false
    for (const r of craftResult.requirements) if (selectItemQta(state.location, r.itemId)(state) < r.qta) return false
    return true
}
