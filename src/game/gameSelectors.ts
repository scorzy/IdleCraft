import { UiTempStore } from '../ui/state/uiTempStore'
import { GameState } from './GameState'

export const selectGameId = (s: GameState) => s.gameId
export const selectLoading = (s: GameState) => s.loading
export const selectLoadingProgress = (s: UiTempStore) => s.loadingData?.percent ?? 0
export const selectLoadingStart = (s: UiTempStore) => s.loadingData?.start ?? 0
export const selectLoadingEnd = (s: UiTempStore) => s.loadingData?.end ?? 0
export const selectLoadingNow = (s: UiTempStore) => s.loadingData?.now ?? 0
