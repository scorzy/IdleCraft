import { describe, expect, it } from 'vitest'
import { GetInitialGameState } from '../game/InitialGameState'
import { selectItemQta } from '../storage/StorageSelectors'
import { PLAYER_ID } from './charactersConst'
import { equipItem } from './characterFunctions'
import { EquipSlotsEnum } from './equipSlotsEnum'

describe('equipItem', () => {
    it('returns the equipped item to storage when the slot is cleared', () => {
        const state = GetInitialGameState()
        const player = state.characters.entries[PLAYER_ID]!
        player.inventory[EquipSlotsEnum.MainHand] = { itemId: 'OakLog' }

        equipItem(state, PLAYER_ID, EquipSlotsEnum.MainHand, null)

        expect(player.inventory[EquipSlotsEnum.MainHand]).toBeUndefined()
        expect(selectItemQta(null, 'OakLog')(state)).toBe(1)
    })
})
