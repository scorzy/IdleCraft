import { describe, expect, test } from 'vitest'
import { GetInitialGameState } from '../game/InitialGameState'
import { CharTemplateEnum } from '../characters/templates/characterTemplateEnum'
import { GameLocations } from '../gameLocations/GameLocations'
import { ItemTypes } from '../items/Item'
import { QuestAdapter, QuestStatus } from './QuestTypes'
import { questOnItemRemove } from './QuestFunctions'

describe('Quest Functions', () => {
    test('questOnItemRemove 1', () => {
        const state = GetInitialGameState()

        const questState = {
            id: 'questId',
            state: QuestStatus.AVAILABLE,
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
                                targetId: CharTemplateEnum.Boar,
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

        state.quests = QuestAdapter.create(state.quests, questState)

        const newState = questOnItemRemove(state, 'item', state.location)

        expect(
            newState!.quests!.entries['questId']!.outcomeData!.entries['k']!.reqItems![0]!.selectedItem1
        ).toBeUndefined()

        expect(newState!.quests!.entries['questId']!.outcomeData!.entries['k']!.reqItems![0]!.selectedItem2).toEqual(
            'otherItem'
        )
    })

    test('questOnItemRemove different location', () => {
        const state = GetInitialGameState()

        const questState = {
            id: 'questId',
            state: QuestStatus.AVAILABLE,
            templateId: 'kill-n',
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
                                targetId: CharTemplateEnum.Boar,
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

        state.quests = QuestAdapter.create(state.quests, questState)

        const newState = questOnItemRemove(state, 'item', state.location)

        expect(newState!.quests!.entries['questId']!.outcomeData!.entries['k']!.reqItems![0]!.selectedItem1).toEqual(
            'item'
        )

        expect(newState!.quests!.entries['questId']!.outcomeData!.entries['k']!.reqItems![0]!.selectedItem2).toEqual(
            'otherItem'
        )
    })
})
