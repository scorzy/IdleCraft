import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { createDeepEqualSelector } from '../../utils/createDeepEqualSelector'
import { QuestData } from '../QuestData'
import { QuestTemplate } from '../QuestTemplate'
import { ItemsReward, QuestAdapter, QuestOutcomeAdapter, QuestStatus } from '../QuestTypes'
import { QuestReqSelectors } from './QuestReqSelectors'

export const selectAcceptedQuests = createDeepEqualSelector([(state: GameState) => state.quests], (quests) =>
    QuestAdapter.findManyIds(quests, (quest) => quest.state === QuestStatus.ACCEPTED)
)

export const selectAvailableQuests = createDeepEqualSelector([(state: GameState) => state.quests], (quests) =>
    QuestAdapter.findManyIds(quests, (quest) => quest.state === QuestStatus.AVAILABLE)
)

export const selectQuestName = (questId: string | null) => (state: GameState) => {
    if (!questId) return ''
    return selectQuestTemplate(state, questId).getName(questId)(state)
}
export const selectQuestDescription = (questId: string | null) => (state: GameState) => {
    if (!questId) return ''
    return selectQuestTemplate(state, questId).getDescription(questId)(state)
}
export const selectQuestIcon = (questId: string | null) => (state: GameState) => {
    if (!questId) return Icons.Dagger
    return selectQuestTemplate(state, questId).getIcon(questId)(state)
}
export const isQuestSelected = (questId: string) => (state: GameState) => state.ui.selectedQuestId === questId
export const selectQuestId = (state: GameState) => state.ui.selectedQuestId

export const selectQuestStatus = (questId: string | null) => (state: GameState) => {
    if (!questId) return QuestStatus.AVAILABLE
    return QuestAdapter.selectEx(state.quests, questId).state
}

export const selectOutcomeIds = createDeepEqualSelector(
    [selectQuestId, (s: GameState) => s.quests],
    (questId, quests) => {
        if (!questId) return []
        const outcomes = QuestAdapter.selectEx(quests, questId).outcomeData
        if (!outcomes) return []
        return outcomes.ids
    }
)

export const selectOutcomeDescription = (questId: string | null, outcomeId: string | null) => (state: GameState) => {
    if (!questId || !outcomeId) return ''
    const quest = QuestAdapter.selectEx(state.quests, questId)
    const outcomeData = QuestOutcomeAdapter.selectEx(quest.outcomeData, outcomeId)
    if (!outcomeData) return ''
    const templateId = quest.templateId
    const data = QuestData.getEx(templateId)
    return data.getOutcomeDescription(questId, outcomeId)(state)
}

export const selectOutcome = (state: GameState, questId: string, outcomeId: string) => {
    if (!questId || !outcomeId) return null
    const quest = QuestAdapter.selectEx(state.quests, questId)
    return QuestOutcomeAdapter.select(quest.outcomeData, outcomeId) || null
}
export const selectOutcomeEx = (state: GameState, questId: string, outcomeId: string) => {
    const outcome = selectOutcome(state, questId, outcomeId)
    if (!outcome) throw new Error(`[selectOutcomeEx]: not found questId:${questId} outcomeId:${outcomeId}`)
    return outcome
}
export const isOutcomeCompleted = (questId: string, outcomeId: string) => (state: GameState) => {
    const questState = QuestAdapter.selectEx(state.quests, questId)
    if (questState.state !== QuestStatus.ACCEPTED) return false
    const outcome = QuestOutcomeAdapter.selectEx(questState.outcomeData, outcomeId)
    if (!outcome) return true
    return QuestReqSelectors.every((selector) => selector.isCompleted(questId, outcomeId)(state))
}
export function selectQuestTemplate(state: GameState, questId: string): QuestTemplate {
    const quest = QuestAdapter.selectEx(state.quests, questId)
    return QuestData.getEx(quest.templateId)
}
export function selectOutcomeGoldReward(state: GameState, questId: string, outcomeId: string): number {
    return selectQuestTemplate(state, questId).getOutcomeGoldReward(questId, outcomeId)(state)
}
export function selectOutcomeItemReward(state: GameState, questId: string, outcomeId: string): ItemsReward[] {
    return selectQuestTemplate(state, questId).getOutcomeItemReward(questId, outcomeId)(state)
}

export const selectOutcomeLocation = (state: GameState, questId: string, outcomeId: string) =>
    selectOutcome(state, questId, outcomeId)?.location
