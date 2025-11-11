import { Msg } from '../msg/Msg'
import { AlchemyEffects } from './alchemyTypes'

export const oppositeEffects = new Map<AlchemyEffects, AlchemyEffects[]>([
    [AlchemyEffects.Health, [AlchemyEffects.DamageHealth, AlchemyEffects.DamageRegenHealth]],
    [AlchemyEffects.Mana, [AlchemyEffects.DamageMana, AlchemyEffects.DamageRegenMana]],
    [AlchemyEffects.Stamina, [AlchemyEffects.DamageStamina, AlchemyEffects.DamageRegenStamina]],
    [AlchemyEffects.RegenHealth, [AlchemyEffects.DamageRegenHealth, AlchemyEffects.DamageHealth]],
    [AlchemyEffects.RegenMana, [AlchemyEffects.DamageRegenMana, AlchemyEffects.DamageMana]],
    [AlchemyEffects.RegenStamina, [AlchemyEffects.DamageRegenStamina, AlchemyEffects.DamageStamina]],
    [AlchemyEffects.DamageHealth, [AlchemyEffects.Health, AlchemyEffects.RegenHealth]],
    [AlchemyEffects.DamageMana, [AlchemyEffects.Mana, AlchemyEffects.RegenMana]],
    [AlchemyEffects.DamageStamina, [AlchemyEffects.Stamina, AlchemyEffects.RegenStamina]],
    [AlchemyEffects.DamageRegenHealth, [AlchemyEffects.Health, AlchemyEffects.RegenHealth]],
    [AlchemyEffects.DamageRegenMana, [AlchemyEffects.Mana, AlchemyEffects.RegenMana]],
    [AlchemyEffects.DamageRegenStamina, [AlchemyEffects.Stamina, AlchemyEffects.RegenStamina]],
])

export interface AlchemyEffectDataEntry {
    nameId1: keyof Msg
    nameId2: keyof Msg
    nameId3?: keyof Msg
    instant: boolean
    descId: keyof Msg
}
export const alchemyEffectData: Record<AlchemyEffects, AlchemyEffectDataEntry> = {
    [AlchemyEffects.Health]: { nameId1: 'Restore', nameId2: 'Health', instant: true, descId: 'RestoreHealth' },
    [AlchemyEffects.RegenHealth]: { nameId1: 'Restore', nameId2: 'Health', instant: false, descId: 'RegenHealth' },
    [AlchemyEffects.Mana]: { nameId1: 'Restore', nameId2: 'Mana', instant: true, descId: 'RestoreMana' },
    [AlchemyEffects.RegenMana]: { nameId1: 'Restore', nameId2: 'Mana', instant: false, descId: 'RegenMana' },
    [AlchemyEffects.Stamina]: { nameId1: 'Restore', nameId2: 'Stamina', instant: true, descId: 'RestoreStamina' },
    [AlchemyEffects.RegenStamina]: { nameId1: 'Restore', nameId2: 'Stamina', instant: false, descId: 'RegenStamina' },
    [AlchemyEffects.DamageHealth]: { nameId1: 'Damage', nameId2: 'Health', instant: true, descId: 'DamageHealth' },
    [AlchemyEffects.DamageRegenHealth]: {
        nameId1: 'Damage',
        nameId2: 'Health',
        instant: false,
        descId: 'DamageRegenHealth',
    },
    [AlchemyEffects.DamageMana]: { nameId1: 'Damage', nameId2: 'Mana', instant: true, descId: 'DamageMana' },
    [AlchemyEffects.DamageRegenMana]: { nameId1: 'Damage', nameId2: 'Mana', instant: false, descId: 'DamageRegenMana' },
    [AlchemyEffects.DamageStamina]: { nameId1: 'Damage', nameId2: 'Stamina', instant: true, descId: 'DamageStamina' },
    [AlchemyEffects.DamageRegenStamina]: {
        nameId1: 'Damage',
        nameId2: 'Stamina',
        instant: false,
        descId: 'DamageRegenStamina',
    },
}
