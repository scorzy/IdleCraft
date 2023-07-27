import { create } from 'zustand'
import { GameState } from './GameState'
import { InitialGameState } from './InitialGameState'
import { devtools } from 'zustand/middleware'

export const useGameStore = create<GameState, [['zustand/devtools', never]]>(devtools(() => InitialGameState))
