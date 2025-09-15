import { create } from 'mutative'
import { GameState } from './GameState'
import { useGameStore } from './state'

export const setState = (fn: (state: GameState) => void) => useGameStore.setState((s) => create(s, fn))
