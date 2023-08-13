import { useGameStore } from '../game/state'
import { onTimer } from './onTimer'

export const execTimer = (timerId: string) => useGameStore.setState((s) => onTimer(s, timerId))
