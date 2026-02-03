import { CharTemplateEnum } from '../../characters/templates/characterTemplateEnum'
import { GameState } from '../../game/GameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { Icons } from '../../icons/Icons'
import { ItemTypes } from '../../items/Item'
import { selectTranslations } from '../../msg/useTranslations'
import { getUniqueId } from '../../utils/getUniqueId'
import { QuestAdapter, QuestOutcome, QuestState, QuestStatus } from '../QuestTypes'
import { BaseQuestTemplate } from './BaseQuestTemplate'

export class TestQuestTemplate extends BaseQuestTemplate {
    nextQuestId = 'kill-n'
    id = 'kill-n'
    getName = (questId: string) => (state: GameState) =>
        selectTranslations(state).fun.testQuestName(QuestAdapter.selectEx(state.quests, questId).parameters)

    getDescription = (questId: string) => (state: GameState) =>
        selectTranslations(state).fun.testQuestDesc(QuestAdapter.selectEx(state.quests, questId).parameters)

    getIcon = (_questId: string) => (_state: GameState) => Icons.Skull
    getOutcomeTitle: (questId: string, outcomeId: string) => (state: GameState) => string =
        (_questId, outcomeId) => (_state) => {
            if (outcomeId === 'k') return 'Kill'
            else return 'Collect'
        }
    getOutcomeDescription = (questId: string, outcomeId: string) => (state: GameState) => {
        const f = selectTranslations(state).fun
        if (outcomeId === 'k') return f.testOutcomeDesc(QuestAdapter.selectEx(state.quests, questId).parameters)
        else return f.testOutcome2Desc(QuestAdapter.selectEx(state.quests, questId).parameters)
    }

    generateQuestData = (_state: GameState) => {
        const kill: QuestOutcome = {
            id: 'k',
            location: GameLocations.StartVillage,
            goldReward: 100,
            itemsRewards: [{ itemId: 'DeadBoar', quantity: 10 }],
            targets: [
                {
                    targetId: CharTemplateEnum.Boar,
                    targetCount: 5,
                    killedCount: 0,
                },
            ],
        }

        const value = 5 + Math.floor(Math.random() * 10)
        const itemCount = 5 + Math.floor(Math.random() * 10)
        const itemCount2 = 5 + Math.floor(Math.random() * 10)

        const collect: QuestOutcome = {
            id: 'c',
            location: GameLocations.StartVillage,
            goldReward: 100,
            itemsRewards: [{ itemId: 'TinOre', quantity: 10 }],
            reqItems: [
                {
                    id: '1',
                    itemCount,
                    itemFilter: {
                        minStats: {
                            value,
                        },
                    },
                },
                {
                    id: '2',
                    itemCount: itemCount2,
                    itemFilter: {
                        itemType: ItemTypes.Plank,
                        minStats: {
                            value,
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
