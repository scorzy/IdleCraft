import { DamageData, DamageTypes } from '../../items/Item'
import { memoize } from '../../utils/memoize'

export const multiplyDamage = memoize(function multiplyDamage(damage: DamageData, multi: number): DamageData {
    const ret: DamageData = {}
    Object.entries(damage).forEach((kv) => {
        const type = kv[0] as DamageTypes
        ret[type] = kv[1] * multi
    })
    return ret
})
