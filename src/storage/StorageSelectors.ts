import { memoize } from 'proxy-memoize'

import { InitialState } from '@/entityAdapter/InitialState'

import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { CharInventory } from '../characters/inventory'
import { EMPTY_ARRAY } from '../const'
import { GameState } from '../game/GameState'

import { GameLocations } from '../gameLocations/GameLocations'
import { GetItemNameParamsMemoized } from '../items/GetItemNameParamsMemoized'
import { Item, ItemFilter, ItemSubType, ItemTypes } from '../items/Item'
import { filterItem } from '../items/selectors/itemSelectors'
import { selectItemNameMemoized } from '@/items/selectors/itemSelectorsMemo'
import { StdItems, UnlimitedItems } from '../items/stdItems'
import { selectTranslations } from '../msg/useTranslations'

import { ItemAdapter } from './ItemAdapter'
import { StorageAdapter } from './storageAdapter'
import { isCrafted } from './storageFunctions'
import { InventoryNoQta, StorageState } from './storageTypes'
import { getItemSubType } from '../items/getItemSubType'
import { useMemo } from 'react'
import { useGameStore } from '../game/state'
import {
    selectStorageOrder,
    selectItemFilterSubType,
    selectItemFilterType,
    selectItemFilterSearch,
} from '../ui/state/uiSelectors'

export const selectCurrentLocationStorageIds = (state: GameState) =>
    StorageAdapter.getIds(state.locations[state.location].storage)

export const selectGameItemFromCraft = (itemId: string, craftedItems: InitialState<Item>) => {
    if (!isCrafted(itemId)) return StdItems[itemId]
    else return ItemAdapter.select(craftedItems, itemId)
}

export const selectStorageLocationsMemo = memoize((state: GameState) => {
    const res: GameLocations[] = []
    const locationsEntries = Object.entries(state.locations)
    for (const loc of locationsEntries) if (loc[1].storage.ids.length > 0) res.push(loc[0] as GameLocations)

    return res
})

interface ItemId {
    item: Item
    name: string
}
type ItemOrdQta = ItemId & { qta: number }
type ItemOrdValue = ItemId & { value: number }

const reorderByName = (items: ItemId[]) => items.toSorted((a, b) => a.name.localeCompare(b.name))

const reorderByQta = (storage: InitialState<StorageState>, items: ItemId[]) => {
    const ord: ItemOrdQta[] = []
    for (const e of items) {
        const qta = storage.entries[e.item.id]?.quantity ?? 0
        ord.push({ ...e, qta })
    }
    return ord.toSorted((a, b) => a.qta - b.qta)
}

const reorderByValue = (craftedItems: InitialState<Item>, items: ItemId[]) => {
    const ord: ItemOrdValue[] = []
    for (const e of items) {
        const item = selectGameItemFromCraft(e.item.id, craftedItems)
        ord.push({ ...e, value: item?.value ?? 0 })
    }
    return ord.toSorted((a, b) => a.value - b.value)
}

const sortFunc = (sel: (state: GameState) => ItemId[]) => (s: GameState) => {
    const items = sel(s)
    if (items.length === 0) return EMPTY_ARRAY
    if (!s.ui.storageAsc) items.reverse()
    return items.map((i) => i.item.id)
}

const selectLocationItemsSelector = (
    location: GameLocations,
    storageOrder: string,
    itemSubType: ItemSubType | undefined,
    itemType: ItemTypes | undefined,
    itemSearch: string | undefined
) => {
    let selector: (state: GameState) => string[]

    const selectLocationItemIds = (state: GameState) => {
        const itemIds: ItemId[] = []
        const t = selectTranslations(state)
        const itemSearchStr = itemSearch?.toLowerCase() ?? ''
        const checkType = itemType && itemSubType && getItemSubType(itemType) === itemSubType
        StorageAdapter.forEach(state.locations[location].storage, (st) => {
            const item = selectGameItem(st.itemId)(state)
            if (!item) return
            if (itemSubType && getItemSubType(item.type) !== itemSubType) return
            if (checkType && item.type !== itemType) return
            const name = selectItemNameMemoized(
                item.nameFunc,
                GetItemNameParamsMemoized(item.nameId, item.materials),
                t
            )
            if (itemSearchStr !== '' && !name.toLowerCase().includes(itemSearchStr)) return
            itemIds.push({ item, name })
        })
        return itemIds
    }

    if (storageOrder === 'name') selector = sortFunc((s: GameState) => reorderByName(selectLocationItemIds(s)))
    else if (storageOrder === 'quantity')
        selector = sortFunc((s: GameState) => reorderByQta(s.locations[location].storage, selectLocationItemIds(s)))
    else if (storageOrder === 'value')
        selector = sortFunc((s: GameState) => reorderByValue(s.craftedItems, selectLocationItemIds(s)))
    else throw new Error(`Unknown storage order ${storageOrder}`)

    return selector
}

