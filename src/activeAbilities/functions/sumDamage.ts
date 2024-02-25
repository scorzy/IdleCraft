import { DamageData } from '../../items/Item'
import { memoize } from '../../utils/memoize'

export const sumDamage = memoize(function sumDamage(damage: DamageData): number {
    return Object.values(damage).reduce((a, b) => a + b)
})
