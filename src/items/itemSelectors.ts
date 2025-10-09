import moize from 'moize'
import { useCallback } from 'react'
import { CharacterAdapter } from '../characters/characterAdapter'
import { PLAYER_ID } from '../characters/charactersConst'
import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { GameState } from '../game/GameState'
import { selectTranslations } from '../msg/useTranslations'
import { Msg, MsgFunctions } from '../msg/Msg'
import { useGameStore } from '../game/state'
import { Item, ItemFilter } from './Item'
import { selectItemName } from './selectItemName'

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

    ;[
        filter.craftingData,
        filter.woodAxeData,
        filter.craftingWoodAxeData,
        filter.craftingPickaxeData,
        filter.pickaxeData,
        filter.weaponData,
        filter.armourData,
    ].forEach((dataFilter) => {
        if (!dataFilter) return true
        for (const kv of Object.entries(dataFilter)) {
            const itemKey = kv[0] as keyof Item
            if (item[itemKey] === undefined || item[itemKey] < kv[1]) return false
        }
    })

    const dataFilter = [
        (a: Item | ItemFilter) => a.craftingData,
        (a: Item | ItemFilter) => a.woodAxeData,
        (a: Item | ItemFilter) => a.craftingWoodAxeData,
        (a: Item | ItemFilter) => a.craftingPickaxeData,
        (a: Item | ItemFilter) => a.pickaxeData,
        (a: Item | ItemFilter) => a.weaponData,
        (a: Item | ItemFilter) => a.armourData,
    ]
    if (
        !filter.craftingData &&
        !filter.woodAxeData &&
        !filter.craftingWoodAxeData &&
        !filter.craftingPickaxeData &&
        !filter.pickaxeData &&
        !filter.weaponData &&
        !filter.armourData
    ) {
        return true
    }

    for (const fn of dataFilter) {
        const filterData = fn(filter)
        if (!filterData) continue
        const itemData = fn(item)
        if (!itemData) return false

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
    (
        nameFunc: keyof MsgFunctions | undefined,
        itemNameId: keyof Msg,
        params: Record<string, unknown> | undefined,
        t: ReturnType<typeof selectTranslations>
    ) => {
        const fn = t.fun[nameFunc ?? 'getItemName'] as (...args: unknown[]) => string

        if (fn) return fn(itemNameId, params)
        return t.t[itemNameId] ?? itemNameId
    },
    { maxSize: 100 }
)
export const useItemName = (item: Item | undefined | string | null) => {
    return useGameStore(useCallback((state: GameState) => selectItemName(state, item), [item]))
}
