import { default as microMemoize } from 'micro-memoize'
import { memoize } from 'proxy-memoize'
import { GameState, LocationState } from '../game/GameState'
import { GameLocations } from '../gameLocations/GameLocations'
import { StdItems } from '../items/stdItems'
import { memoizeOne } from '../utils/memoizeOne'
import { Entries } from '../utils/types'
import { Item, ItemTypes } from '../items/Item'
import { selectTranslations } from '../msg/useTranslations'
import { Translations } from '../msg/Msg'
import { CharacterAdapter } from '../characters/characterAdapter'
import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { CharInventory } from '../characters/inventory'
import { EMPTY_ARRAY } from '../const'
import { ItemAdapter } from './ItemAdapter'
import { InventoryNoQta, StorageState } from './storageState'
import { isCrafted } from './storageFunctions'
import { InitialState } from '@/entityAdapter/InitialState'

const selectStorageLocationsInt = memoizeOne((locations: { [k in GameLocations]: LocationState }) => {
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

type ItemId = { id: string }
type ItemOrdQta = ItemId & { qta: number }

type ItemOrdName = ItemId & { name: string }

type ItemOrdValue = ItemId & { value: number }

export const selectLocationItems = microMemoize((location: GameLocations) => {
    const orderItems = memoize((items: Record<string, number>) => {
        const ret: ItemId[] = (
            Object.entries<number | undefined>(items) as Entries<Record<string, number>>
        ).map<ItemId>((e) => {
            return {
                id: e[0],
            }
        })

        return ret
    })

    const reorderName = function reorderName(
        craftedItems: InitialState<Item>,
        items: ItemId[],
        t: Translations
    ): ItemId[] {
        const ord: ItemOrdName[] = []
        items.forEach((e) => {
            const item = selectGameItemFromCraft(e.id, craftedItems)
            let name = ''
            if (item) name = t.t[item.nameId]
            ord.push({ ...e, name })
        })
        return ord.sort((a, b) => a.name.localeCompare(b.name))
    }

    const reorderQta = function reorderQta(items: ItemId[], storage: StorageState): ItemId[] {
        const ord: ItemOrdQta[] = []
        items.forEach((e) => {
            let qta = 0
            qta = storage[e.id] ?? 0
            ord.push({ ...e, qta })
        })
        return ord.sort((a, b) => a.qta - b.qta)
    }

    const reorderValue = function reorderName(craftedItems: InitialState<Item>, items: ItemId[]): ItemId[] {
        const ord: ItemOrdValue[] = []
        items.forEach((e) => {
            const item = selectGameItemFromCraft(e.id, craftedItems)
            ord.push({ ...e, value: item?.value ?? 0 })
        })
        return ord.sort((a, b) => a.value - b.value)
    }

    const sortDesc = memoizeOne((items: ItemId[]) => items.slice(0).reverse())

    const ret = memoize((state: GameState) => {
        const loc = state.locations[location]
        const itemsObj = loc.storage
        const order = state.ui.storageOrder

        let items = orderItems(itemsObj)
        if (order === 'name') {
            const t = selectTranslations(state)
            items = reorderName(state.craftedItems, items, t)
        } else if (order === 'quantity') items = reorderQta(items, loc.storage)
        else if (order === 'value') items = reorderValue(state.craftedItems, items)

        if (!state.ui.storageAsc) items = sortDesc(items)
        return items
    })
    return ret
})

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

export const selectItemsByType = microMemoize((itemType: ItemTypes | undefined) =>
    memoize((state: GameState) => {
        if (!itemType) return EMPTY_ARRAY

        const ret: ItemIdValue[] = []
        for (const id of Object.keys(state.locations[state.location].storage)) {
            const item = selectGameItemFromCraft(id, state.craftedItems)
            if (item && item.type === itemType) ret.push({ id, value: item.value })
        }
        return ret
    })
)

const createInventoryNoQta = memoize((inventory: CharInventory) => {
    const ret: InventoryNoQta = {}

    Object.entries(inventory).forEach((kv) => {
        const slot = kv[0] as EquipSlotsEnum
        const itemIds = kv[1]
        ret[slot] = { itemId: itemIds.itemId }
    })

    return ret
})

export const selectInventoryNoQta = (charId: string) => (state: GameState) => {
    const inventory = CharacterAdapter.selectEx(state.characters, charId).inventory
    return createInventoryNoQta(inventory)
}
