import { GameState, LocationState } from '../game/GameState'
import { GameLocations } from '../gameLocations/GameLocations'
import { StdItems } from '../items/stdItems'
import { memoize } from '../utils/memoize'
import { memoizeOne } from '../utils/memoizeOne'
import { ItemId } from './storageState'
import { ItemAdapter } from './storageFunctions'
import { Entries } from '../utils/types'

export function uniqueItemId(itemId: ItemId): string {
    if (itemId.stdItemId !== null) return `Sdt_${itemId.stdItemId}`
    if (itemId.craftItemId !== null) return `Craft_${itemId.craftItemId}`
    throw new Error(`[uniqueItemId] ${JSON.stringify(itemId)}`)
}

const selectStorageLocationsInt = memoizeOne((locations: { [k in GameLocations]: LocationState }) => {
    const res: GameLocations[] = []
    const locationsEntries = Object.entries(locations)
    for (const loc of locationsEntries) {
        if (Object.keys(loc[1].storage.StdItems).length > 0 || Object.keys(loc[1].storage.CraftedItems).length > 0)
            res.push(loc[0] as GameLocations)
    }
    return res
})

export const selectStorageLocations = (state: GameState) => selectStorageLocationsInt(state.locations)

export const selectLocationItems = memoize((location: GameLocations) => {
    const orderItems = memoizeOne((std: { [k in keyof typeof StdItems]?: number }, craft: { [k: string]: number }) => {
        const ret: ItemId[] = (Object.entries<number>(std) as Entries<{ [k in keyof typeof StdItems]: number }>)
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

    return (state: GameState) => {
        const loc = state.locations[location]
        const stdItems = loc.storage.StdItems
        const craftedItems = loc.storage.CraftedItems

        return orderItems(stdItems, craftedItems)
    }
})

export const selectItemQta =
    (location: GameLocations, stdItemId?: keyof typeof StdItems | null, craftItemId?: string | null) =>
    (state: GameState) => {
        const storage = state.locations[location].storage
        if (stdItemId) return storage.StdItems[stdItemId] ?? 0
        if (craftItemId) return storage.CraftedItems[craftItemId] ?? 0
        return 0
    }
export const selectItem =
    (stdItemId: keyof typeof StdItems | null, craftItemId: string | null) => (state: GameState) => {
        if (stdItemId) return StdItems[stdItemId]
        if (craftItemId) return ItemAdapter.select(state.craftedItems, craftItemId)
    }

export const getSelectedItem = (state: GameState) => {
    if (state.ui.selectedItemLocation === null) return
    if (state.ui.selectedStdItemId === null && state.ui.selectedCraftedItemId === null) return
    return selectItem(state.ui.selectedStdItemId, state.ui.selectedCraftedItemId)(state)
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
