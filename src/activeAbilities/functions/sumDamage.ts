import { DamageData } from '../../items/Item'
import { myMemoize } from '../../utils/myMemoize'

export const sumDamage = myMemoize(function sumDamage(damage: DamageData): number {
    return Object.values(damage).reduce((a, b) => a + b)
})
