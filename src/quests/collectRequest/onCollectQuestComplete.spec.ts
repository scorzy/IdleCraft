import { beforeEach, describe, expect, it } from 'vitest'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { ItemTypes } from '../../items/Item'
import { QuestAdapter, QuestState, QuestStatus } from '../QuestTypes'
import { onCollectQuestComplete } from './onCollectQuestComplete'

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
                        itemFilter: { itemType: ItemTypes.Plank },
                        selectedItem1: 'OakPlank',
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

describe('onCollectQuestComplete', () => {
    let state: GameState

    beforeEach(() => {
        state = GetInitialGameState()
        QuestAdapter.create(state.quests, buildQuest())
    })

    it('does nothing when the outcome has no reqItems', () => {
        const quest = buildQuest()
        quest.id = 'quest-no-req'
        quest.outcomeData.entries[OUTCOME_ID]!.reqItems = undefined
        QuestAdapter.create(state.quests, quest)
        setStorage(state, { OakPlank: 10 })

        onCollectQuestComplete(state, 'quest-no-req', OUTCOME_ID)

        const storage = GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).storage
        expect(storage.entries['OakPlank']!.quantity).toBe(10)
    })

    it('removes the full required quantity from storage when enough is available', () => {
        setStorage(state, { OakPlank: 10 })

        onCollectQuestComplete(state, QUEST_ID, OUTCOME_ID)

        const storage = GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).storage
        expect(storage.entries['OakPlank']!.quantity).toBe(5)
    })

    it('removes only what is available when storage has less than required', () => {
        setStorage(state, { OakPlank: 3 })

        onCollectQuestComplete(state, QUEST_ID, OUTCOME_ID)

        const storage = GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).storage
        expect(storage.entries['OakPlank']).toBeUndefined()
    })
})
