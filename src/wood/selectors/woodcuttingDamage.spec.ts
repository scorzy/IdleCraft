import { describe, expect, it } from 'vitest'
import { PLAYER_ID } from '../../characters/charactersConst'
import { ExpEnum } from '../../experience/ExpEnum'
import { GetInitialGameState } from '../../game/InitialGameState'
import { WOODCUTTING_DAMAGE_PER_LEVEL } from '../WoodConst'
import { selectWoodcuttingDamageAll } from './woodcuttingDamage'

describe('selectWoodcuttingDamageAll', () => {
    it('increases damage by 1% per Woodcutting level', () => {
        const state = GetInitialGameState()
        const baseDamage = selectWoodcuttingDamageAll(state).total
        state.characters.entries[PLAYER_ID]!.skillsLevel[ExpEnum.Woodcutting] = 10

        const result = selectWoodcuttingDamageAll(state)

        expect(result.total).toBeCloseTo(baseDamage * (1 + (10 * WOODCUTTING_DAMAGE_PER_LEVEL) / 100))
        expect(result.bonuses).toContainEqual(expect.objectContaining({ id: 'woodcutting', multi: 10 }))
    })
})
