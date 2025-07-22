import { CharTemplateEnum } from '../characters/templates/characterTemplateEnum'
import { Icons } from '../icons/Icons'
import { GameState } from '../game/GameState'
import { selectTranslations } from '../msg/useTranslations'
import { CharTemplatesData } from '../characters/templates/charTemplateData'
import { selectFormatter } from '../formatters/selectNumberFormatter'
import { MapEx } from '../utils/MapEx'
import { getUniqueId } from '../utils/getUniqueId'
import { KillQuestParameter, QuestAdapter, QuestStatus, QuestType } from './QuestTypes'
import { QuestTemplate } from './QuestTemplate'

export const selectTargetsForKillQuest = (state: GameState, id: string) => {
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

export const QuestData: MapEx<string, QuestTemplate> = new MapEx<string, QuestTemplate>()

QuestData.set('kill-n', {
    id: 'kill-n',
    getName: (id: string) => (state: GameState) => {
        const t = selectTranslations(state)
        return t.fun.killQuest1Name(selectTargetsForKillQuest(state, id))
    },
    getDescription: (id: string) => (state: GameState) => {
        const t = selectTranslations(state)
        return t.fun.killQuest1Desc(selectTargetsForKillQuest(state, id))
    },
    getIcon: (id: string) => (state: GameState) => {
        const target = selectTargetsForKillQuest(state, id)[0]?.target as keyof typeof CharTemplatesData
        if (!target) return Icons.Skull
        const targetData = CharTemplatesData[target]
        return Icons[targetData.iconId] || Icons.Skull
    },

    generateQuestData: (state: GameState) => ({
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
    }),
})
