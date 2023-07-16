import { StateCreator } from 'zustand'
import { UiState } from './uiState'

export const createUiSlice: StateCreator<UiState, [], [], UiState> = (set) => ({
    open: false,
    toggle: () => set((state) => ({ open: !state.open })),
    dark: true,
    toggleTheme: () => set((state) => ({ dark: !state.dark })),
})