export const useLocationItems = (location: GameLocations) => {
    const storageOrder = useGameStore(selectStorageOrder)
    const itemSubType = useGameStore(selectItemFilterSubType)
    const itemType = useGameStore(selectItemFilterType)
    const itemSearch = useGameStore(selectItemFilterSearch)

    const selectLocationItemsSelectorMemo = useMemo(
        () => memoize(selectLocationItemsSelector(location, storageOrder, itemSubType, itemType, itemSearch)),
        [location, storageOrder, itemSubType, itemType, itemSearch]
    )

    return useGameStore(selectLocationItemsSelectorMemo)
}

export const selectItemQta = (location: GameLocations | null, itemId: string) => (state: GameState) => {
    if (!isCrafted(itemId) && StdItems[itemId]?.unlimited) return Number.POSITIVE_INFINITY

    location = location ?? state.location
    const storage = state.locations[location].storage
    return storage.entries[itemId]?.quantity ?? 0
}

export const selectGameItem = (itemId: string) => (state: GameState) =>
    selectGameItemFromCraft(itemId, state.craftedItems)

export const isSelected = (itemId: string | null) => (state: GameState) => {
    if (!state.ui.selectedItemLocation) return false
    if (state.ui.selectedItemId && state.ui.selectedItemId === itemId) return true
    return false
}

export const selectSelectedItemId = (state: GameState) => state.ui.selectedItemId

export const getSelectedItem = (state: GameState) => {
    if (!state.ui.selectedItemLocation) return
    if (!state.ui.selectedItemId) return
    return selectGameItem(state.ui.selectedItemId)(state)
}
export const getSelectedItemQta = (state: GameState) => {
    if (!state.ui.selectedItemLocation) return 0
    if (!state.ui.selectedItemId) return 0
    return selectItemQta(state.ui.selectedItemLocation, state.ui.selectedItemId)(state)
}
export const isSelectedItemCurrentLocation = (state: GameState) => {
    if (!state.ui.selectedItemLocation) return false
    return state.ui.selectedItemLocation === state.location
}
export const selectItemsByType = (itemType: ItemTypes | undefined) => (state: GameState) => {
    if (!itemType) return EMPTY_ARRAY
    const ret: string[] = []

    StorageAdapter.forEach(state.locations[state.location].storage, (st) => {
        const item = selectGameItemFromCraft(st.itemId, state.craftedItems)
        if (item && item.type === itemType) ret.push(st.itemId)
    })

    if (ret.length === 0) return EMPTY_ARRAY
    return ret
}

export const createInventoryNoQta = (inventory: CharInventory) => {
    const ret: InventoryNoQta = {}

    Object.entries(inventory)
        .toSorted(([a], [b]) => a.localeCompare(b))
        .forEach((kv) => {
            const slot = kv[0] as EquipSlotsEnum
            const itemIds = kv[1]
            ret[slot] = { itemId: itemIds.itemId }
        })

    return ret
}

export const selectFilteredItems = (s: GameState, itemFilter: ItemFilter) => {
    if (!itemFilter) return EMPTY_ARRAY

    const storageIds = selectCurrentLocationStorageIds(s)

    const ret: string[] = []
    for (const id of storageIds) {
        const item = selectGameItemFromCraft(id, s.craftedItems)
        if (item && filterItem(item, itemFilter)) ret.push(id)
    }

    UnlimitedItems.forEach((item) => {
        if (!item.unlimited) return
        if (filterItem(item, itemFilter)) ret.push(item.id)
    })

    return ret
}

export const selectTotalFilteredQta = (s: GameState, location: GameLocations, itemFilter: ItemFilter) => {
    let ret = 0

    const itemFilterIds = selectFilteredItems(s, itemFilter)

    for (const itemId of itemFilterIds) ret += s.locations[location].storage.entries[itemId]?.quantity ?? 0

    return ret
}

export const selectFilteredItemsNumber = (state: GameState, itemFilter: ItemFilter) =>
    selectFilteredItems(state, itemFilter).length
