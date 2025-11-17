import { MAX_LOOT } from '../../const'
import { GameState } from '../../game/GameState'
import { getRandomNum } from '../../utils/getRandomNum'
import { getUniqueId } from '../../utils/getUniqueId'
import { Loot } from '../storageTypes'

export function addLoot(state: GameState, loot: Loot[]): void {
    const locLoot = state.locations[state.location].loot

    for (const l of loot) {
        if (locLoot.length >= MAX_LOOT) return
        if (l.probability && getRandomNum(0, 100) > l.probability) continue
        locLoot.unshift({ id: getUniqueId(), itemId: l.itemId, quantity: l.quantity })
    }
}
