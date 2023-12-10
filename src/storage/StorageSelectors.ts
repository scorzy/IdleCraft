import { GameState, LocationState } from '../game/GameState'
import { GameLocations } from '../gameLocations/GameLocations'
import { StdItems } from '../items/stdItems'
import { memoize } from '../utils/memoize'
import { memoizeOne } from '../utils/memoizeOne'
import { Entries } from '../utils/types'
import { Item, ItemTypes } from '../items/Item'
import { InitialState } from '../entityAdapter/entityAdapter'
import { selectTranslations } from '../msg/useTranslations'
import { Translations } from '../msg/Msg'
import { ItemAdapter } from './ItemAdapter'
import { ItemId, StorageState } from './storageState'

const selectStorageLocationsInt = memoizeOne((locations: { [k in GameLocations]: LocationState }) => {
    const res: GameLocations[] = []
    const locationsEntries = Object.entries(locations)
    for (const loc of locationsEntries) {
        if (Object.keys(loc[1].storage.StdItems).length > 0 || Object.keys(loc[1].storage.CraftedItems).length > 0)
            res.push(loc[0] as GameLocations)
    }
    return res
})
const selectItemInt = (
    stdItemId: string | null | undefined,
    craftItemId: string | null | undefined,
    craftedItems: InitialState<Item>
) => {
    if (stdItemId) return StdItems[stdItemId]
    if (craftItemId) return ItemAdapter.select(craftedItems, craftItemId)
}

export const selectStorageLocations = (state: GameState) => selectStorageLocationsInt(state.locations)

type ItemOrdQta = ItemId & { qta: number }

type ItemOrdName = ItemId & { name: string }

type ItemOrdValue = ItemId & { value: number }
export const selectLocationItems = memoize((location: GameLocations) => {
    const orderItems = memoizeOne((std: Record<string, number>, craft: Record<string, number>) => {
        const ret: ItemId[] = (Object.entries<number | undefined>(std) as Entries<Record<string, number>>)
            .map<ItemId>((e) => {
                return {
                    stdItemId: e[0],
                    craftItemId: null,
                }
            })
            .concat(
                Object.entries(craft).map((e) => {
                    return { stdItemId: null, craftItemId: e[0] }
                })
            )

        return ret
    })

    const reorderName = memoizeOne(function reorderName(
        craftedItems: InitialState<Item>,
        items: ItemId[],
        t: Translations
    ): ItemId[] {
        const ord: ItemOrdName[] = []
        items.forEach((e) => {
            const item = selectItemInt(e.stdItemId, e.craftItemId, craftedItems)
            let name = ''
            if (item) name = t.t[item.nameId]
            ord.push({ ...e, name })
        })
        return ord.sort((a, b) => a.name.localeCompare(b.name))
    })
    const reorderQta = memoizeOne(function reorderQta(items: ItemId[], storage: StorageState): ItemId[] {
        const ord: ItemOrdQta[] = []
        items.forEach((e) => {
            let qta = 0
            if (e.stdItemId) qta = storage.StdItems[e.stdItemId] ?? 0
            else if (e.craftItemId) qta = storage.CraftedItems[e.craftItemId] ?? 0
            ord.push({ ...e, qta })
        })
        return ord.sort((a, b) => a.qta - b.qta)
    })
    const reorderValue = memoizeOne(function reorderName(craftedItems: InitialState<Item>, items: ItemId[]): ItemId[] {
        const ord: ItemOrdValue[] = []
        items.forEach((e) => {
            const item = selectItemInt(e.stdItemId, e.craftItemId, craftedItems)
            ord.push({ ...e, value: item?.value ?? 0 })
        })
        return ord.sort((a, b) => a.value - b.value)
    })

    const sortDesc = memoizeOne((items: ItemId[]) => items.slice(0).reverse())

    return (state: GameState) => {
        const loc = state.locations[location]
        const stdItems = loc.storage.StdItems
        const craftedItems = loc.storage.CraftedItems
        const order = state.ui.storageOrder

        let items = orderItems(stdItems, craftedItems)
        if (order === 'name') {
            const t = selectTranslations(state)
            items = reorderName(state.craftedItems, items, t)
        } else if (order === 'quantity') items = reorderQta(items, loc.storage)
        else items = reorderValue(state.craftedItems, items)

        if (!state.ui.storageAsc) items = sortDesc(items)
        return items
    }
})

