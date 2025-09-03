import uniq from 'lodash-es/uniq'
import { GameState } from '../game/GameState'
import { Icons } from '../icons/Icons'
import { selectTranslations } from '../msg/useTranslations'
import { selectItemQta } from '../storage/StorageSelectors'
import { createMemoizeLatestSelector } from '../utils/createMemoizeLatestSelector'
import { QuestData } from './QuestData'
import { QuestRequestSelectors } from './QuestRequestSelectors'
import { QuestTemplate } from './QuestTemplate'
import { ItemsReward, QuestAdapter, QuestOutcomeAdapter, QuestStatus } from './QuestTypes'

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

export function selectQuestTargets(state: GameState, questId: string, outcomeId: string) {
    return selectOutcome(questId, outcomeId)(state)?.targets
}
export const selectQuestItemsReqIds = (state: GameState, questId: string, outcomeId: string) => {
    const reqItems = selectOutcome(questId, outcomeId)(state)?.reqItems
    if (!reqItems) return []
    return reqItems.map((r) => r.id)
}
export const selectItemReq = (state: GameState, questId: string, outcomeId: string, reqId: string) => {
    const reqItems = selectOutcome(questId, outcomeId)(state)?.reqItems
    if (!reqItems) return null
    return reqItems.find((r) => r.id === reqId)
}

export function isKillingReq(state: GameState, questId: string, outcomeId: string): boolean {
    return !!selectOutcome(questId, outcomeId)(state)?.targets
}
export function isCollectReq(state: GameState, questId: string, outcomeId: string): boolean {
    return !!selectOutcome(questId, outcomeId)(state)?.reqItems
}

export const KillQuestRequestSelectors: QuestRequestSelectors = {
    getDescription: (_questId: string, _outcomeId: string) => (state: GameState) =>
        selectTranslations(state).t.KillRequestDesc,

    isCompleted: (questId: string, outcomeId: string) => (state: GameState) => {
        const targets = selectOutcome(questId, outcomeId)(state)?.targets
        if (!targets) return true
        return targets.every((target) => target.killedCount >= target.targetCount)
    },
}

export const CollectQuestRequestSelectors: QuestRequestSelectors = {
    getDescription: (_questId: string, _outcomeId: string) => (state: GameState) =>
        selectTranslations(state).t.collectReqDesc,

    isCompleted: (questId: string, outcomeId: string) => (state: GameState) => {
        const reqItems = selectOutcome(questId, outcomeId)(state)?.reqItems
        if (!reqItems) return true
        for (const reqItem of reqItems) {
            let qta = 0
            const itemIds = [reqItem.selectedItem1, reqItem.selectedItem2, reqItem.selectedItem3]
            for (const selectedItem of uniq(itemIds)) if (selectedItem) qta += selectItemQta(null, selectedItem)(state)
            if (qta < reqItem.itemCount) return false
        }
        return true
    },
}

export const QuestReqSelectors = [KillQuestRequestSelectors, CollectQuestRequestSelectors]

export const selectCollectQuestItemValue = (
    state: GameState,
    questId: string,
    outcomeId: string,
    reqId: string,
    itemIndex: number
) => {
    const outcome = selectOutcome(questId, outcomeId)(state)
    const req = outcome?.reqItems?.find((e) => e.id === reqId)
    if (!req) return

    if (itemIndex === 0) return req.selectedItem1
    else if (itemIndex === 1) return req.selectedItem2
    else if (itemIndex === 2) return req.selectedItem3
}
