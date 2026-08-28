import { DamageTypes } from '../items/Item'

/** Effectiveness in basis points: 10_000 is 100%. */
export const WEAPON_COATING_EFFECTIVENESS_BPS: Record<DamageTypes, number> = {
    [DamageTypes.Piercing]: 12_000,
    [DamageTypes.Slashing]: 10_000,
    [DamageTypes.Bludgeoning]: 8_000,
}

export const DEFAULT_POISON_CHARGES = 10
export const DEFAULT_POISON_DURATION = 10e3
