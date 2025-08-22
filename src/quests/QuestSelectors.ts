import { GameState } from '../game/GameState'
import { Icons } from '../icons/Icons'
import { createMemoizeLatestSelector } from '../utils/createMemoizeLatestSelector'
import { QuestData } from './QuestData'
import { QuestTemplate } from './QuestTemplate'
import { QuestAdapter, QuestStatus } from './QuestTypes'

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
        return Object.keys(outcomes).sort()
    }
)

export const selectOutcomeDescription = (questId: string | null, outcomeId: string | null) => (state: GameState) => {
    if (!questId || !outcomeId) return ''
    const quest = QuestAdapter.selectEx(state.quests, questId)
    const outcomeData = quest.outcomeData[outcomeId]
    if (!outcomeData) return ''
    const templateId = quest.templateId
    const data = QuestData.getEx(templateId)
    return data.getOutcomeDescription(questId, outcomeId)(state)
}
export const selectOutcomeType = (questId: string | null, outcomeId: string | null) => (state: GameState) => {
    if (!questId || !outcomeId) return null
    const quest = QuestAdapter.selectEx(state.quests, questId)
    const outcomeData = quest.outcomeData[outcomeId]
    if (!outcomeData) return null
    return outcomeData.type
}
export const selectOutcome = (questId: string, outcomeId: string) => (state: GameState) => {
    if (!questId || !outcomeId) return null
    const quest = QuestAdapter.selectEx(state.quests, questId)
    const outcomeData = quest.outcomeData[outcomeId]
    if (!outcomeData) return null
    const outcome = quest.outcomeData[outcomeId]
    return outcome
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
