import { GameState } from '../game/GameState'
import { ExpEnum } from './ExpEnum'

export const onPlayerSkillUpListeners: ((
    state: GameState,
    skill: ExpEnum,
    prevLevel: number,
    newLevel: number
) => void)[] = []

export const onPlayerLevelUpListeners: ((state: GameState, prevLevel: number, newLevel: number) => void)[] = []
