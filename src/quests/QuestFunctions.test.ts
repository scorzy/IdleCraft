import { beforeAll, describe, expect, test } from 'vitest'
import { GameLocations } from '../gameLocations/GameLocations'
import { GetInitialGameState } from '../game/InitialGameState'
import { initialize } from '../game/functions/initialize'
import { ItemTypes } from '../items/Item'
import { GatheringZone } from '../gathering/gatheringZones'
import { UnlockZoneQuest } from '../gathering/functions/UnlockZoneQuest'
import { QuestData } from './QuestData'
import { acceptQuest, completeQuest, updateQuests } from './QuestFunctions'
import { questOnItemRemove } from './collectRequest/questOnItemRemove'
import { QuestAdapter, QuestState, QuestStatus } from './QuestTypes'
import { selectItemQta } from '../storage/StorageSelectors'

describe('Quest Functions', () => {
    beforeAll(() => initialize())

    test('questOnItemRemove 1', () => {
        const state = GetInitialGameState()

        const questState: QuestState = {
            id: 'questId',
            state: QuestStatus.AVAILABLE,
            expandedOutcome: 'k',
            templateId: 'kill-n',
            parameters: { 'param-1': 'Test' },
            outcomeData: {
                ids: ['k'],
                entries: {
                    k: {
                        id: 'k',
                        location: GameLocations.StartVillage,
                        goldReward: 100,
                        itemsRewards: [
                            { itemId: 'TinOre', quantity: 1 },
                            { itemId: 'DeadBoar', quantity: 1 },
                        ],
                        targets: [
                            {
                                targetId: 'Boar' as const,
                                targetCount: 5,
                                killedCount: 0,
                            },
                        ],
                        reqItems: [
                            {
                                id: '1',
                                itemCount: 5,
                                selectedItem1: 'item',
                                selectedItem2: 'otherItem',
                                itemFilter: {
                                    itemType: ItemTypes.Plank,
                                    minStats: {
                                        value: 10,
                                    },
                                },
                            },
                        ],
                    },
                },
            },
        }

        QuestAdapter.create(state.quests, questState)

        questOnItemRemove(state, 'item', state.location)

        expect(state.quests.entries['questId']!.outcomeData.entries['k']!.reqItems![0]!.selectedItem1).toBeUndefined()

        expect(state.quests.entries['questId']!.outcomeData.entries['k']!.reqItems![0]!.selectedItem2).toEqual(
            'otherItem'
        )
    })

    test('questOnItemRemove different location', () => {
        const state = GetInitialGameState()

        const questState = {
            id: 'questId',
            state: QuestStatus.AVAILABLE,
            templateId: 'kill-n',
            expandedOutcome: 'k',
            parameters: { 'param-1': 'Test' },
            outcomeData: {
                ids: ['k'],
                entries: {
                    k: {
                        id: 'k',
                        location: GameLocations.Test,
                        goldReward: 100,
                        itemsRewards: [
                            { itemId: 'TinOre', quantity: 1 },
                            { itemId: 'DeadBoar', quantity: 1 },
                        ],
                        targets: [
                            {
                                targetId: 'Boar' as const,
                                targetCount: 5,
                                killedCount: 0,
                            },
                        ],
                        reqItems: [
                            {
                                id: '1',
                                itemCount: 5,
                                selectedItem1: 'item',
                                selectedItem2: 'otherItem',
                                itemFilter: {
                                    itemType: ItemTypes.Plank,
                                    minStats: {
                                        value: 10,
                                    },
                                },
                            },
                        ],
                    },
                },
            },
        }

        QuestAdapter.create(state.quests, questState)

        questOnItemRemove(state, 'item', state.location)

        expect(state.quests.entries['questId']!.outcomeData.entries['k']!.reqItems![0]!.selectedItem1).toEqual('item')

        expect(state.quests.entries['questId']!.outcomeData.entries['k']!.reqItems![0]!.selectedItem2).toEqual(
            'otherItem'
        )
    })

    test('acceptQuest changes only available quests', () => {
        const state = GetInitialGameState()
        const quest = QuestData.getEx('kill-n').generateQuestData(state)
        QuestAdapter.create(state.quests, quest)

        acceptQuest(state, quest.id)
        expect(QuestAdapter.selectEx(state.quests, quest.id).state).toBe(QuestStatus.ACCEPTED)

        expect(() => acceptQuest(state, 'missing')).toThrow('Data not found missing')
        QuestAdapter.selectEx(state.quests, quest.id).state = QuestStatus.ACCEPTED
        acceptQuest(state, quest.id)
        expect(QuestAdapter.selectEx(state.quests, quest.id).state).toBe(QuestStatus.ACCEPTED)
    })

    test('completeQuest rewards an accepted outcome and creates its chained quest', () => {
        const state = GetInitialGameState()
        const quest = QuestData.getEx('kill-n').generateQuestData(state)
        quest.state = QuestStatus.ACCEPTED
        quest.outcomeData.entries.k!.targets![0]!.killedCount = 5
        QuestAdapter.create(state.quests, quest)

        completeQuest(state, quest.id, 'k')

        expect(QuestAdapter.select(state.quests, quest.id)).toBeUndefined()
        expect(state.gold).toBe(100)
        expect(selectItemQta(null, 'DeadBoar')(state)).toBe(10)
        expect(state.completedQuestTemplates).toEqual(['kill-n'])
        expect(state.ui.selectedQuestId).not.toBeNull()
        expect(QuestAdapter.selectEx(state.quests, state.ui.selectedQuestId!).templateId).toBe('kill-n')
    })

    test('completeQuest is a no-op for unavailable or incomplete outcomes', () => {
        const state = GetInitialGameState()
        const quest = QuestData.getEx('kill-n').generateQuestData(state)
        QuestAdapter.create(state.quests, quest)

        completeQuest(state, quest.id, 'k')
        expect(QuestAdapter.select(state.quests, quest.id)).toBeDefined()
        expect(state.gold).toBe(0)

        quest.state = QuestStatus.ACCEPTED
        completeQuest(state, quest.id, 'k')
        expect(QuestAdapter.select(state.quests, quest.id)).toBeDefined()
        expect(state.gold).toBe(0)
    })

    test('completing an unlock quest unlocks the zone and notifies the player', () => {
        const state = GetInitialGameState()
        const quest = new UnlockZoneQuest().generateQuestData(state, {
            location: GameLocations.StartVillage,
            zone: GatheringZone.WolfLair,
        })
        QuestAdapter.create(state.quests, quest)

        completeQuest(state, quest.id, 'defeat')

        expect(state.locations.entries[GameLocations.StartVillage]!.unlockedGatheringZones).toContain(
            GatheringZone.WolfLair
        )
        expect(state.notifications).toHaveLength(1)
        expect(state.completedQuestTemplates).toContain('UnlockZoneQuest')
    })

    test('updateQuests creates the tutorial and replenishes regular quest templates once', () => {
        const state = GetInitialGameState()

        updateQuests(state)
        const idsAfterFirstUpdate = QuestAdapter.getIds(state.quests).slice()
        updateQuests(state)

        expect(QuestAdapter.find(state.quests, (quest) => quest.templateId === 'FarmBoarTutorial')).toBeDefined()
        expect(QuestAdapter.findMany(state.quests, (quest) => quest.templateId === 'kill-n')).toHaveLength(2)
        expect(QuestAdapter.findMany(state.quests, (quest) => quest.templateId === 'SupplyQuest')).toHaveLength(2)
        expect(idsAfterFirstUpdate).toHaveLength(3)
    })
})
