import { GameState } from '../game/GameState'
import { EXP_BASE_PRICE, EXP_BASE_PRICE_MAIN, EXP_GROW_RATE, EXP_GROW_RATE_MAIN } from './expConst'
import { ExpEnum } from './expEnum'

export function addExp(state: GameState, expType: ExpEnum, expQta: number) {
    let current = 0
    let currentLevel = 0
    const expState = state.exp[expType]
    if (expState) {
        current = expState.exp
        currentLevel = expState.level
    }
    const exp = Math.floor(current + expQta)
    const level = Math.floor(Math.log10((exp * (EXP_GROW_RATE - 1)) / EXP_BASE_PRICE + 1) / Math.log10(EXP_GROW_RATE))

    const newLevels = Math.max(Math.floor(level - currentLevel), 0)
    const playerExp = state.playerExp + newLevels
    const playerLevel = Math.floor(
        Math.log10((playerExp * (EXP_GROW_RATE_MAIN - 1)) / EXP_BASE_PRICE_MAIN + 1) / Math.log10(EXP_GROW_RATE_MAIN)
    )

    state = {
        ...state,
        playerExp,
        playerLevel,
        exp: {
            ...state.exp,
            [expType]: {
                exp,
                level,
            },
        },
    }
    return state
}
export const getLevel = (state: GameState, expType: ExpEnum) => state.exp[expType].level

export const getLevelExp = (level: number) =>
    Math.floor(EXP_BASE_PRICE * (EXP_GROW_RATE ** level - 1)) / (EXP_GROW_RATE - 1)
