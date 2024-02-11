import { useGameStore } from '../../game/state'

export const closeDeadDialog = () => useGameStore.setState((s) => ({ ...s, ui: { ...s.ui, deadDialog: false } }))
