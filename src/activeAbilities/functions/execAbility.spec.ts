import { beforeEach, describe, expect, it } from 'vitest'
import { ActivityAdapter } from '../../activities/ActivityState'
import { PLAYER_ID } from '../../characters/charactersConst'
import { CharTemplateEnum } from '../../characters/templates/characterTemplateEnum'
import { createEnemies } from '../../characters/functions/createEnemies'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { BattleZoneEnum } from '../../battle/BattleZoneEnum'
import { makeBattle } from '../../battle/functions/addBattle'
import { AbilitiesEnum } from '../abilitiesEnum'
import { execAbility } from './execAbility'

describe('execAbility', () => {
    let state: GameState

    beforeEach(() => {
        initialize()
        state = GetInitialGameState()
    })

    it('executes the ability and queues the caster next turn when the battle continues', () => {
        makeBattle(BattleZoneEnum.Wolf)(state)
        state.activityId = state.activities.ids[0]!
        createEnemies(state, [{ quantity: 2, template: CharTemplateEnum.Wolf }])

        execAbility(state, AbilitiesEnum.NormalAttack, PLAYER_ID)

        expect(state.battleLogs.ids.length).toBeGreaterThan(0)
        expect(state.characters.ids.length).toBeGreaterThan(1)
    })

    it('ends the battle and clears enemies when the last enemy dies', () => {
        makeBattle(BattleZoneEnum.Wolf)(state)
        const battleId = state.activities.ids[0]!
        state.activityId = battleId

        createEnemies(state, [{ quantity: 1, template: CharTemplateEnum.Chicken }])
        const enemyId = state.characters.ids.find((id) => id !== PLAYER_ID)!
        state.characters.entries[enemyId]!.health = 1

        execAbility(state, AbilitiesEnum.ChargedAttack, PLAYER_ID)

        expect(state.characters.ids).toEqual([PLAYER_ID])
        expect(state.castCharAbility.ids).toHaveLength(0)
        expect(ActivityAdapter.select(state.activities, battleId)).toBeDefined()
    })

    it('does nothing further when there is no active activity', () => {
        state.activityId = null
        createEnemies(state, [{ quantity: 1, template: CharTemplateEnum.Wolf }])

        expect(() => execAbility(state, AbilitiesEnum.NormalAttack, PLAYER_ID)).not.toThrow()
    })
})
