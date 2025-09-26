import { MAX_LOOT } from '../../const'
import { GameState } from '../../game/GameState'
import { getUniqueId } from '../../utils/getUniqueId'
import { Loot } from '../storageTypes'

export function addLoot(state: GameState, loot: Loot[]): void {
    const locLoot = state.locations[state.location].loot

    for (const l of loot) {
        if (locLoot.length >= MAX_LOOT) return
        locLoot.unshift({ id: getUniqueId(), ...l })
    }
}
