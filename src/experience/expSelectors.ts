import { GameState } from '../game/GameState'
import { ExpAdapter } from './ExpAdapter'
import { ExpEnum } from './expEnum'
import { getLevel, getLevelExp } from './expFunctions'

export const selectLevel = (expType: ExpEnum) => (state: GameState) => getLevel(state, expType)
export const selectExp = (expType: ExpEnum) => (state: GameState) => ExpAdapter.select(state.exp, expType)?.exp ?? 0
export const selectLevelExp = (expType: ExpEnum) => (state: GameState) => {
    const level = ExpAdapter.select(state.exp, expType)?.level ?? 0
    return getLevelExp(level)
}
export const selectNextExp = (expType: ExpEnum) => (state: GameState) => {
    const level = ExpAdapter.select(state.exp, expType)?.level ?? 0
    return getLevelExp(level + 1)
}
