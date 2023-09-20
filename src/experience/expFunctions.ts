import { GameState } from '../game/GameState'
import { ExpAdapter } from './ExpAdapter'
import { EXP_BASE_PRICE, EXP_GROW_RATE } from './expConst'
import { ExpEnum } from './expEnum'

export function addExp(state: GameState, expType: ExpEnum, expQta: number) {
    let current = 0
    const expState = ExpAdapter.select(state.exp, expType)
    if (expState) current = expState.exp
    const exp = Math.floor(current + expQta)
    const level = Math.floor(Math.log10((exp * (EXP_GROW_RATE - 1)) / EXP_BASE_PRICE + 1) / Math.log10(EXP_GROW_RATE))
    state = {
        ...state,
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
