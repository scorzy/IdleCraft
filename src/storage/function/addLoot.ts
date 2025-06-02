import { MAX_LOOT } from '../../const'
import { GameState } from '../../game/GameState'
import { getUniqueId } from '../../utils/getUniqueId'
import { Loot } from '../storageTypes'

export function addLoot(state: GameState, loot: Loot[]) {
    let locLoot = state.locations[state.location].loot

    for (const l of loot) locLoot = [{ id: getUniqueId(), ...l }, ...locLoot]

    if (locLoot.length > MAX_LOOT) locLoot = locLoot.filter((_l, i) => i < MAX_LOOT)

    state = {
        ...state,
        locations: {
            ...state.locations,
            [state.location]: {
                ...state.locations[state.location],
                loot: locLoot,
            },
        },
    }

    return state
}
