import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { GameState } from './GameState'
import { InitialGameState } from './InitialGameState'

export const useGameStore = create<GameState>()(devtools(() => InitialGameState))
