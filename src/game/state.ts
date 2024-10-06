import { create } from 'zustand'
import { myMemoizeLast } from '../utils/memoizeLast'
import { GameState } from './GameState'
import { InitialGameState } from './InitialGameState'

export const useGameStore = create<GameState>()(() => InitialGameState)

export const useGameStoreShallow = <U>(selector: (state: GameState) => U) => useGameStore(myMemoizeLast(selector))
