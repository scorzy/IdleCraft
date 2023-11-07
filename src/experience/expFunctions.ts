import { GameState } from '../game/GameState'
import { ExpAdapter } from './ExpAdapter'
import { EXP_BASE_PRICE, EXP_BASE_PRICE_MAIN, EXP_GROW_RATE, EXP_GROW_RATE_MAIN } from './expConst'
import { ExpEnum } from './expEnum'

export function addExp(state: GameState, expType: ExpEnum, expQta: number) {
    let current = 0
    let currentLevel = 0
    const expState = ExpAdapter.select(state.exp, expType)
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
        exp: ExpAdapter.upsertMerge(state.exp, {
            id: expType,
            exp,
            level,
        }),
    }
    return state
}
export function getLevel(state: GameState, expType: ExpEnum): number {
    return ExpAdapter.select(state.exp, expType)?.level ?? 0
}
export function getLevelExp(level: number): number {
    return Math.floor(EXP_BASE_PRICE * (EXP_GROW_RATE ** level - 1)) / (EXP_GROW_RATE - 1)
}
