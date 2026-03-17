import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { GenerateQuestDataData, QuestTemplate } from '../QuestTemplate'
import { QuestAdapter, QuestOutcomeAdapter, QuestState } from '../QuestTypes'

export abstract class BaseQuestTemplate<T extends GenerateQuestDataData> implements QuestTemplate<T> {
    abstract id: string
    abstract nextQuestId?: string | undefined
    abstract generateQuestData: (state: GameState, data?: T) => QuestState
    abstract getName: (id: string) => (state: GameState) => string
    abstract getDescription: (id: string) => (state: GameState) => string
    abstract getIcon: (id: string) => (state: GameState) => Icons
    abstract getOutcomeDescription: (questId: string, outcomeId: string) => (state: GameState) => string
    abstract getOutcomeTitle: (questId: string, outcomeId: string) => (state: GameState) => string
    getOutcomeGoldReward = (questId: string, outcomeId: string) => (state: GameState) => {
        const questState = QuestAdapter.selectEx(state.quests, questId)
        const outcome = QuestOutcomeAdapter.selectEx(questState.outcomeData, outcomeId)
        if (!outcome) return 0
        return outcome.goldReward ?? 0
    }
    getOutcomeItemReward = (questId: string, outcomeId: string) => (state: GameState) => {
        const questState = QuestAdapter.selectEx(state.quests, questId)
        const outcome = QuestOutcomeAdapter.selectEx(questState.outcomeData, outcomeId)
        if (!outcome) return []
        return outcome.itemsRewards ?? []
    }
}
