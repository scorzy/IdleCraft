import { beforeEach, describe, expect, it } from 'vitest'
import { AbilityLog } from '../../battleLog/battleLogInterfaces'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { Icons } from '../../icons/Icons'
import { DamageTypes } from '../../items/Item'
import { PLAYER_ID } from '../charactersConst'
import { CharTemplateEnum } from '../templates/characterTemplateEnum'
import { createEnemies } from './createEnemies'
import { dealDamage } from './dealDamage'

const abilityLog: AbilityLog = {
    iconId: Icons.Punch,
    source: 'Player',
    targets: 'Wolf',
    abilityId: 'NormalAttack',
}

describe('dealDamage', () => {
    let state: GameState
    let enemyId: string

    beforeEach(() => {
        initialize()
        state = GetInitialGameState()
        createEnemies(state, [{ quantity: 1, template: CharTemplateEnum.Wolf }])
        enemyId = state.characters.ids.find((id) => id !== PLAYER_ID)!
    })

    it('reduces the target health by the mitigated damage amount', () => {
        const before = state.characters.entries[enemyId]!.health

        const result = dealDamage(state, enemyId, { [DamageTypes.Slashing]: 10 }, abilityLog)

        expect(state.characters.entries[enemyId]!.health).toBeLessThan(before)
        expect(result.damageDone).toBeGreaterThan(0)
        expect(result.killed).toBe(false)
    })

    it('kills the target and reports killed when health drops to zero', () => {
        const result = dealDamage(state, enemyId, { [DamageTypes.Slashing]: 1e9 }, abilityLog)

        expect(result.killed).toBe(true)
        expect(state.characters.ids).not.toContain(enemyId)
    })

    it('records a damage battle log entry', () => {
        dealDamage(state, enemyId, { [DamageTypes.Slashing]: 5 }, abilityLog)

        expect(state.battleLogs.ids.length).toBeGreaterThan(0)
    })

    it('applies multiple damage types cumulatively', () => {
        const single = (() => {
            const s = GetInitialGameState()
            createEnemies(s, [{ quantity: 1, template: CharTemplateEnum.Wolf }])
            const id = s.characters.ids.find((i) => i !== PLAYER_ID)!
            const before = s.characters.entries[id]!.health
            dealDamage(s, id, { [DamageTypes.Slashing]: 5 }, abilityLog)
            return before - s.characters.entries[id]!.health
        })()

        const before = state.characters.entries[enemyId]!.health
        dealDamage(state, enemyId, { [DamageTypes.Slashing]: 5, [DamageTypes.Piercing]: 5 }, abilityLog)
        const totalLoss = before - state.characters.entries[enemyId]!.health

        expect(totalLoss).toBeGreaterThan(single)
    })
})
