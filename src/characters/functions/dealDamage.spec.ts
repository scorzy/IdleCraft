import { beforeEach, describe, expect, it } from 'vitest'
import { AbilityLog } from '../../battleLog/battleLogInterfaces'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { Icons } from '../../icons/Icons'
import { ArmourType, DamageTypes, EquipmentSlot, Item, ItemType } from '../../items/Item'
import { ItemAdapter } from '../../storage/ItemAdapter'
import { ExpEnum } from '../../experience/ExpEnum'
import { PLAYER_ID } from '../charactersConst'
import { EquipSlotsEnum } from '../equipSlotsEnum'
import { createEnemies } from './createEnemies'
import { dealDamage } from './dealDamage'

const abilityLog: AbilityLog = {
    iconId: Icons.Punch,
    source: 'Player',
    targets: 'Wolf',
    abilityId: 'NormalAttack',
}

const makeArmour = (
    id: string,
    armourType: ArmourType,
    equipmentSlot: EquipmentSlot,
    equipSlot: EquipSlotsEnum
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
    armourData: {},
})

describe('dealDamage', () => {
    let state: GameState
    let enemyId: string

    beforeEach(() => {
        initialize()
        state = GetInitialGameState()
        createEnemies(state, [{ quantity: 1, template: 'Wolf' }])
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
            createEnemies(s, [{ quantity: 1, template: 'Wolf' }])
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

    it('awards fractional armour XP once per equipped piece from total health damage', () => {
        const light = makeArmour('C_light', ArmourType.Light, EquipmentSlot.Head, EquipSlotsEnum.Head)
        const medium = makeArmour('C_medium', ArmourType.Medium, EquipmentSlot.Body, EquipSlotsEnum.Body)
        const heavy = makeArmour('C_heavy', ArmourType.Heavy, EquipmentSlot.Legs, EquipSlotsEnum.Legs)
        ItemAdapter.create(state.craftedItems, light)
        ItemAdapter.create(state.craftedItems, medium)
        ItemAdapter.create(state.craftedItems, heavy)
        state.characters.entries[PLAYER_ID]!.inventory = {
            [EquipSlotsEnum.Head]: { itemId: light.id },
            [EquipSlotsEnum.Body]: { itemId: medium.id },
            [EquipSlotsEnum.Legs]: { itemId: heavy.id },
        }

        dealDamage(state, PLAYER_ID, { [DamageTypes.Slashing]: 2, [DamageTypes.Piercing]: 3 }, abilityLog)
        dealDamage(state, PLAYER_ID, { [DamageTypes.Slashing]: 2, [DamageTypes.Piercing]: 3 }, abilityLog)

        const player = state.characters.entries[PLAYER_ID]!
        expect(player.skillsExp[ExpEnum.LightArmour]).toBeCloseTo(0.5)
        expect(player.skillsExp[ExpEnum.MediumArmour]).toBeCloseTo(1)
        expect(player.skillsExp[ExpEnum.HeavyArmour]).toBeCloseTo(1.5)
        expect(player.skillsExp[ExpEnum.Archery]).toBeUndefined()
    })

    it('does not award armour XP to enemies', () => {
        const armour = makeArmour('C_enemy-heavy', ArmourType.Heavy, EquipmentSlot.Head, EquipSlotsEnum.Head)
        ItemAdapter.create(state.craftedItems, armour)
        state.characters.entries[enemyId]!.inventory = { [EquipSlotsEnum.Head]: { itemId: armour.id } }

        dealDamage(state, enemyId, { [DamageTypes.Slashing]: 5 }, abilityLog)

        expect(state.characters.entries[enemyId]!.skillsExp[ExpEnum.HeavyArmour]).toBeUndefined()
    })
})
