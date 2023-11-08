import { GameState } from '../game/GameState'
import { ExpEnum } from './expEnum'
import { getLevel, getLevelExp } from './expFunctions'

export const selectLevel = (expType: ExpEnum) => (state: GameState) => getLevel(state, expType)
export const selectExp = (expType: ExpEnum) => (state: GameState) => state.exp[expType].exp
export const selectLevelExp = (expType: ExpEnum) => (state: GameState) => {
    const level = state.exp[expType]?.level ?? 0
    return getLevelExp(level)
}
export const selectNextExp = (expType: ExpEnum) => (state: GameState) => {
    const level = state.exp[expType]?.level ?? 0
    return getLevelExp(level + 1)
}
