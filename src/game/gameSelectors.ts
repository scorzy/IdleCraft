import { GameState } from './GameState'

export const selectGameId = (s: GameState) => s.gameId
export const selectLoading = (s: GameState) => s.loading
export const selectLoadingProgress = (s: GameState) => s.loadingData?.percent ?? 0
export const selectLoadingStart = (s: GameState) => s.loadingData?.start ?? 0
export const selectLoadingEnd = (s: GameState) => s.loadingData?.end ?? 0
export const selectLoadingNow = (s: GameState) => s.loadingData?.now ?? 0
