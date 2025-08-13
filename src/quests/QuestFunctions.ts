import { CharacterAdapter } from '../characters/characterAdapter'
import { MAX_AVAILABLE_QUESTS } from '../const'
import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'
import { QuestData } from './QuestData'
import { selectAvailableQuests } from './QuestSelectors'
import { isKillingOutcome, KillQuestOutcome, QuestAdapter, QuestState, QuestStatus } from './QuestTypes'

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
export const questOnKillListener = (state: GameState, targetId: string): GameState => {
    QuestAdapter.forEach(state.quests, (quest) => {
        if (quest.state !== QuestStatus.ACCEPTED) return
        Object.values(quest.outcomeData).forEach((outcome) => {
            if (!isKillingOutcome(outcome)) return
            if (outcome.killedCount >= outcome.targetCount) return

            const templateId = CharacterAdapter.selectEx(state.characters, targetId).templateId

            if (outcome.targetId !== templateId) return

            const killedCount = outcome.killedCount + 1
            state = {
                ...state,
                quests: QuestAdapter.update(state.quests, quest.id, {
                    outcomeData: {
                        ...quest.outcomeData,
                        [outcome.id]: { ...outcome, killedCount } as KillQuestOutcome,
                    },
                }),
            }
        })
    })

    return state
}
