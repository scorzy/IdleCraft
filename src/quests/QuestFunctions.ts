import { CharacterAdapter } from '../characters/characterAdapter'
import { MAX_AVAILABLE_QUESTS } from '../const'
import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'
import { addGold, addItem } from '../storage/storageFunctions'
import { ItemRequest } from './ItemRequest'
import { QuestData } from './QuestData'
import {
    isOutcomeCompleted,
    selectAcceptedQuests,
    selectAvailableQuests,
    selectOutcome,
    selectQuestTemplate,
} from './QuestSelectors'
import { QuestAdapter, QuestOutcome, QuestOutcomeAdapter, QuestState, QuestStatus } from './QuestTypes'

export const selectQuest = (id: string) =>
    useGameStore.setState((state: GameState) => {
        return {
            ...state,
            ui: {
                ...state.ui,
                selectedQuestId: id,
            },
        }
    })

function GenerateQuestState(state: GameState, templateId: string): QuestState {
    const questTemplate = QuestData.getEx(templateId)
    return questTemplate.generateQuestData(state)
}

export function updateQuests(state: GameState): GameState {
    if (selectAvailableQuests(state).length > MAX_AVAILABLE_QUESTS) return state

    const newQuest: QuestState = GenerateQuestState(state, 'kill-n')

    state = { ...state, quests: QuestAdapter.create(state.quests, newQuest) }

    return state
}
export const acceptQuest = (state: GameState, questId: string) => {
    const quest = QuestAdapter.selectEx(state.quests, questId)
    if (!quest) return state
    if (quest.state !== QuestStatus.AVAILABLE) return state
    state = { ...state, quests: QuestAdapter.update(state.quests, questId, { state: QuestStatus.ACCEPTED }) }
    return state
}

export const acceptClick = (questId: string) => useGameStore.setState((state: GameState) => acceptQuest(state, questId))
export const questOnKillListener = (state: GameState, killedCharId: string): GameState => {
    QuestAdapter.forEach(state.quests, (quest) => {
        if (quest.state !== QuestStatus.ACCEPTED) return

        Object.values(quest.outcomeData).forEach((outcome: QuestOutcome) => {
            if (outcome.location !== state.location) return
            if (!outcome.targets) return

            const targets = [...outcome.targets]
            let updated = false
            for (const target of targets) {
                if (target.killedCount >= target.targetCount) continue
                const templateId = CharacterAdapter.selectEx(state.characters, killedCharId).templateId
                if (target.targetId !== templateId) return
                target.killedCount = target.killedCount + 1
                updated = true
            }

            if (!updated) return

            state = {
                ...state,
                quests: QuestAdapter.update(state.quests, quest.id, {
                    outcomeData: QuestOutcomeAdapter.update(quest.outcomeData, outcome.id, { targets }),
                }),
            }
        })
    })

    return state
}
export const completeQuest = (state: GameState, questId: string, outcomeId: string) => {
    const quest = QuestAdapter.selectEx(state.quests, questId)
    if (!quest) return state
    if (quest.state !== QuestStatus.ACCEPTED) return state
    const questTemplate = selectQuestTemplate(state, questId)
    if (!isOutcomeCompleted(questId, outcomeId)(state)) return state

    const outcome = QuestOutcomeAdapter.selectEx(quest.outcomeData, outcomeId)
    if (!outcome) return state

    if (outcome.itemsRewards)
        for (const reward of outcome.itemsRewards) addItem(state, reward.itemId, reward.quantity || 1)
    if (outcome.goldReward) state = addGold(state, outcome.goldReward)

    const oldIndex = selectAcceptedQuests(state).indexOf(questId)

    state = { ...state, quests: QuestAdapter.remove(state.quests, questId) }

    if (questTemplate.nextQuestId) {
        const newQuest: QuestState = GenerateQuestState(state, questTemplate.nextQuestId)
        state = {
            ...state,
            ui: { ...state.ui, selectedQuestId: newQuest.id },
            quests: QuestAdapter.create(state.quests, newQuest),
        }
    } else {
        const acceptedQuests = selectAcceptedQuests(state)
        const newSelectedQuestId = acceptedQuests[Math.min(oldIndex, acceptedQuests.length - 1)]
        state = {
            ...state,
            ui: { ...state.ui, selectedQuestId: newSelectedQuestId ?? null },
        }
    }

    return state
}

export const makeOnCollectQuestItemSelect = (
    questId: string,
    outcomeId: string,
    reqId: string,
    itemIndex: number,
    value: string | undefined
) =>
    useGameStore.setState((state: GameState) => {
        const outcome = selectOutcome(questId, outcomeId)(state)
        const reqItems = outcome?.reqItems
        if (!reqItems) return state

        const index = reqItems.findIndex((e) => e.id === reqId)
        const oldReq = reqItems[index]
        if (!oldReq) return state

        let newReq: ItemRequest[] = []
        if (itemIndex === 0) newReq = reqItems.with(index, { ...oldReq, selectedItems1: value })
        else if (itemIndex === 1) newReq = reqItems.with(index, { ...oldReq, selectedItems2: value })
        else if (itemIndex === 2) newReq = reqItems.with(index, { ...oldReq, selectedItems3: value })

        return {
            ...state,
            quests: QuestAdapter.update(state.quests, questId, {
                outcomeData: QuestOutcomeAdapter.update(
                    QuestAdapter.selectEx(state.quests, questId).outcomeData,
                    outcomeId,
                    {
                        reqItems: newReq,
                    }
                ),
            }),
        }
    })
