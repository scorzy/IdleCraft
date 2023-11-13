import { GameState } from '../game/GameState'
import { ExpEnum } from './expEnum'
import { getLevel, getLevelExp } from './expFunctions'

export const selectLevel = (expType: ExpEnum) => (state: GameState) => getLevel(state, expType)
export const selectExp = (expType: ExpEnum) => (state: GameState) => state.skillsExp[expType] ?? 0
export const selectLevelExp = (expType: ExpEnum) => (state: GameState) => {
    const level = state.skillsLevel[expType] ?? 0
    return getLevelExp(level)
}
export const selectNextExp = (expType: ExpEnum) => (state: GameState) => {
    const level = state.skillsLevel[expType] ?? 0
    return getLevelExp(level + 1)
}
