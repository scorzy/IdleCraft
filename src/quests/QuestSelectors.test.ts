import { describe, test, expect } from 'vitest'
import { InitialState } from '../entityAdapter/InitialState'
import { GameState } from '../game/GameState'
import { GetInitialGameState } from '../game/InitialGameState'
import { CharTemplateEnum } from '../characters/templates/characterTemplateEnum'
import { selectFirstKillRequest } from './QuestSelectors'
import { KillQuestRequest, QuestOutcome, QuestStatus, QuestType } from './QuestTypes'

function makeState(outcomeData: InitialState<QuestOutcome>): GameState {
    return {
        ...GetInitialGameState(),
        quests: {
            ids: ['q1'],
            entries: {
                q1: {
                    id: 'q1',
                    parameters: {},
                    outcomeData,
                    templateId: 'tpl1',
                    state: QuestStatus.ACCEPTED,
                },
            },
        },
    }
}

describe('selectFirstKillRequest', () => {
    test('returns null if no outcomes', () => {
        const state = makeState({
            ids: [],
            entries: {},
        })
        expect(selectFirstKillRequest(state, 'q1')).toBeNull()
    })

    test('returns null if no kill requests', () => {
        const state = makeState({
            ids: ['out1'],
            entries: {
                out1: {
                    id: 'out1',
                    requests: { ids: ['r1'], entries: { r1: { id: 'r1', type: QuestType.COLLECT } } },
                },
            },
        })
        expect(selectFirstKillRequest(state, 'q1')).toBeNull()
    })

    test('returns null if questId not found', () => {
        const state = makeState({
            ids: [],
            entries: {},
        })
        expect(selectFirstKillRequest(state, 'q1')).toBeNull()
    })

    test('returns null if no requests', () => {
        const state = makeState({
            ids: ['out1'],
            entries: {
                out1: { id: 'out1', requests: { ids: [], entries: {} } },
            },
        })
        expect(selectFirstKillRequest(state, 'q1')).toBeNull()
    })

    test('returns null if no request isKillingQuestRequest', () => {
        const state = makeState({
            ids: ['out1'],
            entries: {
                out1: {
                    id: 'out1',
                    requests: {
                        ids: ['r1', 'r2'],
                        entries: {
                            r1: { id: 'r1', type: QuestType.COLLECT },
                            r2: { id: 'r2', type: QuestType.COLLECT },
                        },
                    },
                },
            },
        })
        expect(selectFirstKillRequest(state, 'q1')).toBeNull()
    })

    test('returns null if multiple outcomes but no kill', () => {
        const state = makeState({
            ids: ['out1', 'out2'],
            entries: {
                out1: { id: 'out1', requests: { ids: ['r1'], entries: { r1: { id: 'r1', type: QuestType.COLLECT } } } },
                out2: { id: 'out2', requests: { ids: ['r2'], entries: { r2: { id: 'r2', type: QuestType.COLLECT } } } },
            },
        })
        expect(selectFirstKillRequest(state, 'q1')).toBeNull()
    })

    test('returns null if kill request but function does not return id', () => {
        const req: KillQuestRequest = {
            id: 'r1',
            type: QuestType.KILL,
            targets: [
                {
                    targetId: CharTemplateEnum.Boar,
                    targetCount: 1,
                    killedCount: 0,
                },
            ],
        }
        const state = makeState({
            ids: ['out1'],
            entries: {
                out1: {
                    id: 'out1',
                    requests: { ids: ['r1'], entries: { r1: req } },
                },
            },
        })
        expect(selectFirstKillRequest(state, 'q1')).toBe(req)
    })
})
