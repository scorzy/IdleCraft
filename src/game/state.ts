import { create } from 'zustand'
import { createUiSlice } from '../ui/UiSlice'
import { createActivitySlice } from '../activities/ActivitySlice'
import { GameState } from './GameState'

export const useStore = create<GameState>()((...a) => ({
    ...createUiSlice(...a),
    ...createActivitySlice(...a),
}))
