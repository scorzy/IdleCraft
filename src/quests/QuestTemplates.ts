import { CharTemplateEnum } from '../characters/templates/characterTemplateEnum'
import { CharTemplatesData } from '../characters/templates/charTemplateData'
import { GameState } from '../game/GameState'
import { Icons } from '../icons/Icons'
import { selectTranslations } from '../msg/useTranslations'
import { getUniqueId } from '../utils/getUniqueId'
import { selectFirstKillRequest } from './QuestSelectors'
import { QuestTemplate } from './QuestTemplate'
import { QuestAdapter, QuestOutcomeAdapter, QuestRequestAdapter, QuestStatus, QuestType } from './QuestTypes'
import { getQuestRequestSelectors } from './RequestSelectors'

export class KillQuestTemplate implements QuestTemplate {
    nextQuestId?: string | undefined
    id = 'kill-n'

    getName = (questId: string) => (state: GameState) => {
        const t = selectTranslations(state)
        const req = selectFirstKillRequest(state, questId)
        if (!req) return t.fun.killQuest1Name([])
        return t.fun.killQuest1Desc(req.targets)
    }
    getDescription = (questId: string) => (state: GameState) => {
        const t = selectTranslations(state)
        const req = selectFirstKillRequest(state, questId)
        if (!req) return t.fun.killQuest1Desc([])
        return t.fun.killQuest1Desc(req.targets)
    }
    getIcon = (questId: string) => (state: GameState) => {
        const req = selectFirstKillRequest(state, questId)
        if (!req) return Icons.Skull
        const target = req.targets[0]
        if (!target) return Icons.Skull
        const targetData = CharTemplatesData[target.targetId]
        return Icons[targetData.iconId] || Icons.Skull
    }

    generateQuestData = (_state: GameState) => ({
        id: getUniqueId(),
        state: QuestStatus.AVAILABLE,
        templateId: 'kill-n',
        parameters: {
            'param-1': {
                id: 'param-1',
                quantity: 5,
                targetId: CharTemplateEnum.Boar,
            },
        },
        outcomeData: {
            ids: ['k'],
            entries: {
                k: {
                    id: 'k',
                    type: QuestType.KILL,
                    goldReward: 100,
                    itemsRewards: [
                        { itemId: 'TinOre', quantity: 1 },
                        { itemId: 'DeadBoar', quantity: 1 },
                    ],
                    requests: {
                        ids: ['request-1'],
                        entries: {
                            'request-1': {
                                id: 'request-1',
                                type: QuestType.KILL,
                                targets: [
                                    {
                                        targetId: CharTemplateEnum.Boar,
                                        targetCount: 5,
                                        killedCount: 0,
                                    },
                                ],
                            },
                        },
                    },
                },
            },
        },
    })

    getOutcomeDescription = (_questId: string, _outcomeId: string) => (_state: GameState) => {
        return ''
    }
    isOutcomeCompleted = (questId: string, outcomeId: string) => (state: GameState) => {
        const questState = QuestAdapter.selectEx(state.quests, questId)
        const outcome = QuestOutcomeAdapter.selectEx(questState.outcomeData, outcomeId)
        if (!outcome) return true
        return QuestRequestAdapter.every(outcome.requests, (req) =>
            getQuestRequestSelectors(req.type).isCompleted(questId, outcomeId, req.id)(state)
        )
    }
    getOutcomeGoldReward = (questId: string, outcomeId: string) => (state: GameState) => {
        const questState = QuestAdapter.selectEx(state.quests, questId)
        const outcome = QuestOutcomeAdapter.selectEx(questState.outcomeData, outcomeId)
        if (!outcome) return 0
        return outcome.goldReward ?? 0
    }
    getOutcomeItemReward = (questId: string, outcomeId: string) => (state: GameState) => {
        const questState = QuestAdapter.selectEx(state.quests, questId)
        const outcome = QuestOutcomeAdapter.selectEx(questState.outcomeData, outcomeId)
        if (!outcome) return []
        return outcome.itemsRewards ?? []
    }
}
