import { GameState } from '../game/GameState'
import { selectTranslations } from '../msg/useTranslations'
import { selectTargetsForKillQuest } from './QuestSelectors'
import { QuestType } from './QuestTypes'
import { QuestRequestSelectors } from './QuestRequestSelectors'

const KillQuestRequestSelectors: QuestRequestSelectors = {
    getName: (questId: string, outcomeId: string, requestId: string) => (state: GameState) => {
        const t = selectTranslations(state)
        return t.fun.killQuest1Name(selectTargetsForKillQuest(state, questId, outcomeId, requestId))
    },
    getDescription: (questId: string, outcomeId: string, requestId: string) => (state: GameState) => {
        const t = selectTranslations(state)
        return t.fun.killQuest1Desc(selectTargetsForKillQuest(state, questId, outcomeId, requestId))
    },
    isCompleted: (questId: string, outcomeId: string, requestId: string) => (state: GameState) => {
        const targets = selectTargetsForKillQuest(state, questId, outcomeId, requestId)
        return targets.every((target) => target.killedCount >= target.targetCount)
    },
}

export function getQuestRequestSelectors(requestType: QuestType): QuestRequestSelectors {
    switch (requestType) {
        case QuestType.KILL:
            return KillQuestRequestSelectors
        default:
            throw new Error(`No selectors for request type ${requestType}`)
    }
}
