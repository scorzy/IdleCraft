import { DamageData } from '../../items/Item'

export const sumDamage = (damage: DamageData) => Object.values(damage).reduce((a, b) => a + b)
