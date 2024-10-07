import { CharacterAdapter } from '../characters/characterAdapter'
import { GameState } from '../game/GameState'
import { EXP_BASE_PRICE, EXP_BASE_PRICE_MAIN, EXP_GROW_RATE, EXP_GROW_RATE_MAIN } from './expConst'
import { ExpEnum } from './expEnum'

export const getLevel = (state: GameState, expType: ExpEnum, charId: string) =>
    CharacterAdapter.selectEx(state.characters, charId).skillsLevel[expType] ?? 0

export const getLevelExp = (level: number) =>
    Math.floor(EXP_BASE_PRICE * (EXP_GROW_RATE ** level - 1)) / (EXP_GROW_RATE - 1)

export const selectLevel = (expType: ExpEnum, charId: string) => (state: GameState) => getLevel(state, expType, charId)
export const selectExp = (expType: ExpEnum, charId: string) => (state: GameState) =>
    CharacterAdapter.selectEx(state.characters, charId).skillsExp[expType] ?? 0

export const selectLevelExp = (expType: ExpEnum, charId: string) => (state: GameState) => {
    const level = CharacterAdapter.selectEx(state.characters, charId).skillsLevel[expType] ?? 0
    return getLevelExp(level)
}
export const selectNextExp = (expType: ExpEnum, charId: string) => (state: GameState) => {
    const level = CharacterAdapter.selectEx(state.characters, charId).skillsLevel[expType] ?? 0
    return getLevelExp(level + 1)
}
export const selectPlayerExp = (state: GameState, charId: string) => {
    const player = CharacterAdapter.selectEx(state.characters, charId)
    if (!player) throw new Error('Player not found')
    return player.skillsExp
}
export const selectPlayerLevel = (state: GameState, charId: string) => {
    const player = CharacterAdapter.selectEx(state.characters, charId)
    if (!player) throw new Error('Player not found')
    return player.level
}

const getLevelFromExp = (exp: number, growRate: number, expBasePrice: number) =>
    Math.round(Math.log10((exp * (growRate - 1)) / expBasePrice + 1) / Math.log10(growRate))

export const getSkillLevel = (skillExp: number) => getLevelFromExp(skillExp, EXP_GROW_RATE, EXP_BASE_PRICE)

export const getCharLevel = (exp: number) => getLevelFromExp(exp, EXP_GROW_RATE_MAIN, EXP_BASE_PRICE_MAIN)

export const getCharLevelExp = (level: number) =>
    Math.round(Math.floor(EXP_BASE_PRICE_MAIN * (EXP_GROW_RATE_MAIN ** level - 1)) / (EXP_GROW_RATE_MAIN - 1))
