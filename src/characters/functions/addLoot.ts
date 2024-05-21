import { GameState } from '../../game/GameState'
import { LootAdapter } from '../../storage/ItemAdapter'
import { CharacterAdapter } from '../characterAdapter'

export function addLoot(state: GameState, charId: string) {
    const lootArr = CharacterAdapter.selectEx(state.characters, charId).loot
    if (!lootArr) return state
    let locLoot = state.locations[state.location].loot

    for (const loot of lootArr) {
        locLoot = LootAdapter.create(locLoot, loot)
    }

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
