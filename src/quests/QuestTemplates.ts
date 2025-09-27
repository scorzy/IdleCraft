import { CharTemplateEnum } from '../characters/templates/characterTemplateEnum'
import { GameState } from '../game/GameState'
import { GameLocations } from '../gameLocations/GameLocations'
import { Icons } from '../icons/Icons'
import { ItemTypes } from '../items/Item'
import { selectTranslations } from '../msg/useTranslations'
import { getUniqueId } from '../utils/getUniqueId'
import { QuestTemplate } from './QuestTemplate'
import { QuestAdapter, QuestOutcome, QuestOutcomeAdapter, QuestState, QuestStatus } from './QuestTypes'

export class TestQuestTemplate implements QuestTemplate {
    nextQuestId?: string | undefined
    id = 'kill-n'
    getName = (questId: string) => (state: GameState) =>
        selectTranslations(state).fun.testQuestName(QuestAdapter.selectEx(state.quests, questId).parameters)

    getDescription = (questId: string) => (state: GameState) =>
        selectTranslations(state).fun.testQuestDesc(QuestAdapter.selectEx(state.quests, questId).parameters)

    getIcon = (_questId: string) => (_state: GameState) => Icons.Skull
    getOutcomeDescription = (questId: string, outcomeId: string) => (state: GameState) => {
        const f = selectTranslations(state).fun
        if (outcomeId === 'k') return f.testOutcomeDesc(QuestAdapter.selectEx(state.quests, questId).parameters)
        else return f.testOutcome2Desc(QuestAdapter.selectEx(state.quests, questId).parameters)
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

    generateQuestData = (_state: GameState) => {
        const kill: QuestOutcome = {
            id: 'k',
            location: GameLocations.StartVillage,
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
        }

        const collect: QuestOutcome = {
            id: 'c',
            location: GameLocations.StartVillage,
            goldReward: 100,
            itemsRewards: [
                { itemId: 'TinOre', quantity: 1 },
                { itemId: 'DeadBoar', quantity: 1 },
            ],
            reqItems: [
                {
                    id: '1',
                    itemCount: 2,
                    itemFilter: {
                        minStats: {
                            value: 10,
                        },
                    },
                },
                {
                    id: '2',
                    itemCount: 4,
                    itemFilter: {
                        itemType: ItemTypes.Plank,
                        minStats: {
                            value: 10,
                        },
                    },
                },
            ],
        }

        const quest: QuestState = {
            id: getUniqueId(),
            state: QuestStatus.AVAILABLE,
            templateId: 'kill-n',
            parameters: { 'param-1': 'Test' },
            expandedOutcome: 'k',
            outcomeData: {
                ids: ['k', 'c'],
                entries: {
                    k: kill,
                    c: collect,
                },
            },
        }

        return quest
    }
}
