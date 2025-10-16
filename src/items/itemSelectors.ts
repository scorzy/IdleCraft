import moize from 'moize'
import { CharacterAdapter } from '../characters/characterAdapter'
import { PLAYER_ID } from '../characters/charactersConst'
import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { GameState } from '../game/GameState'
import { selectTranslations } from '../msg/useTranslations'
import { GetItemNameParams } from '../msg/GetItemNameParams'
import { Item, ItemFilter } from './Item'
import { MsgFunctions } from '@/msg/MsgFunctions'

export const selectEquipId =
    (slot: EquipSlotsEnum, characterId = PLAYER_ID) =>
    (state: GameState) => {
        const equipped = CharacterAdapter.selectEx(state.characters, characterId).inventory[slot]
        if (!equipped) return
        return equipped.itemId
    }

export const filterItem = (item: Item, filter: ItemFilter) => {
    if (filter.itemId && item.id !== filter.itemId) return false
    if (filter.nameId && item.nameId !== filter.nameId) return false
    if (filter.equipSlot && item.equipSlot !== filter.equipSlot) return false
    if (filter.itemType && item.type !== filter.itemType) return false
    if (filter.itemSubType && item.subType !== filter.itemSubType) return false
    if (filter.minStats)
        for (const kv of Object.entries(filter.minStats)) {
            const itemKey = kv[0] as keyof Item
            if (item[itemKey] === undefined || item[itemKey] < kv[1]) return false
        }

    if (filter.has) for (const key of filter.has) if (item[key] === undefined) return false

    for (const kv of Object.entries(filter)) {
        if (kv[0] === 'minStats' || kv[0] === 'has') continue

        const filterData = kv[1]
        if (typeof filterData !== 'object') continue
        const key = kv[0]
        const itemData = item[key as keyof Item] as object | undefined
        if (!itemData) return false
        if (typeof itemData !== 'object') continue

        for (const kv of Object.entries(filterData)) {
            const filterValue = kv[1]

            if (typeof filterValue === 'number') {
                const itemKey = kv[0] as keyof typeof itemData
                const itemValue = itemData[itemKey]
                if (typeof itemValue !== 'number') continue
                if (itemValue === undefined) return false
                if (itemValue < filterValue) return false
            } else if (typeof filterValue === 'object') {
                const itemKey = kv[0] as keyof typeof itemData
                const itemValue = itemData[itemKey]
                if (typeof itemValue !== 'object') continue
                if (itemValue === undefined) return false
            }
        }
    }

    return true
}
export const selectItemFilterObjects = moize(
    (itemFilter: ItemFilter) =>
        Object.entries(itemFilter)
            .filter((f) => typeof f[1] === 'object')
            .sort((a, b) => a[0].localeCompare(b[0])),
    {
        isDeepEqual: true,
        maxSize: 30,
    }
)
export const selectItemFilterProps = moize(
    (minStats: object) =>
        Object.entries(minStats)
            .filter((f) => typeof f[1] === 'number')
            .sort((a, b) => a[0].localeCompare(b[0])),
    {
        isDeepEqual: true,
        maxSize: 30,
    }
)

export const selectItemNameMemoized = moize(
    (nameFunc: keyof MsgFunctions | undefined, params: GetItemNameParams, t: ReturnType<typeof selectTranslations>) => {
        const fn = t.fun[nameFunc ?? 'getItemName'] as (...args: unknown[]) => string

        if (fn) return fn(params)
        return t.t[params.itemNameId] ?? params.itemNameId
    },
    { maxSize: 100 }
)
