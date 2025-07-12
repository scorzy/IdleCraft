import { GameState } from '../game/GameState'
import { QuestData } from './QuestData'
import { QuestAdapter, QuestStatus } from './QuestTypes'

export const selectAcceptedQuests = (state: GameState) =>
    QuestAdapter.findManyIds(state.quests, (quest) => quest.state === QuestStatus.ACCEPTED)

export const selectAvailableQuests = (state: GameState) =>
    QuestAdapter.findManyIds(state.quests, (quest) => quest.state === QuestStatus.AVAILABLE)
export const selectQuestName = (questId: string) => (state: GameState) => {
    const templateId = QuestAdapter.selectEx(state.quests, questId).templateId
    const data = QuestData[templateId]
    if (!data) throw new Error(`Quest template not found for id: ${templateId}`)
    return data.getName(questId)(state)
}
export const selectQuestDescription = (questId: string) => (state: GameState) => {
    const templateId = QuestAdapter.selectEx(state.quests, questId).templateId
    const data = QuestData[templateId]
    if (!data) throw new Error(`Quest template not found for id: ${templateId}`)
    return data.getDescription(questId)(state)
}
export const selectQuestIcon = (questId: string) => (state: GameState) => {
    const templateId = QuestAdapter.selectEx(state.quests, questId).templateId
    const data = QuestData[templateId]
    if (!data) throw new Error(`Quest template not found for id: ${templateId}`)
    return data.getIcon(questId)(state)
}
export const isQuestSelected = (questId: string) => (state: GameState) => state.ui.selectedQuestId === questId
