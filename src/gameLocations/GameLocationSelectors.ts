import { ActivityTypes } from '../activities/ActivityState'
import { GameState } from '../game/GameState'
import { TimerAdapter } from '../timers/Timer'
import { GameLocationAdapter } from './GameLocationAdapter'

export const selectGameLocationIds = (state: GameState) => GameLocationAdapter.getIds(state.locations)

export const selectTravelTimer = (state: GameState) =>
    TimerAdapter.find(state.timers, (timer) => timer.type === ActivityTypes.Travel)
