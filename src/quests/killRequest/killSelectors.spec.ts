import { beforeEach, describe, expect, it } from 'vitest'
import { CharTemplateEnum } from '../../characters/templates/characterTemplateEnum'
import { GameLocations } from '../../gameLocations/GameLocations'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { QuestAdapter, QuestState, QuestStatus } from '../QuestTypes'
import { isKillingReq, KillQuestRequestSelectors, selectQuestTargets } from './killSelectors'

const QUEST_ID = 'quest-1'
const OUTCOME_ID = 'outcome-1'

const buildQuest = (killedCount: number, targetCount: number): QuestState => ({
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
                targets: [{ targetId: CharTemplateEnum.Wolf, targetCount, killedCount }],
            },
        },
    },
})

describe('killSelectors', () => {
    let state: GameState

    beforeEach(() => {
        state = GetInitialGameState()
    })

    it('isKillingReq is true when the outcome has targets', () => {
        QuestAdapter.create(state.quests, buildQuest(0, 3))
        expect(isKillingReq(state, QUEST_ID, OUTCOME_ID)).toBe(true)
    })

    it('isKillingReq is false when the outcome has no targets', () => {
        const quest = buildQuest(0, 3)
        quest.outcomeData.entries[OUTCOME_ID]!.targets = undefined
        QuestAdapter.create(state.quests, quest)
        expect(isKillingReq(state, QUEST_ID, OUTCOME_ID)).toBe(false)
    })

    it('selectQuestTargets returns the target list', () => {
        QuestAdapter.create(state.quests, buildQuest(1, 3))
        expect(selectQuestTargets(state, QUEST_ID, OUTCOME_ID)).toEqual([
            { targetId: CharTemplateEnum.Wolf, targetCount: 3, killedCount: 1 },
        ])
    })

    describe('KillQuestRequestSelectors.isCompleted', () => {
        it('is false while the kill count is below target', () => {
            QuestAdapter.create(state.quests, buildQuest(2, 3))
            expect(KillQuestRequestSelectors.isCompleted(QUEST_ID, OUTCOME_ID)(state)).toBe(false)
        })

        it('is true once every target has been reached', () => {
            QuestAdapter.create(state.quests, buildQuest(3, 3))
            expect(KillQuestRequestSelectors.isCompleted(QUEST_ID, OUTCOME_ID)(state)).toBe(true)
        })

        it('is true when there are no targets to satisfy', () => {
            const quest = buildQuest(0, 3)
            quest.outcomeData.entries[OUTCOME_ID]!.targets = undefined
            QuestAdapter.create(state.quests, quest)
            expect(KillQuestRequestSelectors.isCompleted(QUEST_ID, OUTCOME_ID)(state)).toBe(true)
        })
    })
})
