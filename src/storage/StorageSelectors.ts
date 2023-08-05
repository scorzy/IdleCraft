import { GameState, LocationState } from '../game/GameState'
import { GameLocations } from '../gameLocations/GameLocations'
import { StdItems } from '../items/stdItems'
import { memoize } from '../utils/memoize'
import { memoizeOne } from '../utils/memoizeOne'
import { ItemId } from './storageState'

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
    const orderItems = memoizeOne((std: { [k: string]: number }, craft: { [k: string]: number }) => {
        const ret: ItemId[] = Object.entries(std)
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
    (location: GameLocations, stdItemId: string | null, craftItemId: string | null) => (state: GameState) => {
        const storage = state.locations[location].storage
        if (stdItemId) return storage.StdItems[stdItemId] ?? 0
        if (craftItemId) return storage.CraftedItems[craftItemId] ?? 0
        return 0
    }
export const selectItem = (stdItemId: string | null, craftItemId: string | null) => (state: GameState) => {
    if (stdItemId) return StdItems[stdItemId]
    if (craftItemId) return state.craftedItems[craftItemId]
}
