import { describe, expect, it } from 'vitest'
import { WEAPON_DAMAGE_PER_LEVEL } from '../const'
import { PLAYER_ID } from './charactersConst'
import { EquipSlotsEnum } from './equipSlotsEnum'
import { ExpEnum } from '../experience/ExpEnum'
import { GetInitialGameState } from '../game/InitialGameState'
import { Icons } from '../icons/Icons'
import { ArmourType, DamageTypes, EquipmentSlot, Item, ItemType, WeaponType } from '../items/Item'
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

const makeArmour = (
    id: string,
    armourType: ArmourType,
    equipmentSlot: EquipmentSlot,
    equipSlot: EquipSlotsEnum,
    add: number
): Item => ({
    id,
    nameId: 'Armour',
    icon: Icons.Breastplate,
    type: ItemType.Armour,
    armourType,
    equipmentSlot,
    equipSlot,
    value: 0,
    volume: 0,
    armourData: { [DamageTypes.Slashing]: add },
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

describe('makeCharacterSelector armour', () => {
    it('applies each armour skill to only its matching armour subtotal', () => {
        const state = GetInitialGameState()
        const light = makeArmour('C_light', ArmourType.Light, EquipmentSlot.Head, EquipSlotsEnum.Head, 100)
        const medium = makeArmour('C_medium', ArmourType.Medium, EquipmentSlot.Body, EquipSlotsEnum.Body, 200)
        const heavy = makeArmour('C_heavy', ArmourType.Heavy, EquipmentSlot.Legs, EquipSlotsEnum.Legs, 300)
        ItemAdapter.create(state.craftedItems, light)
        ItemAdapter.create(state.craftedItems, medium)
        ItemAdapter.create(state.craftedItems, heavy)
        state.characters.entries[PLAYER_ID]!.inventory = {
            [EquipSlotsEnum.Head]: { itemId: light.id },
            [EquipSlotsEnum.Body]: { itemId: medium.id },
            [EquipSlotsEnum.Legs]: { itemId: heavy.id },
        }
        state.characters.entries[PLAYER_ID]!.skillsLevel = {
            [ExpEnum.LightArmour]: 5,
            [ExpEnum.MediumArmour]: 2,
            [ExpEnum.HeavyArmour]: 10,
        }

        const result = makeCharacterSelector(PLAYER_ID).armour[DamageTypes.Slashing].ArmourList(state)

        expect(result.total).toBeCloseTo(100 * 1.05 + 200 * 1.02 + 300 * 1.1)
        expect(result.bonuses).toContainEqual(expect.objectContaining({ id: ExpEnum.LightArmour, add: 5 }))
        expect(result.bonuses).toContainEqual(expect.objectContaining({ id: ExpEnum.MediumArmour, add: 4 }))
        expect(result.bonuses).toContainEqual(expect.objectContaining({ id: ExpEnum.HeavyArmour, add: 30 }))
    })
})
