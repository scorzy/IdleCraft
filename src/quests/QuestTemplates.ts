import { CharTemplateEnum } from '../characters/templates/characterTemplateEnum'
import { CharTemplatesData } from '../characters/templates/charTemplateData'
import { GameState } from '../game/GameState'
import { Icons } from '../icons/Icons'
import { selectTranslations } from '../msg/useTranslations'
import { getUniqueId } from '../utils/getUniqueId'
import { QuestTemplate } from './QuestTemplate'
import { isKillingOutcome, QuestAdapter, QuestStatus, QuestType } from './QuestTypes'

export class KillQuestTemplate implements QuestTemplate {
    nextQuestId?: string | undefined
    id = 'kill-n'

    selectTargetsForKillQuest = (state: GameState, id: string) => {
        const data = QuestAdapter.selectEx(state.quests, id)
        const outcomeData = data.outcomeData['outcome-1']
        if (!outcomeData) return []
        if (!isKillingOutcome(outcomeData)) return []
        return outcomeData.targets
    }

    getName = (id: string) => (state: GameState) => {
        const t = selectTranslations(state)
        return t.fun.killQuest1Desc(this.selectTargetsForKillQuest(state, id))
    }
    getDescription = (id: string) => (state: GameState) => {
        const t = selectTranslations(state)
        return t.fun.killQuest1Desc(this.selectTargetsForKillQuest(state, id))
    }
    getIcon = (id: string) => (state: GameState) => {
        const target = this.selectTargetsForKillQuest(state, id)[0]?.targetId as keyof typeof CharTemplatesData
        if (!target) return Icons.Skull
        const targetData = CharTemplatesData[target]
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
            'outcome-1': {
                id: 'outcome-1',
                type: QuestType.KILL,
                goldReward: 100,
                itemsRewards: [
                    { itemId: 'TinOre', quantity: 1 },
                    { itemId: 'DeadBoar', quantity: 1 },
                ],
                targets: [
                    {
                        targetId: CharTemplateEnum.Boar,
                        targetCount: 5,
                        killedCount: 0,
                    },
                ],
            },
        },
    })

    getOutcomeDescription = (questId: string, _outcomeId: string) => (state: GameState) => {
        const t = selectTranslations(state)
        return t.fun.killQuest1Outcome(this.selectTargetsForKillQuest(state, questId))
    }
    isOutcomeCompleted = (questId: string, outcomeId: string) => (state: GameState) => {
        const outcome = QuestAdapter.selectEx(state.quests, questId).outcomeData[outcomeId]
        if (!outcome) return false
        if (!isKillingOutcome(outcome)) return false
        return outcome.targets.every((target) => target.killedCount >= target.targetCount)
    }
    getOutcomeGoldReward = (questId: string, outcomeId: string) => (state: GameState) => {
        const outcome = QuestAdapter.selectEx(state.quests, questId).outcomeData[outcomeId]
        if (!outcome) return 0
        return outcome.goldReward ?? 0
    }
    getOutcomeItemReward = (questId: string, outcomeId: string) => (state: GameState) =>
        QuestAdapter.selectEx(state.quests, questId).outcomeData[outcomeId]?.itemsRewards ?? []
}
