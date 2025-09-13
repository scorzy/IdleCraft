import { GameState } from '../../game/GameState'

export const onKillListeners: ((state: GameState, targetId: string) => void)[] = []
