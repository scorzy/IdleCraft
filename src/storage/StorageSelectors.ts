import { GameState, LocationState } from '../game/GameState'
import { GameLocations } from '../gameLocations/GameLocations'
import { StdItems } from '../items/stdItems'
import { memoize } from '../utils/memoize'
import { memoizeOne } from '../utils/memoizeOne'
import { Entries } from '../utils/types'
import { Item, ItemTypes } from '../items/Item'
import { selectTranslations } from '../msg/useTranslations'
import { Translations } from '../msg/Msg'
import { CharacterAdapter } from '../characters/characterAdapter'
import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { checkLast } from '../utils/memoizeLast'
import { ItemAdapter } from './ItemAdapter'
import { InventoryNoQta, ItemId, StorageState } from './storageState'
import { InitialState } from '@/entityAdapter/InitialState'

const selectStorageLocationsInt = memoizeOne((locations: { [k in GameLocations]: LocationState }) => {
    const res: GameLocations[] = []
    const locationsEntries = Object.entries(locations)
    for (const loc of locationsEntries) {
        if (Object.keys(loc[1].storage.stdItems).length > 0 || Object.keys(loc[1].storage.craftedItems).length > 0)
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
            if (e.stdItemId) qta = storage.stdItems[e.stdItemId] ?? 0
            else if (e.craftItemId) qta = storage.craftedItems[e.craftItemId] ?? 0
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
        const stdItems = loc.storage.stdItems
        const craftedItems = loc.storage.craftedItems
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
        if (stdItemId) return storage.stdItems[stdItemId] ?? 0
        if (craftItemId) return storage.craftedItems[craftItemId] ?? 0
        return 0
    }

export const selectGameItem =
    (stdItemId: string | null | undefined, craftItemId: string | null | undefined) => (state: GameState) =>
        selectGameItemFromCraft(stdItemId, craftItemId, state.craftedItems)

export const selectGameItemFromCraft = (
    stdItemId: string | null | undefined,
    craftItemId: string | null | undefined,
    craftedItems: InitialState<Item>
) => {
    if (stdItemId) return StdItems[stdItemId]
    if (craftItemId) return ItemAdapter.select(craftedItems, craftItemId)
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
type ItemIdValue = ItemId & { value: number }

export const selectItemsByType = memoize(function (itemType: ItemTypes | undefined): (state: GameState) => ItemId[] {
    const getStdItems = memoizeOne((std: Record<string, number>) => {
        const ret: ItemIdValue[] = []
        for (const stdItemId of Object.keys(std)) {
            const item = StdItems[stdItemId]
            if (item && item.type === itemType) ret.push({ stdItemId, craftItemId: null, value: item.value })
        }
        return ret
    })

    const getCraftItems = memoizeOne((craft: Record<string, number>, crafted: InitialState<Item>) => {
        const ret: ItemIdValue[] = []
        for (const craftItemId of Object.keys(craft)) {
            const item = ItemAdapter.select(crafted, craftItemId)
            if (item && item.type === itemType) ret.push({ stdItemId: null, craftItemId, value: item.value })
        }
        return ret
    })

    const combine = memoizeOne((std: ItemIdValue[], craft: ItemIdValue[]) =>
        std.concat(craft).sort((a, b) => a.value - b.value)
    )

    return (state: GameState) => {
        if (!itemType) return []

        const loc = state.locations[state.location]

        const std = getStdItems(loc.storage.stdItems)
        const crafted = getCraftItems(loc.storage.craftedItems, state.craftedItems)
        return combine(std, crafted)
    }
})

export const selectInventoryNoQta = memoize((charId: string) =>
    checkLast((state: GameState) => {
        const inventory = CharacterAdapter.selectEx(state.characters, charId).inventory
        const ret: InventoryNoQta = {}
        Object.entries(inventory).forEach((kv) => {
            const slot = kv[0] as EquipSlotsEnum
            const itemIds = kv[1]
            ret[slot] = {
                stdItemId: itemIds.stdItemId,
                craftItemId: itemIds.craftItemId,
            }
        })
        return ret
    })
)
