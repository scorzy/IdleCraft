import { beforeEach, describe, expect, it } from 'vitest'
import { PLAYER_ID } from '../../characters/charactersConst'
import { CharacterAdapter } from '../../characters/characterAdapter'
import { AbilitiesEnum } from '../../activeAbilities/abilitiesEnum'
import { CastCharAbilityAdapter, CharAbilityAdapter } from '../../activeAbilities/abilityAdapters'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { Timer } from '../../timers/Timer'
import { ActivityTypes } from '../../activities/ActivityState'
import { BattleZoneEnum } from '../BattleZoneEnum'
import { makeBattle } from './addBattle'
import { startBattleTimer } from './startBattleTimer'

describe('startBattleTimer', () => {
    let state: GameState

    beforeEach(() => {
        initialize()
        state = GetInitialGameState()
    })

    it('throws when the activity is not a battle', () => {
        const timer: Timer = { id: 't1', from: 0, to: 0, type: ActivityTypes.StartBattle, actId: 'missing' }

        expect(() => startBattleTimer(state, timer)).toThrow()
    })

    it('creates enemies for the battle zone and starts abilities for all characters', () => {
        makeBattle(BattleZoneEnum.Wolf)(state)
        const battleId = state.activities.ids[0]!
        const timer: Timer = { id: 't1', from: 0, to: 0, type: ActivityTypes.StartBattle, actId: battleId }

        startBattleTimer(state, timer)

        const enemyIds = state.characters.ids.filter((id) => id !== PLAYER_ID)
        expect(enemyIds.length).toBeGreaterThan(0)
        expect(state.battleLogs.ids.length).toBeGreaterThan(0)
        expect(state.timers.ids.length).toBeGreaterThan(0)
    })

    it('starts the player from the first configured ability on every battle', () => {
        const player = CharacterAdapter.selectEx(state.characters, PLAYER_ID)
        CharAbilityAdapter.create(player.allCombatAbilities, {
            id: AbilitiesEnum.ChargedAttack,
            abilityId: AbilitiesEnum.ChargedAttack,
        })
        player.combatAbilities = [AbilitiesEnum.ChargedAttack, AbilitiesEnum.NormalAttack]
        player.lastCombatAbilityNum = 1
        player.lastCombatAbilityId = AbilitiesEnum.NormalAttack

        makeBattle(BattleZoneEnum.Wolf)(state)
        const battleId = state.activities.ids[0]!
        const timer: Timer = { id: 't1', from: 0, to: 0, type: ActivityTypes.StartBattle, actId: battleId }

        startBattleTimer(state, timer)

        const playerCast = CastCharAbilityAdapter.find(state.castCharAbility, (cast) => cast.characterId === PLAYER_ID)
        expect(playerCast?.abilityId).toBe(AbilitiesEnum.ChargedAttack)
        expect(player.lastCombatAbilityNum).toBe(0)
    })

    it('applies an enemy template coating before starting its first ability', () => {
        makeBattle(BattleZoneEnum.Spider)(state)
        const battleId = state.activities.ids[0]!
        const timer: Timer = { id: 't1', from: 0, to: 0, type: ActivityTypes.StartBattle, actId: battleId }

        startBattleTimer(state, timer)

        const spiderId = state.characters.ids.find((id) => id !== PLAYER_ID)!
        const spider = CharacterAdapter.selectEx(state.characters, spiderId)
        expect(spider.weaponCoating).toMatchObject({
            weaponItemId: 'SpiderBaseWeapon',
            remainingCharges: Number.POSITIVE_INFINITY,
        })
        expect(
            CastCharAbilityAdapter.find(state.castCharAbility, (cast) => cast.characterId === spiderId)
        ).toBeDefined()
    })
})
