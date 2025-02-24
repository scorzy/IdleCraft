import moize from 'moize'
import { DamageData, DamageTypes } from '../../items/Item'

export const multiplyDamage = moize(
    function multiplyDamage(damage: DamageData, multi: number): DamageData {
        const ret: DamageData = {}
        Object.entries(damage).forEach((kv) => {
            const type = kv[0] as DamageTypes
            ret[type] = kv[1] * multi
        })
        return ret
    },
    {
        isDeepEqual: true,
        maxSize: 30,
    }
)
