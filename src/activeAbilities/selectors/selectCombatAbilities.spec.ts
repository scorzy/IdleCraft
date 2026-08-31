import { describe, expect, it } from 'vitest'
import { AbilitiesEnum } from '../abilitiesEnum'
import { getCombatRotation } from './selectCombatAbilities'

describe('getCombatRotation', () => {
    it('preserves the configured ability order', () => {
        expect(getCombatRotation([AbilitiesEnum.NormalAttack, AbilitiesEnum.ChargedAttack])).toEqual([
            AbilitiesEnum.NormalAttack,
            AbilitiesEnum.ChargedAttack,
        ])
    })

    it('falls back to normal attack for an empty rotation', () => {
        expect(getCombatRotation([])).toEqual([AbilitiesEnum.NormalAttack])
    })
})
