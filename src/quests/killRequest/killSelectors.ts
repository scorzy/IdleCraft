import { GameState } from '../../game/GameState'
import { selectTranslations } from '../../msg/useTranslations'
import { QuestRequestSelectors } from '../selectors/QuestRequestSelectors'
import { selectOutcome } from '../selectors/selectOutcome'

export const KillQuestRequestSelectors: QuestRequestSelectors = {
    getDescription: (_questId: string, _outcomeId: string) => (state: GameState) =>
        selectTranslations(state).t.KillRequestDesc,

    isCompleted: (questId: string, outcomeId: string) => (state: GameState) => {
        const targets = selectOutcome(state, questId, outcomeId)?.targets
        if (!targets) return true
        return targets.every((target) => target.killedCount >= target.targetCount)
    },
}
export function isKillingReq(state: GameState, questId: string, outcomeId: string): boolean {
    return !!selectOutcome(state, questId, outcomeId)?.targets
}

export function selectQuestTargets(state: GameState, questId: string, outcomeId: string) {
    return selectOutcome(state, questId, outcomeId)?.targets
}
