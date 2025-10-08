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
