import { beforeEach, describe, expect, it } from 'vitest'
import { PLAYER_ID } from '../../characters/charactersConst'
import { CharTemplateEnum } from '../../characters/templates/characterTemplateEnum'
import { createEnemies } from '../../characters/functions/createEnemies'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { Timer } from '../../timers/Timer'
import { ActivityTypes } from '../../activities/ActivityState'
import { AbilitiesEnum } from '../abilitiesEnum'
import { CastCharAbilityAdapter } from '../abilityAdapters'
import { execAbilityTimer } from './execAbilityTimer'

describe('execAbilityTimer', () => {
    let state: GameState

    beforeEach(() => {
        initialize()
        state = GetInitialGameState()
        createEnemies(state, [{ quantity: 1, template: CharTemplateEnum.Wolf }])
    })

    it('does nothing when the cast entry no longer exists', () => {
        const timer: Timer = { id: 't1', from: 0, to: 100, type: ActivityTypes.Ability, actId: 'missing' }

        expect(() => execAbilityTimer(state, timer)).not.toThrow()
        expect(state.battleLogs.ids).toHaveLength(0)
    })

    it('removes the cast entry and executes the ability', () => {
        CastCharAbilityAdapter.create(state.castCharAbility, {
            id: 'cast-1',
            abilityId: AbilitiesEnum.NormalAttack,
            characterId: PLAYER_ID,
        })
        const timer: Timer = { id: 't1', from: 0, to: 100, type: ActivityTypes.Ability, actId: 'cast-1' }

        execAbilityTimer(state, timer)

        expect(state.castCharAbility.ids).not.toContain('cast-1')
        expect(state.battleLogs.ids.length).toBeGreaterThan(0)
    })
})
