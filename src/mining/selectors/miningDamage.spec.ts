import { describe, expect, it } from 'vitest'
import { PLAYER_ID } from '../../characters/charactersConst'
import { ExpEnum } from '../../experience/ExpEnum'
import { GetInitialGameState } from '../../game/InitialGameState'
import { MINING_DAMAGE_PER_LEVEL } from '../MiningConst'
import { selectMiningDamageAll } from './miningDamage'

describe('selectMiningDamageAll', () => {
    it('increases damage by 1% per Mining level', () => {
        const state = GetInitialGameState()
        const baseDamage = selectMiningDamageAll(state).total
        state.characters.entries[PLAYER_ID]!.skillsLevel[ExpEnum.Mining] = 10

        const result = selectMiningDamageAll(state)

        expect(result.total).toBeCloseTo(baseDamage * (1 + (10 * MINING_DAMAGE_PER_LEVEL) / 100))
        expect(result.bonuses).toContainEqual(expect.objectContaining({ id: 'mining', multi: 10 }))
    })
})
