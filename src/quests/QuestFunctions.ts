import { MAX_AVAILABLE_QUESTS } from '../const'
import { GameState } from '../game/GameState'
import { setState } from '../game/state'
import { addGold, addItem } from '../storage/storageFunctions'
import { QuestData } from './QuestData'
import {
    isOutcomeCompleted,
    selectAcceptedQuests,
    selectAvailableQuests,
    selectQuestTemplate,
} from './selectors/QuestSelectors'
import { QuestAdapter, QuestOutcomeAdapter, QuestState, QuestStatus } from './QuestTypes'
import { onCollectQuestComplete } from './collectRequest/onCollectQuestComplete'

export const selectQuest = (id: string) =>
    setState((state: GameState) => {
        state.ui.selectedQuestId = id
    })

function GenerateQuestState(state: GameState, templateId: string): QuestState {
    const questTemplate = QuestData.getEx(templateId)
    return questTemplate.generateQuestData(state)
}

export function updateQuests(state: GameState): void {
    if (selectAvailableQuests(state).length > MAX_AVAILABLE_QUESTS) return

    const newQuest: QuestState = GenerateQuestState(state, 'kill-n')

    QuestAdapter.create(state.quests, newQuest)
}
export const acceptQuest = (state: GameState, questId: string) => {
    const quest = QuestAdapter.selectEx(state.quests, questId)
    if (!quest) return state
    if (quest.state !== QuestStatus.AVAILABLE) return state
    quest.state = QuestStatus.ACCEPTED
}

export const acceptClick = (questId: string) => setState((state: GameState) => acceptQuest(state, questId))

export const setExpandedOutcome = (questId: string | null, outcomeId: string) => {
    if (!questId) return

    setState((state: GameState) => {
        QuestAdapter.selectEx(state.quests, questId).expandedOutcome = outcomeId
    })
}
export const completeQuest = (state: GameState, questId: string, outcomeId: string) => {
    const quest = QuestAdapter.selectEx(state.quests, questId)
    if (!quest) return
    if (quest.state !== QuestStatus.ACCEPTED) return
    const questTemplate = selectQuestTemplate(state, questId)
    if (!isOutcomeCompleted(questId, outcomeId)(state)) return

    state = onCollectQuestComplete(state, questId, outcomeId)

    const outcome = QuestOutcomeAdapter.selectEx(quest.outcomeData, outcomeId)
    if (!outcome) return

    if (outcome.itemsRewards)
        for (const reward of outcome.itemsRewards) addItem(state, reward.itemId, reward.quantity || 1)
    if (outcome.goldReward) addGold(state, outcome.goldReward)

    const oldIndex = selectAcceptedQuests(state).indexOf(questId)

    QuestAdapter.remove(state.quests, questId)

    if (questTemplate.nextQuestId) {
        const newQuest: QuestState = GenerateQuestState(state, questTemplate.nextQuestId)
        QuestAdapter.create(state.quests, newQuest)
        state.ui.selectedQuestId = newQuest.id
    } else {
        const acceptedQuests = selectAcceptedQuests(state)
        const newSelectedQuestId = acceptedQuests[Math.min(oldIndex, acceptedQuests.length - 1)]

        state.ui.selectedQuestId = newSelectedQuestId ?? null
    }
}
