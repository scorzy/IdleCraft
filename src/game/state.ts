import { create } from 'zustand'
import { GameState } from './GameState'
import { InitialGameState } from './InitialGameState'

export const useGameStore = create<GameState, []>(() => InitialGameState)
