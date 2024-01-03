import { GameState } from '../game/GameState'
import { Timer, TimerTypes } from './Timer'

export const onTimerFunctions: Map<TimerTypes, (state: GameState, timer: Timer) => GameState> = new Map()
