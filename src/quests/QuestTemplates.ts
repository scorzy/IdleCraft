import { CharTemplateEnum } from '../characters/templates/characterTemplateEnum'
import { CharTemplatesData } from '../characters/templates/charTemplateData'
import { selectFormatter } from '../formatters/selectNumberFormatter'
import { GameState } from '../game/GameState'
import { Icons } from '../icons/Icons'
import { selectTranslations } from '../msg/useTranslations'
import { getUniqueId } from '../utils/getUniqueId'
import { QuestTemplate } from './QuestTemplate'
import { KillQuestParameter, QuestAdapter, QuestStatus, QuestType } from './QuestTypes'

export class KillQuestTemplate implements QuestTemplate {
    id = 'kill-n'
    selectTargetsForKillQuest = (state: GameState, id: string) => {
        const ft = selectFormatter(state)
        const data = QuestAdapter.selectEx(state.quests, id)
        const params = data.parameters as Record<string, KillQuestParameter>

        const targets: { target: keyof typeof CharacterData; formattedQta: string; qta: number }[] = []
        for (const p of Object.values(params)) {
            if (p.quantity < Number.EPSILON) continue
            targets.push({
                target: p.targetId,
                formattedQta: ft.f(p.quantity),
                qta: p.quantity,
            })
        }
        return targets
    }
    getName = (id: string) => (state: GameState) => {
        const t = selectTranslations(state)
        return t.fun.killQuest1Name(this.selectTargetsForKillQuest(state, id))
    }
    getDescription = (id: string) => (state: GameState) => {
        const t = selectTranslations(state)
        return t.fun.killQuest1Desc(this.selectTargetsForKillQuest(state, id))
    }
    getIcon = (id: string) => (state: GameState) => {
        const target = this.selectTargetsForKillQuest(state, id)[0]?.target as keyof typeof CharTemplatesData
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
                outcomeId: 'outcome-1',
                type: QuestType.KILL,
                targetId: CharTemplateEnum.Boar,
                targetCount: 5,
                goldReward: 100,
            },
        },
    })

    getOutcomeDescription = (questId: string, _outcomeId: string) => (state: GameState) => {
        const t = selectTranslations(state)
        return t.fun.killQuest1Outcome(this.selectTargetsForKillQuest(state, questId))
    }
}
