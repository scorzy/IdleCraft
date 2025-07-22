import { GameState } from '../game/GameState'
import { createMemoizeLatestSelector } from '../utils/createMemoizeLatestSelector'
import { QuestData } from './QuestData'
import { QuestAdapter, QuestStatus } from './QuestTypes'

export const selectAcceptedQuests = createMemoizeLatestSelector([(state: GameState) => state.quests], (quests) =>
    QuestAdapter.findManyIds(quests, (quest) => quest.state === QuestStatus.ACCEPTED)
)

export const selectAvailableQuests = createMemoizeLatestSelector([(state: GameState) => state.quests], (quests) =>
    QuestAdapter.findManyIds(quests, (quest) => quest.state === QuestStatus.AVAILABLE)
)

export const selectQuestName = (questId: string) => (state: GameState) => {
    const templateId = QuestAdapter.selectEx(state.quests, questId).templateId
    const data = QuestData.getEx(templateId)
    return data.getName(questId)(state)
}
export const selectQuestDescription = (questId: string) => (state: GameState) => {
    const templateId = QuestAdapter.selectEx(state.quests, questId).templateId
    const data = QuestData.getEx(templateId)
    return data.getDescription(questId)(state)
}
export const selectQuestIcon = (questId: string) => (state: GameState) => {
    const templateId = QuestAdapter.selectEx(state.quests, questId).templateId
    const data = QuestData.getEx(templateId)
    return data.getIcon(questId)(state)
}
export const isQuestSelected = (questId: string) => (state: GameState) => state.ui.selectedQuestId === questId
