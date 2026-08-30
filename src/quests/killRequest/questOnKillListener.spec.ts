import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { CharacterAdapter } from '../../characters/characterAdapter'
import { createEnemies } from '../../characters/functions/createEnemies'
import { CharacterId } from '../../characters/templates/characterRegistry'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { GatheringZone } from '../../gathering/gatheringZones'
import { UnlockZoneQuest } from '../../gathering/functions/UnlockZoneQuest'
import { questOnKillListener } from './questOnKillListener'
import { QuestAdapter, QuestState, QuestStatus } from '../QuestTypes'

describe('questOnKillListener', () => {
    let state: GameState

    beforeAll(() => initialize())

    beforeEach(() => {
        state = GetInitialGameState()
    })

    function addKillQuest(targetCount = 2, location = GameLocations.StartVillage) {
        const quest: QuestState = {
            id: 'kill-quest',
            state: QuestStatus.ACCEPTED,
            templateId: 'kill-n',
            expandedOutcome: 'k',
            outcomeData: {
                ids: ['k'],
                entries: {
                    k: {
                        id: 'k',
                        location,
                        targets: [{ targetId: 'Boar', targetCount, killedCount: 0 }],
                    },
                },
            },
        }
        QuestAdapter.create(state.quests, quest)
        return quest
    }

    function createEnemy(template: CharacterId) {
        createEnemies(state, [{ quantity: 1, template }])
        return CharacterAdapter.find(state.characters, (character) => character.isEnemy)!.id
    }

    it('increments matching targets, ignores completed targets, and filters by location', () => {
        const quest = addKillQuest(2)
        const boarId = createEnemy('Boar')

        questOnKillListener(state, boarId)
        expect(quest.outcomeData.entries.k!.targets![0]!.killedCount).toBe(1)

        state.location = GameLocations.Test
        questOnKillListener(state, boarId)
        expect(quest.outcomeData.entries.k!.targets![0]!.killedCount).toBe(1)

        state.location = GameLocations.StartVillage
        quest.outcomeData.entries.k!.targets![0]!.killedCount = 2
        questOnKillListener(state, boarId)
        expect(quest.outcomeData.entries.k!.targets![0]!.killedCount).toBe(2)
    })

    it('ignores accepted quests when the killed character template does not match', () => {
        const quest = addKillQuest()
        const wolfId = createEnemy('Wolf')

        questOnKillListener(state, wolfId)

        expect(quest.outcomeData.entries.k!.targets![0]!.killedCount).toBe(0)
    })

    it('auto-completes an unlock quest and unlocks its gathering zone', () => {
        const quest = new UnlockZoneQuest().generateQuestData(state, {
            location: GameLocations.StartVillage,
            zone: GatheringZone.WolfLair,
            enemies: [{ qta: 1, templateId: 'Boar' }],
        })
        QuestAdapter.create(state.quests, quest)
        const boarId = createEnemy('Boar')

        questOnKillListener(state, boarId)

        expect(QuestAdapter.select(state.quests, quest.id)).toBeUndefined()
        expect(state.locations.entries[GameLocations.StartVillage]!.unlockedGatheringZones).toContain(
            GatheringZone.WolfLair
        )
    })
})
