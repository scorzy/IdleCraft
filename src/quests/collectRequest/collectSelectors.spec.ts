import { beforeEach, describe, expect, it } from 'vitest'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { ItemType, CraftingType } from '../../items/Item'
import { QuestAdapter, QuestState, QuestStatus } from '../QuestTypes'
import {
    isCollectReq,
    selectCollectQuestChosenItems,
    selectCollectQuestItemValue,
    selectCollectQuestTotalQta,
    selectItemReq,
    selectQuestItemsReqIds,
} from './collectSelectors'

const QUEST_ID = 'quest-1'
const OUTCOME_ID = 'outcome-1'

const buildQuest = (): QuestState => ({
    id: QUEST_ID,
    state: QuestStatus.AVAILABLE,
    expandedOutcome: OUTCOME_ID,
    templateId: 'kill-n',
    outcomeData: {
        ids: [OUTCOME_ID],
        entries: {
            [OUTCOME_ID]: {
                id: OUTCOME_ID,
                location: GameLocations.StartVillage,
                reqItems: [
                    {
                        id: 'req-1',
                        itemCount: 5,
                        itemFilter: { itemType: ItemType.Crafting, craftingTypes: [CraftingType.Plank] },
                        selectedItem1: 'OakPlank',
                        selectedItem2: 'PinePlank',
                    },
                ],
            },
        },
    },
})

const setStorage = (state: GameState, entries: Record<string, number>) => {
    const storage = GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).storage
    storage.ids = Object.keys(entries)
    storage.entries = Object.fromEntries(
        Object.entries(entries).map(([itemId, quantity]) => [itemId, { itemId, quantity }])
    )
}

describe('collectSelectors', () => {
    let state: GameState

    beforeEach(() => {
        state = GetInitialGameState()
        QuestAdapter.create(state.quests, buildQuest())
    })

    it('isCollectReq reflects whether the outcome has reqItems', () => {
        expect(isCollectReq(state, QUEST_ID, OUTCOME_ID)).toBe(true)
    })

    it('selectQuestItemsReqIds returns all req ids', () => {
        expect(selectQuestItemsReqIds(state, QUEST_ID, OUTCOME_ID)).toEqual(['req-1'])
    })

    it('selectItemReq finds a request by id', () => {
        expect(selectItemReq(state, QUEST_ID, OUTCOME_ID, 'req-1')?.itemCount).toBe(5)
        expect(selectItemReq(state, QUEST_ID, OUTCOME_ID, 'missing')).toBeUndefined()
    })

    it('selectCollectQuestItemValue returns the selected item by index', () => {
        expect(selectCollectQuestItemValue(state, QUEST_ID, OUTCOME_ID, 'req-1', 0)).toBe('OakPlank')
        expect(selectCollectQuestItemValue(state, QUEST_ID, OUTCOME_ID, 'req-1', 1)).toBe('PinePlank')
        expect(selectCollectQuestItemValue(state, QUEST_ID, OUTCOME_ID, 'req-1', 2)).toBeUndefined()
    })

    it('selectCollectQuestTotalQta sums storage quantity matching the item filter', () => {
        setStorage(state, { OakPlank: 3 })
        expect(selectCollectQuestTotalQta(state, QUEST_ID, OUTCOME_ID, 'req-1')).toBeGreaterThanOrEqual(0)
    })

    describe('selectCollectQuestChosenItems', () => {
        it('reports the requirement as incomplete when storage has too little', () => {
            setStorage(state, { OakPlank: 2, PinePlank: 1 })

            const result = selectCollectQuestChosenItems(state, QUEST_ID, OUTCOME_ID)

            expect(result.isReqCompleted['req-1']).toBe(false)
            expect(result.usedItems).toEqual(
                expect.arrayContaining([
                    { itemId: 'OakPlank', quantity: 2 },
                    { itemId: 'PinePlank', quantity: 1 },
                ])
            )
        })

        it('reports the requirement as complete when storage has enough spread over both items', () => {
            setStorage(state, { OakPlank: 3, PinePlank: 2 })

            const result = selectCollectQuestChosenItems(state, QUEST_ID, OUTCOME_ID)

            expect(result.isReqCompleted['req-1']).toBe(true)
            const total = result.usedItems.reduce((sum, i) => sum + i.quantity, 0)
            expect(total).toBe(5)
        })

        it('caps usage at the required amount, leaving surplus unused', () => {
            setStorage(state, { OakPlank: 100 })

            const result = selectCollectQuestChosenItems(state, QUEST_ID, OUTCOME_ID)

            expect(result.isReqCompleted['req-1']).toBe(true)
            expect(result.usedItems).toEqual([{ itemId: 'OakPlank', quantity: 5 }])
        })

        it('returns an empty result when the outcome has no reqItems', () => {
            const quest = buildQuest()
            quest.id = 'quest-2'
            quest.outcomeData.entries[OUTCOME_ID]!.reqItems = undefined
            QuestAdapter.create(state.quests, quest)

            const result = selectCollectQuestChosenItems(state, 'quest-2', OUTCOME_ID)

            expect(result.usedItems).toEqual([])
            expect(result.isReqCompleted).toEqual({})
        })
    })
})
