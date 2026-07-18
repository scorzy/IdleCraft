import { beforeEach, describe, expect, it } from 'vitest'
import { PLAYER_ID } from '../../characters/charactersConst'
import { CharTemplateEnum } from '../../characters/templates/characterTemplateEnum'
import { createEnemies } from '../../characters/functions/createEnemies'
import { ActivityTypes } from '../../activities/ActivityState'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { startTimer } from '../../timers/startTimer'
import { CastCharAbilityAdapter } from '../abilityAdapters'
import { endBattle } from './endBattle'

describe('endBattle', () => {
    let state: GameState

    beforeEach(() => {
        initialize()
        state = GetInitialGameState()
        createEnemies(state, [{ quantity: 2, template: CharTemplateEnum.Wolf }])
    })

    it('removes all enemy characters but keeps the player', () => {
        endBattle(state)

        expect(state.characters.ids).toEqual([PLAYER_ID])
    })

    it('clears the casting-abilities collection', () => {
        CastCharAbilityAdapter.create(state.castCharAbility, {
            id: 'cast-1',
            abilityId: 'NormalAttack' as never,
            characterId: PLAYER_ID,
        })

        endBattle(state)

        expect(state.castCharAbility.ids).toHaveLength(0)
    })

    it('removes pending ability timers but keeps unrelated timers', () => {
        startTimer(state, 1000, ActivityTypes.Ability, 'ability-timer-act')
        startTimer(state, 1000, ActivityTypes.Woodcutting, 'wood-timer-act')

        endBattle(state)

        const remainingTypes = state.timers.ids.map((id) => state.timers.entries[id]!.type)
        expect(remainingTypes).not.toContain(ActivityTypes.Ability)
        expect(remainingTypes).toContain(ActivityTypes.Woodcutting)
    })

    it('adds an end battle log entry', () => {
        endBattle(state)

        expect(state.battleLogs.ids.length).toBeGreaterThan(0)
    })
})