export const selectItemQta =
    (location: GameLocations | null, stdItemId?: string | null, craftItemId?: string | null) => (state: GameState) => {
        location = location ?? state.location
        const storage = state.locations[location].storage
        if (stdItemId) return storage.StdItems[stdItemId] ?? 0
        if (craftItemId) return storage.CraftedItems[craftItemId] ?? 0
        return 0
    }

export const selectGameItem =
    (stdItemId: string | null | undefined, craftItemId: string | null | undefined) => (state: GameState) => {
        if (stdItemId) return StdItems[stdItemId]
        if (craftItemId) return ItemAdapter.select(state.craftedItems, craftItemId)
    }

export const isSelected = (stdItemId: string | null, craftItemId?: string | null) => (state: GameState) => {
    if (state.ui.selectedItemLocation === null) return false
    if (state.ui.selectedStdItemId !== null && state.ui.selectedStdItemId === stdItemId) return true
    if (state.ui.selectedCraftedItemId !== null && state.ui.selectedCraftedItemId === craftItemId) return true
    return false
}

export const selectSelectedStdItemId = (state: GameState) => state.ui.selectedStdItemId
export const selectSelectedCraftedItemId = (state: GameState) => state.ui.selectedCraftedItemId

export const getSelectedItem = (state: GameState) => {
    if (state.ui.selectedItemLocation === null) return
    if (state.ui.selectedStdItemId === null && state.ui.selectedCraftedItemId === null) return
    return selectGameItem(state.ui.selectedStdItemId, state.ui.selectedCraftedItemId)(state)
}
export const getSelectedItemQta = (state: GameState) => {
    if (state.ui.selectedItemLocation === null) return 0
    if (state.ui.selectedStdItemId === null && state.ui.selectedCraftedItemId === null) return 0
    return selectItemQta(
        state.ui.selectedItemLocation,
        state.ui.selectedStdItemId,
        state.ui.selectedCraftedItemId
    )(state)
}

const getSortId = (i: ItemId) => (i.stdItemId ? `1${i.stdItemId}` : '') + (i.craftItemId ? `2${i.craftItemId}` : '')
export const selectItemsByType = memoize(function (itemType: ItemTypes | undefined): (state: GameState) => ItemId[] {
    const getStdItems = memoizeOne((std: Record<string, number>) => {
        const ret: ItemId[] = []
        for (const stdItemId of Object.keys(std)) {
            const item = StdItems[stdItemId]
            if (item?.type === itemType) ret.push({ stdItemId, craftItemId: null })
        }
        return ret
    })
    const getCraftItems = memoizeOne((craft: Record<string, number>, crafted: InitialState<Item>) => {
        const ret: ItemId[] = []
        for (const craftItemId of Object.keys(craft)) {
            const item = ItemAdapter.select(crafted, craftItemId)
            if (item?.type === itemType) ret.push({ stdItemId: null, craftItemId })
        }
        return ret
    })

    const combine = memoizeOne((std: ItemId[], craft: ItemId[]) => {
        return std.concat(craft).sort((a, b) => getSortId(a).localeCompare(getSortId(b)))
    })

    return (state: GameState) => {
        if (!itemType) return []

        const loc = state.locations[state.location]

        const std = getStdItems(loc.storage.StdItems)
        const crafted = getCraftItems(loc.storage.CraftedItems, state.craftedItems)
        return combine(std, crafted)
    }
})
