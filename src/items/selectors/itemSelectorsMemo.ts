import { memoize } from 'micro-memoize'
import { GetItemNameParams } from '../../msg/GetItemNameParams'
import { MsgFunctions } from '../../msg/MsgFunctions'
import { selectTranslations } from '../../msg/useTranslations'

export const selectItemNameMemoized = memoize(
    (nameFunc: keyof MsgFunctions | undefined, params: GetItemNameParams, t: ReturnType<typeof selectTranslations>) => {
        const fn = t.fun[nameFunc ?? 'getItemName'] as (...args: unknown[]) => string

        if (fn) return fn(params)
        return t.t[params.itemNameId] ?? params.itemNameId
    },
    { maxSize: 100 }
)
