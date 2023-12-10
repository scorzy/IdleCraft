import { PLAYER_ID } from '../characters/charactersConst'
import { GameState } from '../game/GameState'
import { ExpEnum } from './expEnum'
import { getLevel, getLevelExp } from './expFunctions'

export const selectLevel = (expType: ExpEnum) => (state: GameState) => getLevel(state, expType)
export const selectExp = (expType: ExpEnum) => (state: GameState) =>
    state.characters[PLAYER_ID]?.skillsExp[expType] ?? 0

export const selectLevelExp = (expType: ExpEnum) => (state: GameState) => {
    const level = state.characters[PLAYER_ID]?.skillsLevel[expType] ?? 0
    return getLevelExp(level)
}
export const selectNextExp = (expType: ExpEnum) => (state: GameState) => {
    const level = state.characters[PLAYER_ID]?.skillsLevel[expType] ?? 0
    return getLevelExp(level + 1)
}
export const selectPlayerExp = (state: GameState) => {
    const player = state.characters[PLAYER_ID]
    if (!player) throw new Error('Player not found')
    return player.skillsExp
}
export const selectPlayerLevel = (state: GameState) => {
    const player = state.characters[PLAYER_ID]
    if (!player) throw new Error('Player not found')
    return player.level
}
