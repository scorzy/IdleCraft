import { Msg } from '../msg/Msg'
import { Effects } from '../effects/types/Effects'

export const oppositeEffects: { first: Effects[]; second: Effects[] }[] = [
    {
        first: [Effects.Health, Effects.RegenHealth, Effects.MaxHealth],
        second: [Effects.DamageHealth, Effects.DamageRegenHealth],
    },
    {
        first: [Effects.Mana, Effects.RegenMana, Effects.MaxMana],
        second: [Effects.DamageMana, Effects.DamageRegenMana],
    },
    {
        first: [Effects.Stamina, Effects.RegenStamina, Effects.MaxStamina],
        second: [Effects.DamageStamina, Effects.DamageRegenStamina],
    },
]

export interface AlchemyEffectDataEntry {
    nameId1: keyof Msg
    nameId2: keyof Msg
    nameId3?: keyof Msg
    instant: boolean
    descId: keyof Msg
}
export const alchemyEffectData: Record<Effects, AlchemyEffectDataEntry> = {
    [Effects.Health]: { nameId1: 'Restore', nameId2: 'Health', instant: true, descId: 'RestoreHealth' },
    [Effects.RegenHealth]: { nameId1: 'Restore', nameId2: 'Health', instant: false, descId: 'RegenHealth' },
    [Effects.Mana]: { nameId1: 'Restore', nameId2: 'Mana', instant: true, descId: 'RestoreMana' },
    [Effects.RegenMana]: { nameId1: 'Restore', nameId2: 'Mana', instant: false, descId: 'RegenMana' },
    [Effects.Stamina]: { nameId1: 'Restore', nameId2: 'Stamina', instant: true, descId: 'RestoreStamina' },
    [Effects.RegenStamina]: { nameId1: 'Restore', nameId2: 'Stamina', instant: false, descId: 'RegenStamina' },
    [Effects.DamageHealth]: { nameId1: 'Damage', nameId2: 'Health', instant: true, descId: 'DamageHealth' },
    [Effects.DamageRegenHealth]: {
        nameId1: 'Damage',
        nameId2: 'Health',
        instant: false,
        descId: 'DamageRegenHealth',
    },
    [Effects.DamageMana]: { nameId1: 'Damage', nameId2: 'Mana', instant: true, descId: 'DamageMana' },
    [Effects.DamageRegenMana]: { nameId1: 'Damage', nameId2: 'Mana', instant: false, descId: 'DamageRegenMana' },
    [Effects.DamageStamina]: { nameId1: 'Damage', nameId2: 'Stamina', instant: true, descId: 'DamageStamina' },
    [Effects.DamageRegenStamina]: {
        nameId1: 'Damage',
        nameId2: 'Stamina',
        instant: false,
        descId: 'DamageRegenStamina',
    },
    [Effects.MaxHealth]: {
        nameId1: 'IncreaseMaxHealthBy',
        nameId2: 'IncreaseMaxHealthBy2',
        instant: false,
        descId: 'IncreaseMaxHealth',
    },
    [Effects.MaxMana]: {
        nameId1: 'IncreaseMaxManaBy',
        nameId2: 'IncreaseMaxManaBy2',
        instant: false,
        descId: 'IncreaseMaxMana',
    },
    [Effects.MaxStamina]: {
        nameId1: 'IncreaseMaxManaBy',
        nameId2: 'IncreaseMaxManaBy2',
        instant: false,
        descId: 'IncreaseMaxMana',
    },
}
