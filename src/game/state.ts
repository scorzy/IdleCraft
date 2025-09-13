import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { produce } from 'immer'
import { GameState } from './GameState'
import { InitialGameState } from './InitialGameState'

export const useGameStore = create<GameState>()(devtools(() => InitialGameState))

export const setState = (fn: (state: GameState) => void) => useGameStore.setState(produce((draft) => fn(draft)))
