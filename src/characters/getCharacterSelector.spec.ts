import { beforeEach, describe, expect, it } from 'vitest'
import { initialize } from '../game/functions/initialize'
import { GetInitialGameState } from '../game/InitialGameState'
import { ExpEnum } from '../experience/ExpEnum'
import { Icons } from '../icons/Icons'
import { ArmourType, DamageTypes, EquipmentSlot, Item, ItemType, WeaponType } from '../items/Item'
import { ItemAdapter } from '../storage/ItemAdapter'
import { getCharacterSelector } from './getCharacterSelector'
import { EquipSlotsEnum } from './equipSlotsEnum'
import { getCharacterDefinition } from './templates/characterRegistry'
import { generateCharacter } from './templates/generateCharacter'

describe('getCharacterSelector', () => {
    beforeEach(() => initialize())

    it('calculates combat values for a generated character outside game state', () => {
        const state = GetInitialGameState()
        const preview = generateCharacter('Chicken', getCharacterDefinition('Chicken'))
        const selector = getCharacterSelector(preview.id, preview)

        expect(selector.Name(state)).toBe('Chicken')
        expect(selector.AllAttackDamage(state)).toEqual({ [DamageTypes.Piercing]: 2 })
        expect(selector.AttackSpeed(state)).toBe(3_000)
        expect(selector.MainWeapon(state)?.id).toBe('ChickenBaseWeapon')
        expect(selector.MainWeapon(state)).toBe(selector.MainWeapon(state))
        expect(selector.armour[DamageTypes.Slashing].Armour(state)).toBe(0)
    })

    it('uses base stats until a weapon or armour is equipped', () => {
        const state = GetInitialGameState()
        const definition = getCharacterDefinition('Chicken')
        const baseStats = definition.baseStats!
        const defense = baseStats.defense
        baseStats.defense = { [DamageTypes.Slashing]: 10 }

        try {
            const preview = generateCharacter('Chicken', definition)
            const selector = getCharacterSelector(preview.id, preview)

            expect(selector.armour[DamageTypes.Slashing].Armour(state)).toBe(10)

            const weapon: Item = {
                id: 'C_testWeapon',
                nameId: 'NormalAttack',
                icon: Icons.Dagger,
                type: ItemType.Weapon,
                weaponType: WeaponType.TwoHands,
                value: 0,
                volume: 0,
                weaponData: {
                    attackSpeed: 1_000,
                    expType: ExpEnum.TwoHanded,
                    damage: { [DamageTypes.Slashing]: 20 },
                },
            }
            const armour: Item = {
                id: 'C_testArmour',
                nameId: 'Armour',
                icon: Icons.Breastplate,
                type: ItemType.Armour,
                armourType: ArmourType.Light,
                equipmentSlot: EquipmentSlot.Head,
                value: 0,
                volume: 0,
                armourData: { [DamageTypes.Slashing]: 4 },
            }
            ItemAdapter.create(state.craftedItems, weapon)
            ItemAdapter.create(state.craftedItems, armour)
            preview.inventory = {
                [EquipSlotsEnum.TwoHand]: { itemId: weapon.id },
                [EquipSlotsEnum.Head]: { itemId: armour.id },
            }

            expect(selector.AllAttackDamage(state)).toEqual({ [DamageTypes.Slashing]: 20 })
            expect(selector.AttackSpeed(state)).toBe(1_000)
            expect(selector.armour[DamageTypes.Slashing].Armour(state)).toBe(4)
        } finally {
            baseStats.defense = defense
        }
    })
})
