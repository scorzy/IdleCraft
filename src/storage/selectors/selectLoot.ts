import { GameState } from '../../game/GameState'

export const selectLoot = (state: GameState) => state.locations[state.location].loot
