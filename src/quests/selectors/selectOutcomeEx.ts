import { GameState } from '../../game/GameState'
import { selectOutcome } from './selectOutcome'

export const selectOutcomeEx = (state: GameState, questId: string, outcomeId: string) => {
    const outcome = selectOutcome(state, questId, outcomeId)
    if (!outcome) throw new Error(`[selectOutcomeEx]: not found questId:${questId} outcomeId:${outcomeId}`)
    return outcome
}
