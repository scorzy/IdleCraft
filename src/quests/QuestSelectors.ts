import { GameState } from '../game/GameState'
import { Icons } from '../icons/Icons'
import { createMemoizeLatestSelector } from '../utils/createMemoizeLatestSelector'
import { QuestData } from './QuestData'
import { QuestTemplate } from './QuestTemplate'
import {
    isKillingQuestRequest,
    ItemsReward,
    KillQuestRequest,
    QuestAdapter,
    QuestOutcomeAdapter,
    QuestRequestAdapter,
    QuestStatus,
} from './QuestTypes'
import { getQuestRequestSelectors } from './RequestSelectors'

export const selectAcceptedQuests = createMemoizeLatestSelector([(state: GameState) => state.quests], (quests) =>
    QuestAdapter.findManyIds(quests, (quest) => quest.state === QuestStatus.ACCEPTED)
)

export const selectAvailableQuests = createMemoizeLatestSelector([(state: GameState) => state.quests], (quests) =>
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

export const selectOutcomeIds = createMemoizeLatestSelector(
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

export const selectOutcome = (questId: string, outcomeId: string) => (state: GameState) => {
    if (!questId || !outcomeId) return null
    const quest = QuestAdapter.selectEx(state.quests, questId)
    return QuestOutcomeAdapter.select(quest.outcomeData, outcomeId) || null
}
export const isOutcomeCompleted = (questId: string, outcomeId: string) => (state: GameState) => {
    if (!questId || !outcomeId) return false
    const quest = QuestAdapter.selectEx(state.quests, questId)
    return QuestData.getEx(quest.templateId).isOutcomeCompleted(questId, outcomeId)(state)
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

export const selectTargetsForKillQuest = (state: GameState, questId: string, outcomeId: string, requestId: string) => {
    const data = QuestAdapter.selectEx(state.quests, questId)
    const outcome = QuestOutcomeAdapter.selectEx(data.outcomeData, outcomeId)
    const request = QuestRequestAdapter.selectEx(outcome.requests, requestId)
    if (!request) return []
    if (!isKillingQuestRequest(request)) return []
    return request.targets
}
export function selectFirstKillRequest(state: GameState, questId: string): KillQuestRequest | null {
    const data = QuestAdapter.selectEx(state.quests, questId)

    for (const outcomeId of data.outcomeData.ids) {
        const outcome = data.outcomeData.entries[outcomeId]
        if (!outcome) continue
        for (const requestId of outcome.requests.ids) {
            const request = outcome.requests.entries[requestId]
            if (!request) continue
            if (isKillingQuestRequest(request)) return request
        }
    }

    return null
}
export const selectRequestIds = (questId: string, outcomeId: string) => (state: GameState) => {
    if (!questId || !outcomeId) return []
    const quest = QuestAdapter.selectEx(state.quests, questId)
    const outcome = QuestOutcomeAdapter.select(quest.outcomeData, outcomeId)
    return outcome?.requests.ids ?? []
}
export const selectRequest = (questId: string, outcomeId: string, requestId: string) => (state: GameState) => {
    if (!questId || !outcomeId || !requestId) return null
    const quest = QuestAdapter.selectEx(state.quests, questId)
    const outcome = QuestOutcomeAdapter.select(quest.outcomeData, outcomeId)
    if (!outcome) return null
    return QuestRequestAdapter.select(outcome.requests, requestId) || null
}
export const selectRequestType = (questId: string, outcomeId: string, requestId: string) => (state: GameState) => {
    if (!questId || !outcomeId || !requestId) return null
    const quest = QuestAdapter.selectEx(state.quests, questId)
    const outcome = QuestOutcomeAdapter.select(quest.outcomeData, outcomeId)
    if (!outcome) return null
    return QuestRequestAdapter.select(outcome.requests, requestId)?.type || null
}
export const selectRequestDescription =
    (questId: string, outcomeId: string, requestId: string) => (state: GameState) => {
        const type = selectRequestType(questId, outcomeId, requestId)(state)
        if (!type) return ''
        return getQuestRequestSelectors(type).getDescription(questId, outcomeId, requestId)(state)
    }
