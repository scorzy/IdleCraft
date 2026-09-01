import { describe, expect, it } from 'vitest'
import { WEAPON_DAMAGE_PER_LEVEL } from '../const'
import { PLAYER_ID } from './charactersConst'
import { EquipSlotsEnum } from './equipSlotsEnum'
import { ExpEnum } from '../experience/ExpEnum'
import { GetInitialGameState } from '../game/InitialGameState'
import { Icons } from '../icons/Icons'
import { DamageTypes, Item, ItemType, WeaponType } from '../items/Item'
import { ItemAdapter } from '../storage/ItemAdapter'
import { makeCharacterSelector } from './makeCharacterSelector'

const makeWeapon = (id: string, expType: ExpEnum, weaponType: WeaponType, slot: EquipSlotsEnum): Item => ({
    id,
    nameId: 'NormalAttack',
    icon: Icons.Dagger,
    type: ItemType.Weapon,
    weaponType,
    equipSlot: slot,
    value: 0,
    volume: 0,
    weaponData: {
        expType,
        attackSpeed: 1000,
        damage: { [DamageTypes.Slashing]: 100 },
    },
})

describe('makeCharacterSelector damage', () => {
    it.each([
        [ExpEnum.OneHanded, WeaponType.OneHand, EquipSlotsEnum.MainHand],
        [ExpEnum.TwoHanded, WeaponType.TwoHands, EquipSlotsEnum.TwoHand],
    ])('increases %s weapon damage by 1%% per level', (expType, type, slot) => {
        const state = GetInitialGameState()
        const weapon = makeWeapon(`C_weapon-${expType}`, expType, type, slot)
        ItemAdapter.create(state.craftedItems, weapon)
        state.characters.entries[PLAYER_ID]!.inventory = { [slot]: { itemId: weapon.id } }
        state.characters.entries[PLAYER_ID]!.skillsLevel[expType] = 10

        const result = makeCharacterSelector(PLAYER_ID).damage[DamageTypes.Slashing].DamageList(state)

        expect(result.total).toBeCloseTo(100 * (1 + (10 * WEAPON_DAMAGE_PER_LEVEL) / 100))
        expect(result.bonuses).toContainEqual(expect.objectContaining({ id: expType, multi: 10 }))
    })
})
