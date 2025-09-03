import { createSelector } from 'reselect'
import { GameState, LocationState } from '../game/GameState'
import { GameLocations } from '../gameLocations/GameLocations'
import { StdItems } from '../items/stdItems'
import { myMemoizeOne } from '../utils/myMemoizeOne'
import { Item, ItemFilter, ItemTypes } from '../items/Item'
import { selectTranslations } from '../msg/useTranslations'
import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { CharInventory } from '../characters/inventory'
import { EMPTY_ARRAY } from '../const'
import { myMemoize } from '../utils/myMemoize'
import { Translations } from '../msg/Msg'
import { createDeepEqualSelector } from '../utils/createDeepEqualSelector'
import { useGameStore } from '../game/state'
import { selectStorageOrder } from '../ui/state/uiSelectors'
import { filterItem } from '../items/itemSelectors'
import { createMemoizeLatestSelector } from '../utils/createMemoizeLatestSelector'
import { ItemAdapter } from './ItemAdapter'
import { InventoryNoQta } from './storageTypes'
import { isCrafted } from './storageFunctions'
import { InitialState } from '@/entityAdapter/InitialState'

const selectStorageLocationsInt = myMemoizeOne((locations: Record<GameLocations, LocationState>) => {
    const res: GameLocations[] = []
    const locationsEntries = Object.entries(locations)
    for (const loc of locationsEntries) if (Object.keys(loc[1].storage).length > 0) res.push(loc[0] as GameLocations)

    return res
})

export const selectGameItemFromCraft = (itemId: string, craftedItems: InitialState<Item>) => {
    if (!isCrafted(itemId)) return StdItems[itemId]
    else return ItemAdapter.select(craftedItems, itemId)
}

export const selectStorageLocations = (state: GameState) => selectStorageLocationsInt(state.locations)

interface ItemId {
    id: string
}
type ItemOrdQta = ItemId & { qta: number }
type ItemOrdName = ItemId & { name: string }
type ItemOrdValue = ItemId & { value: number }

const locationItemIdSelectors = new Map<GameLocations, (state: GameState) => ItemId[]>()
const locationItemsSelectors: {
    location: GameLocations
    storageOrder: string
    selector: (state: GameState) => ItemId[]
}[] = []

export const selectLocationItemIds = (location: GameLocations) => {
    let selector = locationItemIdSelectors.get(location)
    if (!selector) {
        selector = createDeepEqualSelector(
            [(state: GameState) => state.locations[location].storage],
            (storage: Record<string, number>) => {
                return Object.keys(storage).map<ItemId>((id) => ({ id }))
            }
        )
        locationItemIdSelectors.set(location, selector)
    }
    return selector
}

const reorderByName = (t: Translations, items: ItemId[], craftedItems: InitialState<Item>, storageAsc: boolean) => {
    const ord: ItemOrdName[] = []
    for (const e of items) {
        const item = selectGameItemFromCraft(e.id, craftedItems)
        let name = ''
        if (item) name = t.t[item.nameId]
        ord.push({ ...e, name })
    }
    if (!storageAsc) return ord.sort((a, b) => b.name.localeCompare(a.name))
    return ord.sort((a, b) => a.name.localeCompare(b.name))
}

const reorderByQta = (storage: Record<string, number>, items: ItemId[], storageAsc: boolean) => {
    const ord: ItemOrdQta[] = []
    for (const e of items) {
        let qta = 0
        qta = storage[e.id] ?? 0
        ord.push({ ...e, qta })
    }
    if (!storageAsc) return ord.sort((a, b) => b.qta - a.qta)
    return ord.sort((a, b) => a.qta - b.qta)
}

const reorderByValue = (craftedItems: InitialState<Item>, items: ItemId[], storageAsc: boolean) => {
    const ord: ItemOrdValue[] = []
    for (const e of items) {
        const item = selectGameItemFromCraft(e.id, craftedItems)
        ord.push({ ...e, value: item?.value ?? 0 })
    }
    if (!storageAsc) return ord.sort((a, b) => b.value - a.value)
    return ord.sort((a, b) => a.value - b.value)
}

const selectLocationItemsSelector = (location: GameLocations, storageOrder: string) => {
    let selector = locationItemsSelectors.find(
        (e) => e.location === location && e.storageOrder === storageOrder
    )?.selector

    if (!selector) {
        if (storageOrder === 'name')
            selector = createSelector(
                [
                    selectTranslations,
                    selectLocationItemIds(location),
                    (state: GameState) => state.craftedItems,
                    (state: GameState) => state.ui.storageAsc,
                ],
                (translations, items, craftedItems, storageAsc) =>
                    reorderByName(translations, items, craftedItems, storageAsc)
            )
        else if (storageOrder === 'quantity')
            selector = createSelector(
                [
                    (state: GameState) => state.locations[location].storage,
                    selectLocationItemIds(location),
                    (state: GameState) => state.ui.storageAsc,
                ],
                reorderByQta
            )
        else if (storageOrder === 'value')
            selector = createSelector(
                [
                    (state: GameState) => state.craftedItems,
                    selectLocationItemIds(location),
                    (state: GameState) => state.ui.storageAsc,
                ],
                reorderByValue
            )
        else throw new Error(`Unknown storage order ${storageOrder}`)
    }
    locationItemsSelectors.push({ location, storageOrder, selector })
    return selector
}

export const useLocationItems = (location: GameLocations) => {
    const storageOrder = useGameStore(selectStorageOrder)
    return useGameStore(selectLocationItemsSelector(location, storageOrder))
}

export const selectItemQta = (location: GameLocations | null, itemId: string) => (state: GameState) => {
    location = location ?? state.location
    const storage = state.locations[location].storage
    return storage[itemId] ?? 0
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
type ItemIdValue = ItemId & { value: number }

const itemTypeSelectors = new Map<ItemTypes, (state: GameState) => ItemIdValue[]>()
export const selectItemsByType = (itemType: ItemTypes | undefined) => {
    if (!itemType) return (_state: GameState) => EMPTY_ARRAY
    let selector = itemTypeSelectors.get(itemType)
    if (!selector) {
        selector = createDeepEqualSelector(
            [(state: GameState) => state.locations[state.location].storage, (state: GameState) => state.craftedItems],
            (storage, craftedItems) => {
                const ret: ItemIdValue[] = []
                for (const id of Object.keys(storage).sort()) {
                    const item = selectGameItemFromCraft(id, craftedItems)
                    if (item && item.type === itemType) ret.push({ id, value: item.value })
                }
                return ret
            }
        )
    }
    itemTypeSelectors.set(itemType, selector)
    return selector
}

export const createInventoryNoQta = myMemoize((inventory: CharInventory) => {
    const ret: InventoryNoQta = {}

    Object.entries(inventory)
        .sort()
        .forEach((kv) => {
            const slot = kv[0] as EquipSlotsEnum
            const itemIds = kv[1]
            ret[slot] = { itemId: itemIds.itemId }
        })

    return ret
})

export const selectFilteredItems = createMemoizeLatestSelector(
    [
        (s: GameState) => s.locations[s.location].storage,
        (s: GameState) => s.craftedItems,
        (_s: GameState, itemFilter: ItemFilter) => itemFilter,
    ],
    (storage, craftedItems, itemFilter) => {
        if (!itemFilter) return EMPTY_ARRAY

        const ret: ItemIdValue[] = []
        for (const id of Object.keys(storage).sort()) {
            const item = selectGameItemFromCraft(id, craftedItems)
            if (item && filterItem(item, itemFilter)) ret.push({ id, value: item.value })
        }

        return ret
    }
)
