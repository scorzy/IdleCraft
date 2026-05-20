import { GameState } from '../../game/GameState'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'

export const selectLoot = (state: GameState) => GameLocationAdapter.selectEx(state.locations, state.location).loot
