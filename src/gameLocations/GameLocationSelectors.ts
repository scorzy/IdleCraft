import { GameState } from '../game/GameState'
import { GameLocationAdapter } from './GameLocationAdapter'

export const selectGameLocationIds = (state: GameState) => GameLocationAdapter.getIds(state.locations)
