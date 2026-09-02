import { MAX_AVAILABLE_QUESTS } from '../const'
import { GameState } from '../game/GameState'
import { setState } from '../game/setState'
import { GameLocationAdapter } from '../gameLocations/GameLocationAdapter'
import { GatheringData } from '../gathering/gatheringData'
import { selectTranslations } from '../msg/useTranslations'
import { addNotification } from '../notification/addNotification'
import { addGold, addItem } from '../storage/storageFunctions'
import { onCollectQuestComplete } from './collectRequest/onCollectQuestComplete'
import { QuestData } from './QuestData'
import { FARM_BOAR_TUTORIAL_ID } from './templates/FarmBoarTutorialQuest'
import { QuestAdapter, QuestOutcome, QuestOutcomeAdapter, QuestState, QuestStatus } from './QuestTypes'
import {
    isOutcomeCompleted,
    selectAcceptedQuests,
    selectAvailableQuests,
    selectQuestTemplate,
} from './selectors/QuestSelectors'

export const selectQuest = (id: string) =>
    setState((state: GameState) => {
        state.ui.selectedQuestId = id
    })

function GenerateQuestState(state: GameState, templateId: string): QuestState {
    const questTemplate = QuestData.getEx(templateId)
    return questTemplate.generateQuestData(state)
}

function unlockGatheringZone(state: GameState, outcome: QuestOutcome) {
    const gatheringZone = outcome.unlockGatheringZone
    if (!gatheringZone) return

    const unlocked = GameLocationAdapter.selectEx(state.locations, outcome.location).unlockedGatheringZones
    if (unlocked.includes(gatheringZone)) return

    unlocked.push(gatheringZone)

    const gatheringData = GatheringData[gatheringZone]
    addNotification(state.notifications, {
        title: selectTranslations(state).fun.ZoneUnlocked(gatheringData.nameId),
        iconId: gatheringData.iconId,
    })
}

export function updateQuests(state: GameState): void {
    const hasTutorial = QuestAdapter.getIds(state.quests).some(
        (questId) => QuestAdapter.selectEx(state.quests, questId).templateId === FARM_BOAR_TUTORIAL_ID
    )
    if (!hasTutorial && !state.completedQuestTemplates.includes(FARM_BOAR_TUTORIAL_ID)) {
        QuestAdapter.create(state.quests, GenerateQuestState(state, FARM_BOAR_TUTORIAL_ID))
    }

    if (selectAvailableQuests(state).length > MAX_AVAILABLE_QUESTS) return

    let nKillQuests = 0
    let nCollectQuests = 0

    for (const questId of selectAvailableQuests(state)) {
        const quest = QuestAdapter.selectEx(state.quests, questId)
        if (quest.templateId === 'kill-n') nKillQuests++
        if (quest.templateId === 'SupplyQuest') nCollectQuests++
    }

    if (nKillQuests < 3) {
        const newQuest: QuestState = GenerateQuestState(state, 'kill-n')
        QuestAdapter.create(state.quests, newQuest)
    }

    if (nCollectQuests < 3) {
        const newQuest: QuestState = GenerateQuestState(state, 'SupplyQuest')
        QuestAdapter.create(state.quests, newQuest)
    }
}
export const acceptQuest = (state: GameState, questId: string) => {
    const quest = QuestAdapter.selectEx(state.quests, questId)
    if (!quest) return state
    if (quest.state !== QuestStatus.AVAILABLE) return state
    quest.state = QuestStatus.ACCEPTED
}

export const acceptClick = (questId: string) => setState((state: GameState) => acceptQuest(state, questId))

export const discardQuest = (state: GameState, questId: string) => {
    const quest = QuestAdapter.selectEx(state.quests, questId)
    if (quest.main) return

    const questIds = quest.state === QuestStatus.ACCEPTED ? selectAcceptedQuests(state) : selectAvailableQuests(state)
    const oldIndex = questIds.indexOf(questId)

    QuestAdapter.remove(state.quests, questId)

    if (state.ui.selectedQuestId !== questId) return

    const sameStatusQuests =
        quest.state === QuestStatus.ACCEPTED ? selectAcceptedQuests(state) : selectAvailableQuests(state)
    const otherStatusQuests =
        quest.state === QuestStatus.ACCEPTED ? selectAvailableQuests(state) : selectAcceptedQuests(state)

    state.ui.selectedQuestId =
        sameStatusQuests[Math.min(oldIndex, sameStatusQuests.length - 1)] ?? otherStatusQuests[0] ?? null
}

export const discardClick = (questId: string) => setState((state: GameState) => discardQuest(state, questId))

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

    if (outcome.unlockGatheringZone) unlockGatheringZone(state, outcome)

    const oldIndex = selectAcceptedQuests(state).indexOf(questId)

    if (!state.completedQuestTemplates.includes(quest.templateId)) state.completedQuestTemplates.push(quest.templateId)

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
